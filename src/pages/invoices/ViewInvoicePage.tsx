import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  FiArrowLeft,
  FiEdit,
  FiDownload,
  FiLoader,
  FiAlertCircle,
  FiCalendar,
  FiUser,
  FiMapPin,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiSave,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";
import { pdf } from "@react-pdf/renderer";
import { InvoicePDFDocument } from "../../components/invoices/InvoicePDFDocument";
import type {
  LineItem,
  Client,
  Profile,
  Invoice,
} from "../../components/invoices/InvoicePDFDocument";
import { LineItemsSection } from "../../components/invoices/LineItemsSection";
import { InvoicePaymentInstructions } from "../../components/invoices/InvoicePaymentInstructions";

interface ViewInvoicePageProps {
  defaultEditing?: boolean;
  idOverride?: string;
}

const ViewInvoicePage = ({ defaultEditing = false, idOverride }: ViewInvoicePageProps) => {
  const { id: paramId } = useParams<{ id: string }>();
  const id = idOverride || paramId;

  // Loading and edit toggles
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(defaultEditing);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Loaded database schemas
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [sender, setSender] = useState<Profile | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  // Form states (prefilled on mount/edit mode toggle)
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const fetchInvoiceDetails = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setErrorMsg(null);

      // 1. Fetch invoice row with client name and line items
      const { data: invData, error: invError } = await supabase
        .from("invoices")
        .select(`
          *,
          line_items (*),
          clients (*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (invError) throw invError;
      if (!invData) throw new Error("Invoice record not found.");

      setInvoice(invData);

      // Prefill form states
      setInvoiceNumber(invData.invoice_number || "");
      setIssueDate(invData.issue_date || "");
      setDueDate(invData.due_date || "");
      setSelectedClientId(invData.client_id || "");
      setNotes(invData.notes || "");
      setLineItems(invData.line_items || []);
      setCurrency(invData.currency || "NGN");

      // 2. Fetch sender profile details (using invoice.user_id)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", invData.user_id)
        .maybeSingle();

      if (profileError) throw profileError;
      setSender(profileData);

      // 3. Fetch user's clients list (needed if they toggle to edit mode)
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("id, client_name")
        .eq("user_id", invData.user_id)
        .order("client_name", { ascending: true });

      if (clientsError) throw clientsError;
      setClients(clientsData || []);
    } catch (err) {
      const error = err as Error;
      console.error("Error loading invoice details:", error);
      setErrorMsg(error.message || "Failed to load invoice layout.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) {
        fetchInvoiceDetails();
      }
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [fetchInvoiceDetails]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Edit Mode Line Item manipulations
  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    setLineItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        return {
          ...item,
          [field]: field === "description" ? String(value) : Number(value),
        };
      })
    );
  };

  const addLineItem = () => {
    setLineItems((prev) => [...prev, { description: "", quantity: 1, rate: 0 }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity || 0) * (item.rate || 0), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Submit layout updates
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !invoice) return;

    if (!selectedClientId) {
      setErrorMsg("Please select a client for this invoice.");
      return;
    }
    if (!invoiceNumber.trim()) {
      setErrorMsg("Please specify an invoice number.");
      return;
    }
    if (lineItems.some((item) => !item.description.trim() || item.rate < 0 || item.quantity <= 0)) {
      setErrorMsg("Please ensure all line items have descriptions, valid quantity, and rate.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      // 1. Update parent invoice metadata details
      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({
          client_id: selectedClientId,
          invoice_number: invoiceNumber.trim(),
          issue_date: issueDate,
          due_date: dueDate || null,
          notes: notes.trim() || null,
          currency: currency,
        })
        .eq("id", id);

      if (invoiceError) throw invoiceError;

      // 2. Safely synchronize dynamic line items
      // Gather the IDs of the existing line items currently in the database
      const existingLineItemIds = (invoice.line_items || [])
        .map((item) => item.id)
        .filter((itemId): itemId is string => !!itemId);

      // Prepare new list of items to insert
      const itemsToInsert = lineItems.map((item) => ({
        invoice_id: id,
        description: item.description.trim(),
        quantity: item.quantity,
        rate: item.rate,
      }));

      // Insert the new line items first
      const { data: insertedData, error: insertError } = await supabase
        .from("line_items")
        .insert(itemsToInsert)
        .select("id");

      if (insertError) throw insertError;

      // Only if the insert succeeded, we proceed to delete the old items
      if (existingLineItemIds.length > 0) {
        const { error: deleteError } = await supabase
          .from("line_items")
          .delete()
          .in("id", existingLineItemIds);

        if (deleteError) {
          // Compensating action: If delete of old items failed, roll back the newly inserted items
          if (insertedData && insertedData.length > 0) {
            const newlyInsertedIds = insertedData.map((item) => item.id);
            await supabase.from("line_items").delete().in("id", newlyInsertedIds);
          }
          throw deleteError;
        }
      }

      // Reset layout views and reload DB sync
      setSuccessMsg("Invoice details updated successfully.");
      setIsEditing(false);
      fetchInvoiceDetails();
    } catch (err) {
      const error = err as Error;
      console.error("Error saving changes:", error);
      setErrorMsg(error.message || "An unexpected error occurred while saving updates.");
    } finally {
      setSubmitting(false);
    }
  };

  // Imperative PDF Generator downloader
  const handleDownloadPDF = async () => {
    if (!invoice || !sender) return;

    try {
      setSubmitting(true);
      // Compile react-pdf template client-side
      const blob = await pdf(<InvoicePDFDocument invoice={invoice} sender={sender} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoice.invoice_number || "invoice"}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const error = err as Error;
      console.error("Error generating PDF:", error);
      alert(error.message || "Failed to compile PDF. Please try again.");
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-4xl mx-auto animate-pulse">
        <div className="mb-8">
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md mt-4"></div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 lg:p-8 space-y-6">
          <div className="h-32 bg-zinc-50 dark:bg-zinc-950 rounded-xl"></div>
          <div className="h-40 bg-zinc-100 dark:bg-zinc-950 rounded-lg"></div>
        </div>
      </main>
    );
  }

  if (!invoice || !sender) {
    return (
      <main className="py-10 px-6 max-w-4xl mx-auto text-center">
        <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Invoice Not Found</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
          The requested invoice record could not be found or has been deleted.
        </p>
        <Link
          to="/invoices"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-4xl mx-auto selection:bg-zinc-100 dark:selection:bg-zinc-800 transition-all">
      {/* Back and Status banner */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/invoices"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </Link>

        {successMsg && (
          <div className="px-4 py-2 bg-green-50 dark:bg-green-950/15 border border-green-200/50 dark:border-green-900/30 rounded-xl flex items-center gap-2 text-xs text-green-700 dark:text-green-400 font-medium animate-fade-in select-none">
            <FiCheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="px-4 py-2 bg-red-50 dark:bg-red-950/15 border border-red-200/50 dark:border-red-900/30 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium animate-fade-in">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Invoice Actions Header */}
      {!isEditing && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                {invoice.invoice_number}
              </h1>
              <span
                className={`inline-flex items-center justify-center border rounded-full px-2.5 py-0.5 text-xs font-bold capitalize select-none ${getStatusBadgeStyles(
                  invoice.status
                )}`}
              >
                {invoice.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Drafted on {new Date(invoice.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(true)}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-xl px-4.5 py-2.5 text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 select-none shadow-xs hover:shadow-sm"
            >
              <FiEdit className="w-4 h-4 shrink-0" />
              <span>Edit Invoice</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 dark:text-zinc-950 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer shrink-0 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <FiLoader className="animate-spin w-4 h-4 shrink-0" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <FiDownload className="w-4 h-4 shrink-0" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Core Component Views */}
      {isEditing ? (
        // EDIT MODE COMPOSER FORM
        <form onSubmit={handleSaveChanges} className="space-y-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Edit Invoice Layout</h2>
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                setIsEditing(false);
                setErrorMsg(null);
                // Reset form values back to original
                setInvoiceNumber(invoice.invoice_number || "");
                setIssueDate(invoice.issue_date || "");
                setDueDate(invoice.due_date || "");
                setSelectedClientId(invoice.client_id || "");
                setNotes(invoice.notes || "");
                setLineItems(invoice.line_items || []);
              }}
              className="inline-flex items-center justify-center p-1.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors cursor-pointer disabled:opacity-50"
            >
              <FiX className="w-5 h-5 shrink-0" />
            </button>
          </div>

          {/* Form Card 1: Sender & Client Details */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs p-6 lg:p-8 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
                <FiBriefcase className="w-3.5 h-3.5" />
                <span>Sender Details</span>
              </h3>
              <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/30 rounded-xl border border-zinc-100 dark:border-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {sender.business_name || `${sender.first_name || ""} ${sender.last_name || ""}`.trim() || "Your Business"}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {sender.email} • {sender.city || "No city set"}, {sender.country || "No country set"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
                <FiUser className="w-3.5 h-3.5" />
                <span>Billing Client</span>
              </h3>
              <div className="max-w-md">
                <label
                  htmlFor="edit_client_select"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
                >
                  Select Client <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit_client_select"
                  required
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.client_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Card 2: Dates and metadata */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs p-6 lg:p-8 space-y-6">
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
              <FiCalendar className="w-3.5 h-3.5" />
              <span>Invoice Specifications</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <label
                  htmlFor="edit_invoice_number"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
                >
                  Invoice Number
                </label>
                <input
                  id="edit_invoice_number"
                  type="text"
                  readOnly
                  disabled={true}
                  value={invoiceNumber}
                  className="block w-full px-3.5 py-2.5 text-sm bg-zinc-100 dark:bg-zinc-950/60 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold cursor-not-allowed select-none"
                />
              </div>

              <div>
                <label
                  htmlFor="edit_issue_date"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
                >
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit_issue_date"
                  type="date"
                  required
                  disabled={submitting}
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="edit_due_date"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
                >
                  Due Date
                </label>
                <input
                  id="edit_due_date"
                  type="date"
                  disabled={submitting}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="edit_currency"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
                >
                  Currency
                </label>
                <select
                  id="edit_currency"
                  disabled={submitting}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all cursor-pointer"
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Card 3: Dynamic line items */}
          <LineItemsSection
            lineItems={lineItems}
            currency={currency}
            submitting={submitting}
            onLineItemChange={handleLineItemChange}
            onAddLineItem={addLineItem}
            onRemoveLineItem={removeLineItem}
          />

          {/* Form Card 4: Optional Notes */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs p-6 lg:p-8 space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Invoice Notes & Terms (Optional)
            </h3>
            <div>
              <textarea
                id="edit_invoice_notes"
                rows={4}
                disabled={submitting}
                placeholder="Notes or terms..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all resize-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Form actions */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                setIsEditing(false);
                setErrorMsg(null);
                setLineItems(invoice.line_items || []);
              }}
              className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer select-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 dark:text-zinc-950 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all shadow-xs active:scale-[0.98] cursor-pointer flex items-center justify-center disabled:opacity-50 w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-2.5 h-4 w-4" />
                  Saving updates...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4 shrink-0 mr-2.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        // READ-ONLY VIEW MODE
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs p-6 lg:p-8 space-y-8 transition-colors select-text">
          {/* Section 1: Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-zinc-100 dark:border-zinc-800 pb-8 select-none">
            {/* Sender address */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <FiBriefcase className="w-3.5 h-3.5" />
                <span>From</span>
              </h3>
              <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                {sender.business_name || `${sender.first_name || ""} ${sender.last_name || ""}`.trim() || "Your Business"}
              </h4>
              <div className="text-xs text-zinc-550 dark:text-zinc-400 space-y-1.5 mt-2 font-medium">
                <div className="flex items-center gap-2">
                  <FiMail className="w-3.5 h-3.5 opacity-60" />
                  <span>{sender.email}</span>
                </div>
                {(sender.city || sender.country) && (
                  <div className="flex items-center gap-2">
                    <FiMapPin className="w-3.5 h-3.5 opacity-60" />
                    <span>{[sender.city, sender.country].filter(Boolean).join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Client address */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <FiUser className="w-3.5 h-3.5" />
                <span>Billing To</span>
              </h3>
              {invoice.clients ? (
                <div>
                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    {invoice.clients.client_name}
                  </h4>
                  <div className="text-xs text-zinc-550 dark:text-zinc-400 space-y-1.5 mt-2 font-medium">
                    {invoice.clients.email && (
                      <div className="flex items-center gap-2">
                        <FiMail className="w-3.5 h-3.5 opacity-60" />
                        <span>{invoice.clients.email}</span>
                      </div>
                    )}
                    {invoice.clients.phone_number && (
                      <div className="flex items-center gap-2">
                        <FiPhone className="w-3.5 h-3.5 opacity-60" />
                        <span>{invoice.clients.phone_number}</span>
                      </div>
                    )}
                    {invoice.clients.address && (
                      <div className="flex items-start gap-2">
                        <FiMapPin className="w-3.5 h-3.5 opacity-60 mt-0.5" />
                        <span className="leading-relaxed">{invoice.clients.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-400 dark:text-zinc-650 italic">Anonymous Client</p>
              )}
            </div>
          </div>

          {/* Section 2: Dates metadata */}
          <div className="flex flex-wrap gap-8 border-b border-zinc-100 dark:border-zinc-800 pb-6 text-xs font-medium select-none">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Issue Date
              </span>
              <p className="text-zinc-900 dark:text-zinc-100 text-sm font-semibold">{invoice.issue_date || "—"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Due Date
              </span>
              <p className="text-zinc-900 dark:text-zinc-100 text-sm font-semibold">{invoice.due_date || "—"}</p>
            </div>
          </div>

          {/* Section 3: Product table list */}
          <div>
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-1.5 select-none">
              <span>Billing Products</span>
            </h3>

            {/* Desktop items table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-450 uppercase select-none">
                    <th className="py-3 flex-1">Description</th>
                    <th className="py-3 w-20 text-center">Qty</th>
                    <th className="py-3 w-32 text-right">Rate</th>
                    <th className="py-3 w-32 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                  {lineItems.map((item, index) => (
                    <tr key={index} className="text-zinc-900 dark:text-zinc-100 font-medium">
                      <td className="py-4 text-zinc-850 dark:text-zinc-200">{item.description}</td>
                      <td className="py-4 text-center text-zinc-500 dark:text-zinc-400 select-none">
                        {item.quantity}
                      </td>
                      <td className="py-4 text-right text-zinc-500 dark:text-zinc-400">
                        {formatCurrency(item.rate)}
                      </td>
                      <td className="py-4 text-right font-semibold">
                        {formatCurrency((item.quantity || 0) * (item.rate || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile items stacked list */}
            <div className="block sm:hidden divide-y divide-zinc-100 dark:divide-zinc-800">
              {lineItems.map((item, index) => (
                <div key={index} className="py-4 flex flex-col gap-2">
                  <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    {item.description}
                  </span>
                  <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="select-none">
                      {item.quantity} × {formatCurrency(item.rate)}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">
                      {formatCurrency((item.quantity || 0) * (item.rate || 0))}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total summary board */}
            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <div className="w-full sm:w-80 space-y-3 text-sm select-none">
                <div className="flex justify-between items-center text-zinc-550 dark:text-zinc-400">
                  <span>Subtotal:</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-200">
                    {formatCurrency(calculateSubtotal())}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-900 dark:border-zinc-100 pt-3 text-zinc-900 dark:text-zinc-50">
                  <span className="font-bold text-base">Total Due ({currency}):</span>
                  <span className="font-black text-xl tracking-tight">
                    {formatCurrency(calculateSubtotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Bank Payment Instructions */}
          <InvoicePaymentInstructions sender={sender} />

          {/* Section 5: Notes */}
          {invoice.notes && (
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-55 uppercase tracking-widest mb-2 select-none">
                Notes & Terms
              </h3>
              <p className="text-xs md:text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                {invoice.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default ViewInvoicePage;
