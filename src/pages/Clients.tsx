import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { ClientsHeader } from "../components/client/ClientsHeader";
import { ClientsSearch } from "../components/client/ClientsSearch";
import { ClientsTable } from "../components/client/ClientsTable";
import { ClientsCards } from "../components/client/ClientsCards";
import { ClientFormModal } from "../components/client/ClientFormModal";
import { ClientDeleteModal } from "../components/client/ClientDeleteModal";
import { ClientDropdownMenu } from "../components/client/ClientDropdownMenu";
import type { Client } from "../components/client/types";

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal toggles & dropdown contexts
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [invoiceCount, setInvoiceCount] = useState<number | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  // Form field states
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  // UI mutation states
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Your session has expired. Sign in again to see your clients.");
      }

      const { data, error: dbError } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;
      setClients(data || []);
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching clients:", error);
      setLoadError(error.message || "We couldn't load your clients.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load clients on component mount
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) {
        fetchClients();
      }
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [fetchClients]);

  useEffect(() => {
    document.title = "Client Directory | Invoicely";
  }, []);

  const closeMenu = () => {
    setActiveMenuId(null);
    setMenuPosition(null);
  };

  // Close dropdown menu on scroll, resize, or Escape
  useEffect(() => {
    if (activeMenuId) {
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeMenu();
      };
      window.addEventListener("scroll", closeMenu, true);
      window.addEventListener("resize", closeMenu);
      window.addEventListener("keydown", handleKey);
      return () => {
        window.removeEventListener("scroll", closeMenu, true);
        window.removeEventListener("resize", closeMenu);
        window.removeEventListener("keydown", handleKey);
      };
    }
  }, [activeMenuId]);

  // Open modal for adding a new client
  const openAddModal = () => {
    setSelectedClient(null);
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setClientAddress("");
    setActionError(null);
    setNameError(null);
    setIsFormModalOpen(true);
  };

  // Open modal for editing an existing client
  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setClientName(client.client_name || "");
    setClientEmail(client.email || "");
    setClientPhone(client.phone_number || "");
    setClientAddress(client.address || "");
    setActionError(null);
    setNameError(null);
    setIsFormModalOpen(true);
    closeMenu();
  };

  // Open confirmation modal for deleting a client. The database won't delete a
  // client that still has invoices, so count them first and say so up front.
  const openDeleteModal = async (client: Client) => {
    setSelectedClient(client);
    setActionError(null);
    setInvoiceCount(null);
    setIsDeleteModalOpen(true);
    closeMenu();

    const { count, error } = await supabase
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("client_id", client.id);

    if (error) {
      console.error("Error counting client invoices:", error);
      setActionError("We couldn't check this client's invoices, so deleting is paused. Close and try again.");
      return;
    }
    setInvoiceCount(count ?? 0);
  };

  const handleMenuToggle = (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation();
    if (activeMenuId === clientId) {
      closeMenu();
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setActiveMenuId(clientId);
      setMenuPosition({
        top: rect.bottom,
        right: window.innerWidth - rect.right,
      });
    }
  };

  // Handle client creation or update form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setNameError("Enter the client's name. It's printed on every invoice.");
      return;
    }

    try {
      setSubmitting(true);
      setActionError(null);
      setNameError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Your session has expired. Sign in again to save this client.");

      const clientData = {
        client_name: clientName.trim(),
        email: clientEmail.trim() || null,
        phone_number: clientPhone.trim() || null,
        address: clientAddress.trim() || null,
      };

      if (selectedClient) {
        // Edit flow
        const { data, error } = await supabase
          .from("clients")
          .update(clientData)
          .eq("id", selectedClient.id)
          .select()
          .single();

        if (error) throw error;

        // Update locally
        setClients((prev) =>
          prev.map((c) => (c.id === selectedClient.id ? data : c)),
        );
      } else {
        // Add flow
        const { data, error } = await supabase
          .from("clients")
          .insert({
            ...clientData,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        // Prepend locally
        setClients((prev) => [data, ...prev]);
      }

      setIsFormModalOpen(false);
    } catch (err) {
      const error = err as Error;
      console.error("Error submitting client form:", error);
      setActionError(error.message || "The client wasn't saved. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle client deletion confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedClient || invoiceCount !== 0) return;

    try {
      setSubmitting(true);
      setActionError(null);

      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", selectedClient.id);

      if (error) {
        // An invoice was added for this client after the dialog opened
        if (error.code === "23503") {
          throw new Error("This client now has invoices. Delete those first, then try again.");
        }
        throw error;
      }

      // Remove locally
      setClients((prev) => prev.filter((c) => c.id !== selectedClient.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      const error = err as Error;
      console.error("Error deleting client:", error);
      setActionError(error.message || "The client wasn't deleted. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter clients based on search query
  const filteredClients = clients.filter((client) => {
    const searchLower = searchQuery.trim().toLowerCase();
    return (
      (client.client_name || "").toLowerCase().includes(searchLower) ||
      (client.email || "").toLowerCase().includes(searchLower) ||
      (client.address || "").toLowerCase().includes(searchLower) ||
      (client.phone_number || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-7xl mx-auto text-fg selection:bg-line-strong">
      {/* Page Header */}
      <ClientsHeader onAddClick={openAddModal} />

      {/* Controls Bar (Search) */}
      {clients.length > 0 && (
        <ClientsSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          total={clients.length}
          matching={filteredClients.length}
        />
      )}

      {/* Main Content Area */}
      {loading ? (
        <div aria-busy="true" aria-label="Loading clients" className="border-y border-line divide-y divide-line">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-6 py-4 motion-safe:animate-pulse">
              <div className="h-3.5 w-32 rounded bg-line" />
              <div className="h-3.5 w-44 rounded bg-line" />
              <div className="hidden h-3.5 w-24 rounded bg-line md:block" />
            </div>
          ))}
        </div>
      ) : loadError && clients.length === 0 ? (
        <div className="max-w-md border-t border-fg pt-5">
          <h2 className="font-medium text-fg">We couldn't load your clients</h2>
          <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{loadError}</p>
          <button
            type="button"
            onClick={fetchClients}
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-line-strong px-3.5 py-2 text-sm font-medium text-fg hover:border-fg-subtle hover:bg-surface transition-colors cursor-pointer"
          >
            <FiRefreshCw className="size-3.5" />
            Try again
          </button>
        </div>
      ) : clients.length === 0 ? (
        <div className="max-w-md border-t border-fg pt-5">
          <h2 className="font-medium text-fg">No clients yet</h2>
          <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">
            Add a client's name, contact details and billing address once. You
            can then pick them from a list when you write an invoice.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-canvas transition hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-muted cursor-pointer"
          >
            <FiPlus className="size-4 shrink-0" />
            Add your first client
          </button>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="border-y border-line py-10 text-center">
          <p className="text-sm text-fg-muted">
            No clients match <span className="text-fg">"{searchQuery.trim()}"</span>
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-3 text-sm font-medium text-fg hover:text-fg-muted transition-colors cursor-pointer"
          >
            Clear search
          </button>
        </div>
      ) : (
        <>
          <ClientsTable
            filteredClients={filteredClients}
            activeMenuId={activeMenuId}
            handleMenuToggle={handleMenuToggle}
          />
          <ClientsCards
            filteredClients={filteredClients}
            activeMenuId={activeMenuId}
            handleMenuToggle={handleMenuToggle}
          />
        </>
      )}

      {/* Form Modal (Add / Edit Client) */}
      <ClientFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        selectedClient={selectedClient}
        submitting={submitting}
        actionError={actionError}
        nameError={nameError}
        clientName={clientName}
        setClientName={(val) => {
          setClientName(val);
          if (nameError && val.trim()) setNameError(null);
        }}
        clientEmail={clientEmail}
        setClientEmail={setClientEmail}
        clientPhone={clientPhone}
        setClientPhone={setClientPhone}
        clientAddress={clientAddress}
        setClientAddress={setClientAddress}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <ClientDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        selectedClient={selectedClient}
        invoiceCount={invoiceCount}
        submitting={submitting}
        actionError={actionError}
        onDeleteConfirm={handleDeleteConfirm}
      />

      {/* Context Menu (fixed to the viewport so the table can't clip it) */}
      <ClientDropdownMenu
        activeMenuId={activeMenuId}
        menuPosition={menuPosition}
        clients={clients}
        onClose={closeMenu}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
      />
    </main>
  );
};

export default Clients;
