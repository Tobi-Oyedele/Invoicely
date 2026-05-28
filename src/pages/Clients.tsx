import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { FiUser, FiPlus } from "react-icons/fi";
import { ClientsHeader } from "../components/client/ClientsHeader";
import { ClientsSearch } from "../components/client/ClientsSearch";
import { ClientsTable } from "../components/client/ClientsTable";
import { ClientsCards } from "../components/client/ClientsCards";
import { ClientFormModal } from "../components/client/ClientFormModal";
import { ClientDeleteModal } from "../components/client/ClientDeleteModal";
import { ClientDropdownMenu } from "../components/client/ClientDropdownMenu";

interface Client {
  id: string;
  user_id: string;
  client_name: string;
  email: string;
  phone_number: string;
  address: string;
  created_at: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal toggles & dropdown contexts
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
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

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Failed to retrieve active session.");
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

  // Close dropdown menu on viewport scroll or resize to keep it positioned correctly
  useEffect(() => {
    if (activeMenuId) {
      const handleClose = () => {
        setActiveMenuId(null);
        setMenuPosition(null);
      };
      window.addEventListener("scroll", handleClose, true);
      window.addEventListener("resize", handleClose);
      return () => {
        window.removeEventListener("scroll", handleClose, true);
        window.removeEventListener("resize", handleClose);
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
    setIsFormModalOpen(true);
    setActiveMenuId(null);
    setMenuPosition(null);
  };

  // Open confirmation modal for deleting a client
  const openDeleteModal = (client: Client) => {
    setSelectedClient(client);
    setActionError(null);
    setIsDeleteModalOpen(true);
    setActiveMenuId(null);
    setMenuPosition(null);
  };

  const handleMenuToggle = (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation();
    if (activeMenuId === clientId) {
      setActiveMenuId(null);
      setMenuPosition(null);
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
      setActionError("Client name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setActionError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No active session found.");

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
      setActionError(error.message || "Failed to save client details.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle client deletion confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedClient) return;

    try {
      setSubmitting(true);
      setActionError(null);

      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", selectedClient.id);

      if (error) throw error;

      // Remove locally
      setClients((prev) => prev.filter((c) => c.id !== selectedClient.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      const error = err as Error;
      console.error("Error deleting client:", error);
      setActionError(error.message || "Failed to delete client.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter clients based on search query
  const filteredClients = clients.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (client.client_name || "").toLowerCase().includes(searchLower) ||
      (client.email || "").toLowerCase().includes(searchLower) ||
      (client.address || "").toLowerCase().includes(searchLower) ||
      (client.phone_number || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-7xl mx-auto selection:bg-zinc-100 dark:selection:bg-zinc-800 transition-all">
      {/* Page Header */}
      <ClientsHeader onAddClick={openAddModal} />

      {/* Controls Bar (Search) */}
      {clients.length > 0 && (
        <ClientsSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      {/* Main Content Area */}
      {loading ? (
        // Skeleton loader
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xs animate-pulse">
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-14 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-900/50"
              ></div>
            ))}
          </div>
        </div>
      ) : clients.length === 0 ? (
        // Empty State
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 md:p-16 text-center shadow-xs max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900/60 rounded-2xl flex items-center justify-center text-zinc-400 dark:text-zinc-50 mb-6 shadow-xs select-none">
            <FiUser className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            No clients in your directory
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-sm mb-8 leading-relaxed">
            Add your client contacts and billing addresses here. You'll be able
            to select them instantly when drafting a new invoice.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 dark:text-zinc-950 rounded-xl px-6 py-3 text-sm font-semibold transition-all shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Your First Client</span>
          </button>
        </div>
      ) : filteredClients.length === 0 ? (
        // No Search Results
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-xs">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            No clients match your search query:{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              "{searchQuery}"
            </span>
          </p>
        </div>
      ) : (
        // Responsive list representation (Table for Desktop, Cards for Mobile)
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
          <ClientsTable
            filteredClients={filteredClients}
            handleMenuToggle={handleMenuToggle}
          />
          <ClientsCards
            filteredClients={filteredClients}
            handleMenuToggle={handleMenuToggle}
          />
        </div>
      )}

      {/* Form Modal (Add / Edit Client) */}
      <ClientFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        selectedClient={selectedClient}
        submitting={submitting}
        actionError={actionError}
        clientName={clientName}
        setClientName={setClientName}
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
        submitting={submitting}
        actionError={actionError}
        onDeleteConfirm={handleDeleteConfirm}
      />

      {/* Dynamic Context Menu (Fixed positioning to prevent clipping inside scroll containers) */}
      <ClientDropdownMenu
        activeMenuId={activeMenuId}
        menuPosition={menuPosition}
        clients={clients}
        setActiveMenuId={setActiveMenuId}
        setMenuPosition={setMenuPosition}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
      />
    </main>
  );
};

export default Clients;
