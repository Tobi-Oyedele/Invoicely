import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiCalendar,
  FiX,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
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
  status: "draft" | "sent" | "paid";
  notes?: string;
  created_at: string;
  line_items: LineItem[];
  clients: Client | null;
  currency?: string | null;
}

const InvoicesPage = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
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
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Could not retrieve active session.");
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
      setActionError(error.message || "Failed to load invoices.");
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
          missing.push("Bank Name", "Account Number");
        } else {
          if (!profile.bank_name) missing.push("Bank Name");
          if (!profile.account_number) missing.push("Account Number");
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

  // Close menus on scroll/resize
  useEffect(() => {
    if (activeMenuId || activeStatusSelectorId) {
      const handleClose = () => {
        setActiveMenuId(null);
        setActiveStatusSelectorId(null);
        setMenuPosition(null);
        setStatusSelectorPosition(null);
      };
      window.addEventListener("scroll", handleClose, true);
      window.addEventListener("resize", handleClose);
      return () => {
        window.removeEventListener("scroll", handleClose, true);
        window.removeEventListener("resize", handleClose);
      };
    }
  }, [activeMenuId, activeStatusSelectorId]);

  const handleStatusChange = async (invoiceId: string, newStatus: "draft" | "sent" | "paid") => {
    try {
      setSubmitting(true);
      const { error } = await supabase
        .from("invoices")
        .update({ status: newStatus })
        .eq("id", invoiceId);

      if (error) throw error;

      // Update local state dynamically
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: newStatus } : inv))
      );
      setActiveStatusSelectorId(null);
    } catch (err) {
      const error = err as Error;
      console.error("Error updating status:", error);
      alert(error.message || "Failed to update invoice status.");
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
      setActionError(error.message || "Failed to delete invoice.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: calculate total invoice amount
  const calculateTotal = (lineItems: LineItem[] = []) =>
    lineItems.reduce((sum, item) => sum + (item.quantity || 0) * (item.rate || 0), 0);

  // Helper: format Currency
  const formatCurrency = (amount: number, currencyCode: string = "NGN") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode || "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Filter invoices based on search
  const filteredInvoices = invoices.filter((inv) => {
    const searchLower = searchQuery.toLowerCase();
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

  const getStatusBadgeStyles = (status: "draft" | "sent" | "paid") => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border-green-200/50 dark:border-green-900/30";
      case "sent":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800";
    }
  };

  const selectedMenuInvoice = invoices.find((inv) => inv.id === activeMenuId);
  const selectedStatusInvoice = invoices.find((inv) => inv.id === activeStatusSelectorId);

  return (
    <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-7xl mx-auto selection:bg-zinc-100 dark:selection:bg-zinc-800 transition-all">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Invoices
          </h1>
          <p className="mt-1 lg:mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Create, manage, and track payment history of your billing invoices.
          </p>
        </div>
        <Link
          to="/invoices/new"
          className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 dark:text-zinc-950 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-xs hover:shadow-sm active:scale-[0.98] cursor-pointer shrink-0 w-full md:w-auto text-center"
        >
          <FiPlus className="w-4 h-4 shrink-0" />
          <span>New Invoice</span>
        </Link>
      </div>

      {/* Profile Setup Reminder Banner */}
      {missingFields.length > 0 && (
        <div className="mb-8 p-5 md:p-6 bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/10 dark:to-orange-950/10 border border-amber-200/60 dark:border-amber-900/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs transition-all animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
              <FiAlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm md:text-base">
                Welcome! Let's complete your profile
              </h3>
              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed max-w-2xl">
                Please take a moment to complete your profile details. To
                dismiss this reminder, you need to set up your:{" "}
                <span className="font-semibold text-amber-800 dark:text-amber-300">
                  {missingFields.join(", ")}
                </span>
                .{" "}
              </p>
            </div>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs md:text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 dark:text-zinc-950 rounded-xl shrink-0 shadow-xs hover:shadow-md active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto"
          >
            <span>Complete Profile</span>
            <FiArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      )}

      {actionError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/15 border border-red-200/50 dark:border-red-900/30 rounded-2xl flex items-start gap-3 text-sm text-red-600 dark:text-red-400 font-medium">
          <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Action panel (Search) */}
      {invoices.length > 0 && (
        <div className="mb-6 max-w-md">
          <div className="relative flex items-center">
            <FiSearch className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by invoice number or client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 p-0.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 rounded-full transition-colors cursor-pointer"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Listing Content */}
      {loading ? (
        // Skeleton view
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
      ) : invoices.length === 0 ? (
        // Empty State
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 md:p-16 text-center shadow-xs max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900/60 rounded-2xl flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-6 shadow-xs select-none">
            <FiFileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            No invoices drafted yet
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-sm mb-8 leading-relaxed">
            Create professional billing invoices for your clients and track their payment statuses in one clean list.
          </p>
          <Link
            to="/invoices/new"
            className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 dark:text-zinc-950 rounded-xl px-6 py-3 text-sm font-semibold transition-all shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            <FiPlus className="w-4 h-4 shrink-0" />
            <span>Create Your First Invoice</span>
          </Link>
        </div>
      ) : filteredInvoices.length === 0 ? (
        // No Search Results
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-xs">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            No invoices match your search query:{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              "{searchQuery}"
            </span>
          </p>
        </div>
      ) : (
        // Invoice Table view
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 select-none">
                  <th className="px-6 py-4.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-16 px-6 py-4.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-semibold text-xs shrink-0 select-none">
                          <FiFileText className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">
                          {invoice.invoice_number || "INV-—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                      {invoice.clients?.client_name || (
                        <span className="text-zinc-300 dark:text-zinc-700 italic select-none">
                          Anonymous Client
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4.5 text-sm text-zinc-500 dark:text-zinc-400">
                      {invoice.due_date ? (
                        <span className="inline-flex items-center gap-1.5">
                          <FiCalendar className="w-3.5 h-3.5 shrink-0 opacity-60" />
                          <span>{invoice.due_date}</span>
                        </span>
                      ) : (
                        <span className="text-zinc-300 dark:text-zinc-700 italic select-none">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4.5 text-sm font-semibold text-zinc-900 dark:text-zinc-50 whitespace-nowrap">
                      {formatCurrency(calculateTotal(invoice.line_items), invoice.currency || "NGN")}
                    </td>
                    <td className="px-6 py-4.5">
                      <button
                        onClick={(e) => handleStatusSelectorToggle(e, invoice.id)}
                        className={`inline-flex items-center justify-center border rounded-full px-2.5 py-0.5 text-xs font-semibold select-none cursor-pointer transition-all hover:scale-[1.02] active:scale-98 ${getStatusBadgeStyles(
                          invoice.status
                        )}`}
                      >
                        <span className="capitalize">{invoice.status}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4.5 text-right relative">
                      <button
                        onClick={(e) => handleMenuToggle(e, invoice.id)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors cursor-pointer"
                      >
                        <FiMoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                onClick={() => navigate(`/invoices/${invoice.id}`)}
                className="p-5 flex flex-col gap-3.5 relative hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-semibold text-xs shrink-0 select-none">
                      <FiFileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm block">
                        {invoice.invoice_number || "INV-—"}
                      </span>
                      <span className="text-xs text-zinc-450 dark:text-zinc-400 font-medium">
                        {invoice.clients?.client_name || "Anonymous Client"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleStatusSelectorToggle(e, invoice.id)}
                      className={`inline-flex items-center justify-center border rounded-full px-2.5 py-0.5 text-[10px] font-semibold select-none cursor-pointer transition-all ${getStatusBadgeStyles(
                        invoice.status
                      )}`}
                    >
                      <span className="capitalize">{invoice.status}</span>
                    </button>
                    <button
                      onClick={(e) => handleMenuToggle(e, invoice.id)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors cursor-pointer"
                    >
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pl-11 text-xs">
                  <div className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <FiCalendar className="w-3.5 h-3.5 opacity-60" />
                    <span>Due: {invoice.due_date || "—"}</span>
                  </div>
                  <div className="text-right font-bold text-zinc-900 dark:text-zinc-50 text-sm">
                    {formatCurrency(calculateTotal(invoice.line_items), invoice.currency || "NGN")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Context Actions Menu (Fixed positioned viewport portal to prevent table bounds clipping) */}
      {activeMenuId && selectedMenuInvoice && menuPosition && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => {
              setActiveMenuId(null);
              setMenuPosition(null);
            }}
          />
          <div
            style={{
              position: "fixed",
              top: `${menuPosition.top + 4}px`,
              right: `${menuPosition.right}px`,
            }}
            className="w-36 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg py-1.5 z-40 animate-fade-in"
          >
            <button
              onClick={() => navigate(`/invoices/${selectedMenuInvoice.id}`)}
              className="w-full text-left px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FiEye className="w-3.5 h-3.5 shrink-0 opacity-70" />
              <span>View details</span>
            </button>
            <button
              onClick={() => navigate(`/invoices/${selectedMenuInvoice.id}/edit`)}
              className="w-full text-left px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FiEdit2 className="w-3.5 h-3.5 shrink-0 opacity-70" />
              <span>Edit layout</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInvoiceToDelete(selectedMenuInvoice);
                setActiveMenuId(null);
                setMenuPosition(null);
              }}
              className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FiTrash2 className="w-3.5 h-3.5 shrink-0 opacity-70" />
              <span>Delete invoice</span>
            </button>
          </div>
        </>
      )}

      {/* Dynamic Status Changer Dropdown (Fixed positioned viewport portal) */}
      {activeStatusSelectorId && selectedStatusInvoice && statusSelectorPosition && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => {
              setActiveStatusSelectorId(null);
              setStatusSelectorPosition(null);
            }}
          />
          <div
            style={{
              position: "fixed",
              top: `${statusSelectorPosition.top + 4}px`,
              right: `${statusSelectorPosition.right}px`,
            }}
            className="w-32 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg py-1.5 z-40 animate-fade-in"
          >
            {(["draft", "sent", "paid"] as const).map((status) => (
              <button
                key={status}
                disabled={submitting}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(selectedStatusInvoice.id, status);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer disabled:opacity-50 ${
                  selectedStatusInvoice.status === status
                    ? "bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                }`}
              >
                <span className="capitalize">{status}</span>
                {selectedStatusInvoice.status === status && (
                  <FiCheckCircle className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Deletion Confirmation Modal */}
      {invoiceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => {
              if (!submitting) setInvoiceToDelete(null);
            }}
          />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden z-10 transform transition-all animate-scale-in">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/30 rounded-xl flex items-center justify-center text-red-600 dark:text-red-450 mx-auto mb-4 shadow-xs">
                <FiTrash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                Delete Invoice?
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                Are you sure you want to delete invoice{" "}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  "{invoiceToDelete.invoice_number}"
                </span>
                ? This action will permanently remove it and all of its line items.
              </p>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setInvoiceToDelete(null)}
                  className="flex-1 px-4.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleDeleteInvoice}
                  className="flex-1 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-xl px-4.5 py-2.5 text-sm font-semibold transition-all shadow-xs active:scale-[0.98] cursor-pointer flex items-center justify-center disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="animate-spin -ml-1 mr-2.5 h-4 w-4" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default InvoicesPage;
