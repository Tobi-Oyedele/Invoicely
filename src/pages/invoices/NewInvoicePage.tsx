import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  FiArrowLeft,
  FiArrowRight,
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { LineItemsSection } from "../../components/invoices/LineItemsSection";
import type { LineItem } from "../../components/invoices/InvoicePDFDocument";
import { CURRENCIES, DEFAULT_CURRENCY } from "../../lib/currency";
import { bumpInvoiceNumber, nextInvoiceNumber } from "../../lib/invoiceNumber";
import { AuthField } from "../../components/auth/AuthField";
import { FormSection, Optional } from "../../components/ui/FormSection";
import { SelectField } from "../../components/ui/SelectField";

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
  default_currency: string | null;
}

const NewInvoicePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [dueDateError, setDueDateError] = useState<string | null>(null);
  const [showItemErrors, setShowItemErrors] = useState(false);

  // Loaded database references
  const [clients, setClients] = useState<Client[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Form state fields
  // Every reference this user has issued; the next one is derived per client
  const [existingNumbers, setExistingNumbers] = useState<string[]>([]);
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

  useEffect(() => {
    document.title = "New Invoice | Invoicely";
  }, []);

  const fetchComposeData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Your session has expired. Sign in again to create an invoice.");
      }

      // 1. Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(
          "first_name, last_name, email, business_name, city, country, bank_name, account_number, default_currency",
        )
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);
      // Invoices are issued in the currency set on the profile
      setCurrency(profileData?.default_currency || DEFAULT_CURRENCY);

      // 2. Fetch user's clients
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("id, client_name")
        .eq("user_id", user.id)
        .order("client_name", { ascending: true });

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      // 3. Query existing invoices to suggest next number
      const { data: invoicesData, error: invoicesError } = await supabase
        .from("invoices")
        .select("invoice_number")
        .eq("user_id", user.id);

      if (invoicesError) throw invoicesError;

      setExistingNumbers(
        (invoicesData || []).map((inv) => inv.invoice_number).filter(Boolean),
      );
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching compose data:", error);
      // A failed load must not fall through to the "add payment details" gate
      setLoadError(error.message || "We couldn't load what this invoice needs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) fetchComposeData();
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [fetchComposeData]);

  // Reference for this invoice: per client, so it never reveals the overall count
  const selectedClientName = clients.find((c) => c.id === selectedClientId)?.client_name;
  const invoiceNumber = useMemo(
    () => (selectedClientName ? nextInvoiceNumber(selectedClientName, existingNumbers) : ""),
    [selectedClientName, existingNumbers],
  );

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
    setErrorMsg(null);

    const itemsInvalid = lineItems.some(
      (item) => !item.description.trim() || !(item.quantity > 0) || item.rate < 0,
    );
    const dueBeforeIssue = Boolean(dueDate && issueDate && dueDate < issueDate);

    setClientError(selectedClientId ? null : "Choose who this invoice is for.");
    setDueDateError(dueBeforeIssue ? "The due date can't be before the issue date." : null);
    setShowItemErrors(itemsInvalid);

    if (!selectedClientId || dueBeforeIssue || itemsInvalid) {
      setErrorMsg(
        itemsInvalid
          ? "Every line item needs a description and a quantity above zero."
          : "Fix the highlighted fields to save this invoice.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Your session has expired. Sign in again to save this invoice.");

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
          currentInvoiceNumber = bumpInvoiceNumber(currentInvoiceNumber);
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
            currentInvoiceNumber = bumpInvoiceNumber(currentInvoiceNumber);
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
        error.message || "The invoice wasn't saved. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const backLink = (
    <Link
      to="/invoices"
      className="mb-6 inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
    >
      <FiArrowLeft className="size-4" />
      Invoices
    </Link>
  );

  const header = (
    <div className="mb-8">
      <h1 className="text-2xl lg:text-3xl font-semibold tracking-[-0.03em] text-fg">
        New invoice
      </h1>
    </div>
  );

  if (loading) {
    return (
      <main aria-busy="true" className="py-6 px-4 lg:py-10 lg:px-8 max-w-4xl mx-auto">
        {backLink}
        {header}
        <div className="space-y-8 motion-safe:animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="mb-5 h-4 w-28 rounded bg-line" />
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="h-10 rounded-md bg-line" />
                <div className="h-10 rounded-md bg-line" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-4xl mx-auto">
        {backLink}
        {header}
        <div className="max-w-md border-t border-fg pt-5">
          <h2 className="font-medium text-fg">We couldn't start a new invoice</h2>
          <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{loadError}</p>
          <button
            type="button"
            onClick={fetchComposeData}
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-line-strong px-3.5 py-2 text-sm font-medium text-fg hover:border-fg-subtle hover:bg-surface transition-colors cursor-pointer"
          >
            <FiRefreshCw className="size-3.5" />
            Try again
          </button>
        </div>
      </main>
    );
  }

  const isMissingBilling = !profile?.bank_name || !profile?.account_number;

  if (isMissingBilling) {
    return (
      <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-4xl mx-auto">
        {backLink}
        {header}
        <div className="max-w-md border-t border-fg pt-5">
          <h2 className="font-medium text-fg">Add your payment details first</h2>
          <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">
            Every invoice tells your client where to pay you, so your bank name
            and account number need to be in your profile before you create one.
          </p>
          <Link
            to="/profile"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-canvas transition hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-muted"
          >
            Set up payment details
            <FiArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  const senderName =
    profile.business_name ||
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
    "Your business";
  const senderPlace = [profile.city, profile.country].filter(Boolean).join(", ");
  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency;

  return (
    <main className="pt-6 px-4 lg:pt-10 lg:px-8 max-w-4xl mx-auto text-fg selection:bg-line-strong">
      {backLink}
      {header}

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-8 pb-8">
          {/* From */}
          <FormSection
            title="From"
            aside={
              <Link to="/profile" className="text-sm text-fg-muted transition-colors hover:text-fg">
                Edit profile
              </Link>
            }
          >
            <div>
              <p className="font-medium text-fg">{senderName}</p>
              <p className="mt-0.5 text-sm text-fg-muted break-words">
                {profile.email}
                {senderPlace && <span className="text-fg-subtle"> · {senderPlace}</span>}
              </p>
            </div>
          </FormSection>

          {/* Bill to */}
          <FormSection title="Bill to">
            {clients.length > 0 ? (
              <div className="sm:max-w-sm">
                <SelectField
                  label="Client"
                  value={selectedClientId}
                  error={clientError}
                  disabled={submitting}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value);
                    if (e.target.value) setClientError(null);
                  }}
                >
                  <option value="" disabled>
                    Choose a client
                  </option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.client_name}
                    </option>
                  ))}
                </SelectField>
              </div>
            ) : (
              <div className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-fg">You haven't added any clients yet.</p>
                <Link
                  to="/clients"
                  className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-fg transition-colors hover:text-fg-muted"
                >
                  Add a client
                  <FiArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </FormSection>

          {/* Details */}
          <FormSection title="Details">
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <span className="mb-1.5 block text-sm font-medium text-fg">Invoice number</span>
                <p className="flex h-[42px] items-center rounded-md border border-line bg-canvas px-3 font-mono text-sm tabular-nums text-fg-muted">
                  {invoiceNumber || <span className="text-fg-subtle">Choose a client</span>}
                </p>
              </div>

              <div>
                <span className="mb-1.5 block text-sm font-medium text-fg">Currency</span>
                <p className="flex h-[42px] items-center rounded-md border border-line bg-canvas px-3 font-mono text-sm text-fg-muted">
                  {currency} ({currencySymbol})
                </p>
              </div>

              <AuthField
                label="Issue date"
                type="date"
                disabled={submitting}
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="tabular-nums"
              />

              <AuthField
                label="Due date"
                labelAside={<Optional />}
                type="date"
                min={issueDate || undefined}
                disabled={submitting}
                value={dueDate}
                error={dueDateError}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setDueDateError(null);
                }}
                className="tabular-nums"
              />
            </div>
          </FormSection>

          {/* Line items */}
          <LineItemsSection
            lineItems={lineItems}
            currency={currency}
            submitting={submitting}
            showErrors={showItemErrors}
            onLineItemChange={handleLineItemChange}
            onAddLineItem={addLineItem}
            onRemoveLineItem={removeLineItem}
          />

          {/* Notes */}
          <FormSection title="Notes & terms" aside={<Optional />}>
            <textarea
              id="invoice_notes"
              aria-label="Notes and terms"
              rows={4}
              disabled={submitting}
              placeholder="e.g. Payment due within 14 days by bank transfer."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="block w-full resize-none rounded-md border border-line-strong bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-fg-subtle transition-colors hover:border-fg-subtle focus:border-fg-muted focus:outline-none disabled:opacity-50"
            />
          </FormSection>
        </div>

        {/* Save bar */}
        <div className="sticky bottom-0 -mx-4 lg:-mx-8 flex flex-col-reverse gap-3 border-t border-line bg-canvas/85 px-4 py-3 backdrop-blur-md sm:flex-row sm:items-center sm:justify-end lg:px-8">
          <p aria-live="polite" className="min-h-5 text-sm sm:mr-auto">
            {errorMsg && (
              <span role="alert" className="flex items-start gap-1.5 text-danger">
                <FiAlertCircle className="mt-0.5 size-4 shrink-0" />
                {errorMsg}
              </span>
            )}
          </p>
          <div className="flex gap-2">
            <Link
              to="/invoices"
              className="flex-1 rounded-md px-3.5 py-2.5 text-center text-sm font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg sm:flex-none"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || clients.length === 0}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-canvas transition hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-muted sm:flex-none"
            >
              {submitting && <FiLoader className="size-4 animate-spin" />}
              {submitting ? "Saving" : "Save & preview"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default NewInvoicePage;
