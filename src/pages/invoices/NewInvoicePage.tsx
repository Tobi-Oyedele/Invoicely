import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  FiArrowLeft,
  FiLoader,
  FiAlertCircle,
  FiUser,
  FiCalendar,
  FiFileText,
  FiBriefcase,
} from "react-icons/fi";
import { LineItemsSection } from "../../components/invoices/LineItemsSection";
import type { LineItem } from "../../components/invoices/InvoicePDFDocument";
import { CURRENCIES, DEFAULT_CURRENCY } from "../../lib/currency";

interface Client {
  id: string;
  client_name: string;
}

interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string;
  business_name: string | null;
  city: string | null;
  country: string | null;
  bank_name: string | null;
  account_number: string | null;
}

const NewInvoicePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Loaded database references
  const [clients, setClients] = useState<Client[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Form state fields
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [dueDate, setDueDate] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, rate: 0 },
  ]);

  const suggestInvoiceNumber = (
    existingInvoices: { invoice_number: string }[],
  ) => {
    if (!existingInvoices || existingInvoices.length === 0) {
      return "INV-001";
    }
    const numbers = existingInvoices
      .map((inv) => {
        const match = inv.invoice_number.match(/(\d+)/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter((num) => !isNaN(num));

    const max = numbers.length > 0 ? Math.max(...numbers) : 0;
    const next = max + 1;
    return `INV-${String(next).padStart(3, "0")}`;
  };

  useEffect(() => {
    document.title = "Create New Invoice | Invoicely";
  }, []);

  useEffect(() => {
    let active = true;

    const fetchComposeData = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          throw new Error("Failed to retrieve active session.");
        }

        // 1. Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select(
            "first_name, last_name, email, business_name, city, country, bank_name, account_number",
          )
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        if (active) setProfile(profileData);

        // 2. Fetch user's clients
        const { data: clientsData, error: clientsError } = await supabase
          .from("clients")
          .select("id, client_name")
          .eq("user_id", user.id)
          .order("client_name", { ascending: true });

        if (clientsError) throw clientsError;
        if (active) setClients(clientsData || []);

        // 3. Query existing invoices to suggest next number
        const { data: invoicesData, error: invoicesError } = await supabase
          .from("invoices")
          .select("invoice_number")
          .eq("user_id", user.id);

        if (invoicesError) throw invoicesError;

        const suggestedNumber = suggestInvoiceNumber(invoicesData || []);
        if (active) setInvoiceNumber(suggestedNumber);
      } catch (err) {
        const error = err as Error;
        console.error("Error fetching compose data:", error);
        if (active)
          setErrorMsg(error.message || "Failed to load compose references.");
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchComposeData();
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  // Line item manipulation handlers
  const handleLineItemChange = (
    index: number,
    field: keyof LineItem,
    value: string | number,
  ) => {
    setLineItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        return {
          ...item,
          [field]: field === "description" ? String(value) : Number(value),
        };
      }),
    );
  };

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { description: "", quantity: 1, rate: 0 },
    ]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length === 1) return; // Keep at least 1 item
    setLineItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit invoice details
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      setErrorMsg("Please select a client for this invoice.");
      return;
    }
    if (!invoiceNumber.trim()) {
      setErrorMsg("Please enter an invoice number.");
      return;
    }
    if (
      lineItems.some(
        (item) =>
          !item.description.trim() || item.rate < 0 || item.quantity <= 0,
      )
    ) {
      setErrorMsg(
        "Please ensure all line items have description, valid quantity, and rate.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No active session found.");

      // 1. Insert into invoices table with auto-increment retry on unique violations
      let currentInvoiceNumber = invoiceNumber.trim();
      let savedSuccessfully = false;
      let invoiceResult: { id: string } | null = null;
      let invoiceError: { code?: string; message: string } | null = null;
      let attempts = 0;
      const maxAttempts = 10;

      while (!savedSuccessfully && attempts < maxAttempts) {
        attempts++;

        // Active check to prevent duplicates even if the DB lacks a unique constraint
        const { data: duplicateCheck, error: checkError } = await supabase
          .from("invoices")
          .select("id")
          .eq("user_id", user.id)
          .eq("invoice_number", currentInvoiceNumber)
          .maybeSingle();

        if (checkError) {
          invoiceError = checkError;
          break;
        }

        if (duplicateCheck) {
          // Collision found! Auto-increment the invoice number and retry
          const match = currentInvoiceNumber.match(/(\d+)/);
          const num = match ? parseInt(match[0], 10) : 0;
          const nextNum = num + 1;
          currentInvoiceNumber = `INV-${String(nextNum).padStart(3, "0")}`;
          setInvoiceNumber(currentInvoiceNumber); // Update state to keep UI in sync
          continue;
        }

        const { data, error } = await supabase
          .from("invoices")
          .insert({
            user_id: user.id,
            client_id: selectedClientId,
            invoice_number: currentInvoiceNumber,
            issue_date: issueDate,
            due_date: dueDate || null,
            notes: notes.trim() || null,
            status: "draft", // Defaults to draft
            currency,
          })
          .select()
          .single();

        if (error) {
          if (
            error.code === "23505" ||
            (error.message && error.message.toLowerCase().includes("duplicate"))
          ) {
            // Uniqueness collision in database (race condition)! Auto-increment and retry
            const match = currentInvoiceNumber.match(/(\d+)/);
            const num = match ? parseInt(match[0], 10) : 0;
            const nextNum = num + 1;
            currentInvoiceNumber = `INV-${String(nextNum).padStart(3, "0")}`;
            setInvoiceNumber(currentInvoiceNumber); // Update state to keep UI in sync
            continue;
          } else {
            invoiceError = error;
            break;
          }
        } else {
          invoiceResult = data;
          savedSuccessfully = true;
        }
      }

      if (invoiceError) throw invoiceError;
      if (!savedSuccessfully || !invoiceResult) {
        throw new Error(
          "Failed to generate a unique invoice number after several attempts. Please try again.",
        );
      }

      // 2. Insert dynamic line items tied to invoice ID
      const itemsToInsert = lineItems.map((item) => ({
        invoice_id: invoiceResult.id,
        description: item.description.trim(),
        quantity: item.quantity,
        rate: item.rate,
      }));

      const { error: linesError } = await supabase
        .from("line_items")
        .insert(itemsToInsert);

      if (linesError) {
        // Safe compensating delete to prevent orphaned invoices
        const { error: rollbackError } = await supabase
          .from("invoices")
          .delete()
          .eq("id", invoiceResult.id);

        if (rollbackError) {
          throw new Error(
            `Failed to save line items (${linesError.message}) and failed to roll back orphaned invoice (${rollbackError.message}). Please contact support.`,
          );
        }
        throw linesError;
      }

      // Success - Redirect to invoice details page
      navigate(`/invoices/${invoiceResult.id}`);
    } catch (err) {
      const error = err as Error;
      console.error("Error saving invoice:", error);
      setErrorMsg(
        error.message || "An unexpected error occurred while saving invoice.",
      );
    } finally {
      setSubmitting(false);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-10 bg-zinc-100 dark:bg-zinc-950 rounded-lg"></div>
            <div className="h-10 bg-zinc-100 dark:bg-zinc-950 rounded-lg"></div>
          </div>
        </div>
      </main>
    );
  }

  const isMissingBilling = !profile?.bank_name || !profile?.account_number;

  if (isMissingBilling) {
    return (
      <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-4xl mx-auto selection:bg-zinc-100 dark:selection:bg-zinc-800 transition-all">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            to="/invoices"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Invoices</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create Invoice
          </h1>
          <p className="mt-1 lg:mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Draft a new invoice, specify line items, and select client billing
            info.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center space-y-6 max-w-xl mx-auto shadow-xs mt-12 transition-all">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
            <FiAlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Payment Setup Required
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md mx-auto">
              Before you can create invoices, you must update your payment
              credentials. Having your bank details set up is required so your
              clients know exactly how to pay you.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/profile"
              className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 dark:text-zinc-950 rounded-xl px-6 py-3 font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-[0.98]"
            >
              <span>Set Up Payment Details</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-4xl mx-auto selection:bg-zinc-100 dark:selection:bg-zinc-800 transition-all">
      {/* Back navigation */}
      <div className="mb-6">
        <Link
          to="/invoices"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create Invoice
        </h1>
        <p className="mt-1 lg:mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Draft a new invoice, specify line items, and select client billing
          info.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/15 border border-red-200/50 dark:border-red-900/30 rounded-2xl flex items-start gap-3 text-sm text-red-600 dark:text-red-400 font-medium">
          <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Sender & Client Details */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs p-6 lg:p-8 space-y-6">
          {/* Sender details card block */}
          <div>
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
              <FiBriefcase className="w-3.5 h-3.5" />
              <span>Sender (From)</span>
            </h3>
            {profile ? (
              <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/30 rounded-xl border border-zinc-100 dark:border-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {profile.business_name ||
                      `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
                      "Your business"}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {profile.email} • {profile.city || "No city set"},{" "}
                    {profile.country || "No country set"}
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 hover:underline shrink-0"
                >
                  Edit Profile details
                </Link>
              </div>
            ) : (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                No sender profile loaded.
              </p>
            )}
          </div>

          {/* Client select block */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
              <FiUser className="w-3.5 h-3.5" />
              <span>Client (To)</span>
            </h3>
            <div className="max-w-md">
              <label
                htmlFor="client_select"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Select Client <span className="text-red-500">*</span>
              </label>
              {clients.length > 0 ? (
                <select
                  id="client_select"
                  required
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
                >
                  <option value="" disabled>
                    Choose a client from directory
                  </option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.client_name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/15 border border-amber-200/50 dark:border-amber-900/30 rounded-xl flex items-start justify-between gap-3 flex-wrap">
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                    No clients created yet. Please create a client in the
                    directory first to draft invoices!
                  </p>
                  <Link
                    to="/clients"
                    className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:underline shrink-0"
                  >
                    Go to Clients
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Invoice Metadata details */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs p-6 lg:p-8 space-y-6">
          <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
            <FiFileText className="w-3.5 h-3.5" />
            <span>Invoice Specifications</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <label
                htmlFor="invoice_number"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Invoice Number
              </label>
              <input
                id="invoice_number"
                type="text"
                readOnly
                disabled={true}
                value={invoiceNumber}
                className="block w-full px-3.5 py-2.5 text-sm bg-zinc-105 dark:bg-zinc-950/60 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold cursor-not-allowed select-none"
              />
            </div>

            <div>
              <label
                htmlFor="currency_select"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                id="currency_select"
                required
                disabled={submitting}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="issue_date"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Issue Date <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <FiCalendar className="absolute left-3 text-zinc-400 dark:text-zinc-600 w-4 h-4 pointer-events-none" />
                <input
                  id="issue_date"
                  type="date"
                  required
                  disabled={submitting}
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="block w-full pl-9 pr-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="due_date"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Due Date
              </label>
              <div className="relative flex items-center">
                <FiCalendar className="absolute left-3 text-zinc-400 dark:text-zinc-600 w-4 h-4 pointer-events-none" />
                <input
                  id="due_date"
                  type="date"
                  disabled={submitting}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="block w-full pl-9 pr-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Dynamic Line Items array */}
        <LineItemsSection
          lineItems={lineItems}
          currency={currency}
          submitting={submitting}
          onLineItemChange={handleLineItemChange}
          onAddLineItem={addLineItem}
          onRemoveLineItem={removeLineItem}
        />

        {/* Card 4: Optional Notes / Terms */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs p-6 lg:p-8 space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">
            Invoice Notes & Terms (Optional)
          </h3>
          <div>
            <textarea
              id="invoice_notes"
              rows={4}
              disabled={submitting}
              placeholder="e.g. Please pay within 30 days via direct bank transfer to our credentials."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all resize-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Submission actions */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
          <Link
            to="/invoices"
            className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer select-none"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || clients.length === 0}
            className="bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 dark:text-zinc-950 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all shadow-xs active:scale-[0.98] cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {submitting ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2.5 h-4 w-4" />
                Saving invoice...
              </>
            ) : (
              "Save & Preview"
            )}
          </button>
        </div>
      </form>
    </main>
  );
};

export default NewInvoicePage;
