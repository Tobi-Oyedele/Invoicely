import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { formatDate } from "../../utils/date";
import { FormAlert } from "../../components/auth/FormAlert";
import { Dialog } from "../../components/ui/Dialog";
import { StatusDot } from "../../components/invoices/status";
import {
  STATUSES,
  STATUS_STYLES,
  type InvoiceStatus,
} from "../../components/invoices/statusStyles";
import {
  FiSearch,
  FiPlus,
  FiMoreHorizontal,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiX,
  FiLoader,
  FiCheck,
  FiAlertCircle,
  FiArrowRight,
  FiRefreshCw,
} from "react-icons/fi";

interface LineItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface Client {
  client_name: string;
}

interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  notes?: string;
  created_at: string;
  line_items: LineItem[];
  clients: Client | null;
  currency?: string | null;
}

const menuItemClass =
  "w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-fg-muted hover:text-fg hover:bg-surface focus-visible:bg-surface focus-visible:text-fg focus-visible:outline-none transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const floatingLayerClass =
  "fixed z-40 rounded-md border border-line bg-raised py-1 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.35)] animate-rise";

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-canvas transition hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-muted cursor-pointer";

const InvoicesPage = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Dropdown states
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeStatusSelectorId, setActiveStatusSelectorId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);
  const [statusSelectorPosition, setStatusSelectorPosition] = useState<{ top: number; right: number } | null>(null);

  // Confirmation modal states
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Your session has expired. Sign in again to see your invoices.");
      }

      const { data, error: dbError } = await supabase
        .from("invoices")
        .select(`
          *,
          line_items (*),
          clients (client_name)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;
      setInvoices(data || []);
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching invoices:", error);
      setLoadError(error.message || "We couldn't load your invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) {
        fetchInvoices();
      }
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) return;

        const { data: profile, error: dbError } = await supabase
          .from("profiles")
          .select("bank_name, account_number")
          .eq("id", user.id)
          .maybeSingle();

        if (dbError) throw dbError;

        const missing = [];
        if (!profile) {
          missing.push("bank name", "account number");
        } else {
          if (!profile.bank_name) missing.push("bank name");
          if (!profile.account_number) missing.push("account number");
        }

        setMissingFields(missing);
      } catch (err) {
        console.error("Error checking profile status in invoices page:", err);
      }
    };

    checkProfileStatus();
  }, []);

  useEffect(() => {
    document.title = "My Invoices | Invoicely";
  }, []);

  const closeMenus = () => {
    setActiveMenuId(null);
    setActiveStatusSelectorId(null);
    setMenuPosition(null);
    setStatusSelectorPosition(null);
  };

  // Close menus on scroll, resize, or Escape
  useEffect(() => {
    if (activeMenuId || activeStatusSelectorId) {
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeMenus();
      };
      window.addEventListener("scroll", closeMenus, true);
      window.addEventListener("resize", closeMenus);
      window.addEventListener("keydown", handleKey);
      return () => {
        window.removeEventListener("scroll", closeMenus, true);
        window.removeEventListener("resize", closeMenus);
        window.removeEventListener("keydown", handleKey);
      };
    }
  }, [activeMenuId, activeStatusSelectorId]);

  const handleStatusChange = async (invoiceId: string, newStatus: InvoiceStatus) => {
    try {
      setSubmitting(true);
      setActionError(null);
      const { error } = await supabase
        .from("invoices")
        .update({ status: newStatus })
        .eq("id", invoiceId);

      if (error) throw error;

      // Update local state dynamically
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: newStatus } : inv))
      );
      closeMenus();
    } catch (err) {
      const error = err as Error;
      console.error("Error updating status:", error);
      setActionError(error.message || "The status didn't change. Try again.");
      closeMenus();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;

    try {
      setSubmitting(true);
      setActionError(null);

      // Deleting cascade should ideally handle line_items automatically in standard Supabase relations.
      // But we double check and handle deletion safely.
      const { error } = await supabase
        .from("invoices")
        .delete()
        .eq("id", invoiceToDelete.id);

      if (error) throw error;

      // Filter locally
      setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceToDelete.id));
      setInvoiceToDelete(null);
    } catch (err) {
      const error = err as Error;
      console.error("Error deleting invoice:", error);
      setActionError(error.message || "The invoice wasn't deleted. Try again.");
      setInvoiceToDelete(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: calculate total invoice amount
  const calculateTotal = (lineItems: LineItem[] = []) =>
    lineItems.reduce((sum, item) => sum + (item.quantity || 0) * (item.rate || 0), 0);

  // Helper: amount without symbol; the currency code sits beside it so columns align
  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  // Filter invoices based on search
  const filteredInvoices = invoices.filter((inv) => {
    const searchLower = searchQuery.trim().toLowerCase();
    const clientName = inv.clients?.client_name || "";
    const invNumber = inv.invoice_number || "";
    return (
      clientName.toLowerCase().includes(searchLower) ||
      invNumber.toLowerCase().includes(searchLower)
    );
  });

  const handleMenuToggle = (e: React.MouseEvent, invoiceId: string) => {
    e.stopPropagation();
    setActiveStatusSelectorId(null);
    if (activeMenuId === invoiceId) {
      setActiveMenuId(null);
      setMenuPosition(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setActiveMenuId(invoiceId);
      setMenuPosition({
        top: rect.bottom,
        right: window.innerWidth - rect.right,
      });
    }
  };

  const handleStatusSelectorToggle = (e: React.MouseEvent, invoiceId: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (activeStatusSelectorId === invoiceId) {
      setActiveStatusSelectorId(null);
      setStatusSelectorPosition(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setActiveStatusSelectorId(invoiceId);
      setStatusSelectorPosition({
        top: rect.bottom,
        right: window.innerWidth - rect.right,
      });
    }
  };

  const selectedMenuInvoice = invoices.find((inv) => inv.id === activeMenuId);
  const selectedStatusInvoice = invoices.find((inv) => inv.id === activeStatusSelectorId);

  const renderStatusButton = (invoice: Invoice) => (
    <button
      type="button"
      onClick={(e) => handleStatusSelectorToggle(e, invoice.id)}
      aria-haspopup="menu"
      aria-expanded={activeStatusSelectorId === invoice.id}
      aria-label={`Status: ${invoice.status}. Change status`}
      className={`inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-xs font-medium capitalize transition-colors hover:border-line-strong hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-fg-muted cursor-pointer ${STATUS_STYLES[invoice.status].text}`}
    >
      <StatusDot status={invoice.status} />
      {invoice.status}
    </button>
  );

  const renderActionsButton = (invoice: Invoice) => (
    <button
      type="button"
      onClick={(e) => handleMenuToggle(e, invoice.id)}
      aria-haspopup="menu"
      aria-expanded={activeMenuId === invoice.id}
      aria-label={`Actions for ${invoice.invoice_number || "invoice"}`}
      className="flex size-8 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-raised hover:text-fg focus-visible:outline-2 focus-visible:outline-fg-muted cursor-pointer"
    >
      <FiMoreHorizontal className="size-4" />
    </button>
  );

  const renderAmount = (invoice: Invoice) => (
    <span className="font-mono tabular-nums whitespace-nowrap">
      <span className="text-fg">{formatAmount(calculateTotal(invoice.line_items))}</span>{" "}
      <span className="text-xs text-fg-subtle">{invoice.currency || "NGN"}</span>
    </span>
  );

  return (
    <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-7xl mx-auto text-fg selection:bg-line-strong">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-[-0.03em] text-fg">
            Invoices
          </h1>
          <p className="mt-1.5 text-sm text-fg-muted">
            Create invoices, download them as PDFs, and track which ones are paid.
          </p>
        </div>
        <Link to="/invoices/new" className={`${primaryButtonClass} shrink-0 w-full md:w-auto`}>
          <FiPlus className="size-4 shrink-0" />
          New invoice
        </Link>
      </div>

      {/* Profile Setup Reminder */}
      {missingFields.length > 0 && (
        <div className="mb-8 flex flex-col gap-4 rounded-md border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between animate-rise">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="mt-0.5 size-4 shrink-0 text-fg-muted" />
            <div>
              <p className="text-sm font-medium text-fg">
                Add your payment details before you send an invoice
              </p>
              <p className="mt-1 text-sm text-fg-muted leading-relaxed">
                Every invoice prints where to pay you. Still missing:{" "}
                <span className="text-fg">{missingFields.join(" and ")}</span>.
              </p>
            </div>
          </div>
          <Link
            to="/profile"
            className="group inline-flex shrink-0 items-center gap-1.5 self-start pl-7 text-sm font-medium text-fg hover:text-fg-muted transition-colors sm:self-auto sm:pl-0"
          >
            Complete profile
            <FiArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}

      <FormAlert kind="error" message={actionError} />

      {/* Search */}
      {invoices.length > 0 && (
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="relative flex w-full max-w-sm items-center">
            <FiSearch className="pointer-events-none absolute left-3 size-4 text-fg-subtle" />
            <input
              type="search"
              aria-label="Search invoices"
              placeholder="Search by invoice number or client"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border border-line-strong bg-surface py-2.5 pl-9 pr-9 text-sm text-fg placeholder:text-fg-subtle transition-colors hover:border-fg-subtle focus:border-fg-muted focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-1.5 flex size-7 items-center justify-center rounded text-fg-subtle hover:text-fg transition-colors cursor-pointer"
              >
                <FiX className="size-3.5" />
              </button>
            )}
          </div>
          <p className="hidden shrink-0 text-sm text-fg-subtle tabular-nums sm:block" aria-live="polite">
            {searchQuery.trim()
              ? `${filteredInvoices.length} of ${invoices.length}`
              : `${invoices.length} ${invoices.length === 1 ? "invoice" : "invoices"}`}
          </p>
        </div>
      )}

      {/* Listing Content */}
      {loading ? (
        <div aria-busy="true" aria-label="Loading invoices" className="border-y border-line divide-y divide-line">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-6 py-4 motion-safe:animate-pulse">
              <div className="h-3.5 w-20 rounded bg-line" />
              <div className="h-3.5 w-40 rounded bg-line" />
              <div className="ml-auto h-3.5 w-24 rounded bg-line" />
            </div>
          ))}
        </div>
      ) : loadError && invoices.length === 0 ? (
        <div className="max-w-md border-t border-fg pt-5">
          <h2 className="font-medium text-fg">We couldn't load your invoices</h2>
          <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{loadError}</p>
          <button
            type="button"
            onClick={fetchInvoices}
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-line-strong px-3.5 py-2 text-sm font-medium text-fg hover:border-fg-subtle hover:bg-surface transition-colors cursor-pointer"
          >
            <FiRefreshCw className="size-3.5" />
            Try again
          </button>
        </div>
      ) : invoices.length === 0 ? (
        <div className="max-w-md border-t border-fg pt-5">
          <h2 className="font-medium text-fg">No invoices yet</h2>
          <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">
            Write your first invoice and download it as a PDF. Every invoice you
            create is listed here, with whether it's been sent and paid.
          </p>
          <Link to="/invoices/new" className={`${primaryButtonClass} mt-6`}>
            <FiPlus className="size-4 shrink-0" />
            Create your first invoice
          </Link>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="border-y border-line py-10 text-center">
          <p className="text-sm text-fg-muted">
            No invoices match <span className="text-fg">"{searchQuery.trim()}"</span>
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
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-line text-xs font-medium text-fg-muted">
                  <th scope="col" className="py-2.5 pr-4 font-medium">Invoice</th>
                  <th scope="col" className="py-2.5 pr-4 font-medium">Client</th>
                  <th scope="col" className="py-2.5 pr-4 font-medium">Due</th>
                  <th scope="col" className="py-2.5 pr-6 text-right font-medium">Amount</th>
                  <th scope="col" className="py-2.5 pr-4 font-medium">Status</th>
                  <th scope="col" className="w-10 py-2.5">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line border-b border-line">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                    className="group cursor-pointer transition-colors hover:bg-surface"
                  >
                    <td className="py-3.5 pr-4">
                      <Link
                        to={`/invoices/${invoice.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-sm font-mono text-sm text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-muted"
                      >
                        {invoice.invoice_number || "Unnumbered"}
                      </Link>
                    </td>
                    <td className="max-w-[16rem] truncate py-3.5 pr-4 text-fg">
                      {invoice.clients?.client_name || (
                        <span className="text-fg-subtle">No client</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 whitespace-nowrap tabular-nums text-fg-muted">
                      {invoice.due_date ? formatDate(invoice.due_date) : (
                        <span className="text-fg-subtle">No due date</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-6 text-right">{renderAmount(invoice)}</td>
                    <td className="py-3.5 pr-4">{renderStatusButton(invoice)}</td>
                    <td className="py-2 text-right">{renderActionsButton(invoice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List View */}
          <ul className="md:hidden border-y border-line divide-y divide-line">
            {filteredInvoices.map((invoice) => (
              <li
                key={invoice.id}
                onClick={() => navigate(`/invoices/${invoice.id}`)}
                className="flex flex-col gap-2.5 py-4 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to={`/invoices/${invoice.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="block truncate font-medium text-fg"
                    >
                      {invoice.clients?.client_name || "No client"}
                    </Link>
                    <span className="font-mono text-xs text-fg-subtle">
                      {invoice.invoice_number || "Unnumbered"}
                    </span>
                  </div>
                  <div className="shrink-0 pt-0.5 text-sm">{renderAmount(invoice)}</div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-fg-muted tabular-nums">
                    {invoice.due_date ? `Due ${formatDate(invoice.due_date)}` : "No due date"}
                  </span>
                  <div className="-my-1 -mr-1.5 flex items-center gap-1">
                    {renderStatusButton(invoice)}
                    {renderActionsButton(invoice)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Context Actions Menu (fixed to the viewport so the table can't clip it) */}
      {activeMenuId && selectedMenuInvoice && menuPosition && (
        <>
          <div className="fixed inset-0 z-30" onClick={closeMenus} />
          <div
            role="menu"
            aria-label={`Actions for ${selectedMenuInvoice.invoice_number || "invoice"}`}
            style={{ top: `${menuPosition.top + 4}px`, right: `${menuPosition.right}px` }}
            className={`${floatingLayerClass} w-44`}
          >
            <button
              role="menuitem"
              autoFocus
              onClick={() => navigate(`/invoices/${selectedMenuInvoice.id}`)}
              className={menuItemClass}
            >
              <FiEye className="size-3.5 shrink-0" />
              View invoice
            </button>
            <button
              role="menuitem"
              onClick={() => navigate(`/invoices/${selectedMenuInvoice.id}/edit`)}
              className={menuItemClass}
            >
              <FiEdit2 className="size-3.5 shrink-0" />
              Edit invoice
            </button>
            <div className="my-1 border-t border-line" />
            <button
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                setInvoiceToDelete(selectedMenuInvoice);
                closeMenus();
              }}
              className={`${menuItemClass} text-danger! hover:bg-danger-bg! focus-visible:bg-danger-bg!`}
            >
              <FiTrash2 className="size-3.5 shrink-0" />
              Delete invoice
            </button>
          </div>
        </>
      )}

      {/* Status Changer (fixed to the viewport) */}
      {activeStatusSelectorId && selectedStatusInvoice && statusSelectorPosition && (
        <>
          <div className="fixed inset-0 z-30" onClick={closeMenus} />
          <div
            role="menu"
            aria-label="Change status"
            style={{ top: `${statusSelectorPosition.top + 4}px`, right: `${statusSelectorPosition.right}px` }}
            className={`${floatingLayerClass} w-36`}
          >
            {STATUSES.map((status, i) => {
              const current = selectedStatusInvoice.status === status;
              return (
                <button
                  key={status}
                  role="menuitemradio"
                  aria-checked={current}
                  autoFocus={i === 0}
                  disabled={submitting}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (current) closeMenus();
                    else handleStatusChange(selectedStatusInvoice.id, status);
                  }}
                  className={`${menuItemClass} capitalize ${current ? "text-fg!" : ""}`}
                >
                  <StatusDot status={status} />
                  <span className="flex-1">{status}</span>
                  {current && <FiCheck className="size-3.5 text-fg" />}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Deletion Confirmation */}
      {invoiceToDelete && (
        <Dialog
          open
          onClose={() => setInvoiceToDelete(null)}
          dismissible={!submitting}
          role="alertdialog"
          labelledBy="delete-invoice-title"
          describedBy="delete-invoice-body"
        >
          <div className="p-6">
            <h2 id="delete-invoice-title" className="text-lg font-semibold tracking-[-0.02em] text-fg">
              Delete{" "}
              <span className="font-mono">{invoiceToDelete.invoice_number || "this invoice"}</span>?
            </h2>
            <p id="delete-invoice-body" className="mt-2 text-sm text-fg-muted leading-relaxed">
              This permanently removes the invoice and all of its line items. It can't be undone.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                autoFocus
                disabled={submitting}
                onClick={() => setInvoiceToDelete(null)}
                className="rounded-md px-3.5 py-2 text-sm font-medium text-fg-muted hover:text-fg hover:bg-surface transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-fg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleDeleteInvoice}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-danger px-3.5 py-2 text-sm font-medium text-canvas transition hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-wait focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
              >
                {submitting && <FiLoader className="size-4 animate-spin" />}
                {submitting ? "Deleting" : "Delete invoice"}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </main>
  );
};

export default InvoicesPage;
