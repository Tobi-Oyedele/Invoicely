import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheck,
  FiDownload,
  FiEdit2,
  FiLoader,
  FiRefreshCw,
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
import { StatusMarker } from "../../components/invoices/status";
import { CURRENCIES, DEFAULT_CURRENCY } from "../../lib/currency";
import { formatDate } from "../../utils/date";
import { AuthField } from "../../components/auth/AuthField";
import { FormAlert } from "../../components/auth/FormAlert";
import { FormSection, Optional } from "../../components/ui/FormSection";
import { SelectField } from "../../components/ui/SelectField";

interface ViewInvoicePageProps {
  defaultEditing?: boolean;
  idOverride?: string;
}

// Figures only; the currency code sits beside them so columns align
const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const lineTotal = (item: LineItem) => (item.quantity || 0) * (item.rate || 0);

const paperLabel = "text-[11px] font-medium text-paper-muted";

const ViewInvoicePage = ({ defaultEditing = false, idOverride }: ViewInvoicePageProps) => {
  const { id: paramId } = useParams<{ id: string }>();
  const id = idOverride || paramId;
  const navigate = useNavigate();

  // Loading and edit toggles
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(defaultEditing);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [dueDateError, setDueDateError] = useState<string | null>(null);
  const [showItemErrors, setShowItemErrors] = useState(false);

  // Loaded database schemas
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [sender, setSender] = useState<Profile | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  // Form states (prefilled on load and reset on cancel)
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const fillForm = (inv: Invoice) => {
    setInvoiceNumber(inv.invoice_number || "");
    setIssueDate(inv.issue_date || "");
    setDueDate(inv.due_date || "");
    setSelectedClientId(inv.client_id || "");
    setNotes(inv.notes || "");
    setLineItems(inv.line_items || []);
    setCurrency(inv.currency || DEFAULT_CURRENCY);
  };

  /** `quiet` refreshes after a save without swapping the page for a skeleton. */
  const fetchInvoiceDetails = useCallback(async (quiet = false) => {
    if (!id) return;

    try {
      if (!quiet) setLoading(true);
      setLoadError(null);
      setNotFound(false);

      // 1. Fetch invoice row with client and line items
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
      if (!invData) {
        setNotFound(true);
        return;
      }

      setInvoice(invData);
      fillForm(invData);

      // 2. Fetch sender profile details (using invoice.user_id)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", invData.user_id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileData) {
        throw new Error("Your profile couldn't be found. Add your details in Profile, then try again.");
      }
      setSender(profileData);

      // 3. Fetch user's clients list (needed for edit mode)
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
      setLoadError(error.message || "We couldn't load this invoice.");
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
    if (invoice?.invoice_number) {
      document.title = `${invoice.invoice_number} | Invoicely`;
    } else {
      document.title = "Invoice Details | Invoicely";
    }
  }, [invoice?.invoice_number]);

  useEffect(() => {
    if (justSaved) {
      const timer = setTimeout(() => setJustSaved(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [justSaved]);

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

  const leaveEditMode = () => {
    setIsEditing(false);
    setErrorMsg(null);
    setClientError(null);
    setDueDateError(null);
    setShowItemErrors(false);
    // Opened from the /edit route: return to the invoice's own address
    if (defaultEditing) navigate(`/invoices/${id}`, { replace: true });
  };

  // Discard every edit, not only line items
  const cancelEditing = () => {
    if (invoice) fillForm(invoice);
    leaveEditMode();
  };

  // Submit updates
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !invoice) return;
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
          : "Fix the highlighted fields to save your changes.",
      );
      return;
    }

    try {
      setSubmitting(true);

      // 1. Update parent invoice metadata details
      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({
          client_id: selectedClientId,
          invoice_number: invoiceNumber.trim(),
          issue_date: issueDate,
          due_date: dueDate || null,
          notes: notes.trim() || null,
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

      await fetchInvoiceDetails(true);
      leaveEditMode();
      setJustSaved(true);
    } catch (err) {
      const error = err as Error;
      console.error("Error saving changes:", error);
      setErrorMsg(error.message || "Your changes weren't saved. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Imperative PDF Generator downloader
  const handleDownloadPDF = async () => {
    if (!invoice || !sender) return;

    try {
      setDownloading(true);
      setDownloadError(null);
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
      setDownloadError(error.message || "The PDF couldn't be built. Try again.");
    } finally {
      setDownloading(false);
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

  if (loading) {
    return (
      <main aria-busy="true" className="py-6 px-4 lg:py-10 lg:px-8 max-w-4xl mx-auto">
        {backLink}
        <div className="motion-safe:animate-pulse">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="h-7 w-36 rounded bg-line" />
              <div className="h-3.5 w-28 rounded bg-line" />
            </div>
            <div className="h-10 w-40 rounded-md bg-line" />
          </div>
          <div className="h-[28rem] rounded-md bg-line/60" />
        </div>
      </main>
    );
  }

  if (notFound || loadError || !invoice || !sender) {
    return (
      <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-4xl mx-auto">
        {backLink}
        <div className="max-w-md border-t border-fg pt-5">
          <h2 className="font-medium text-fg">
            {notFound ? "This invoice doesn't exist" : "We couldn't load this invoice"}
          </h2>
          <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">
            {notFound
              ? "It may have been deleted, or the link is wrong."
              : loadError}
          </p>
          {notFound ? (
            <Link
              to="/invoices"
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-line-strong px-3.5 py-2 text-sm font-medium text-fg hover:border-fg-subtle hover:bg-surface transition-colors"
            >
              See all invoices
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => fetchInvoiceDetails()}
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-line-strong px-3.5 py-2 text-sm font-medium text-fg hover:border-fg-subtle hover:bg-surface transition-colors cursor-pointer"
            >
              <FiRefreshCw className="size-3.5" />
              Try again
            </button>
          )}
        </div>
      </main>
    );
  }

  const senderPerson = `${sender.first_name || ""} ${sender.last_name || ""}`.trim();
  const senderName = sender.business_name || senderPerson || "Your business";
  const senderPlace = [sender.city, sender.country].filter(Boolean).join(", ");

  // EDIT MODE
  if (isEditing) {
    return (
      <main className="pt-6 px-4 lg:pt-10 lg:px-8 max-w-4xl mx-auto text-fg selection:bg-line-strong">
        {backLink}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-[-0.03em] text-fg">
            Edit <span className="font-mono">{invoice.invoice_number}</span>
          </h1>
        </div>

        <form onSubmit={handleSaveChanges} noValidate>
          <div className="space-y-8 pb-8">
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
                  {sender.email}
                  {senderPlace && <span className="text-fg-subtle"> · {senderPlace}</span>}
                </p>
              </div>
            </FormSection>

            <FormSection title="Bill to">
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
            </FormSection>

            <FormSection title="Details">
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-fg">Invoice number</span>
                  <p className="flex h-[42px] items-center rounded-md border border-line bg-canvas px-3 font-mono text-sm tabular-nums text-fg-muted">
                    {invoiceNumber}
                  </p>
                </div>

                <div>
                  <span className="mb-1.5 block text-sm font-medium text-fg">Currency</span>
                  <p className="flex h-[42px] items-center rounded-md border border-line bg-canvas px-3 font-mono text-sm text-fg-muted">
                    {currency} ({CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency})
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

            <LineItemsSection
              lineItems={lineItems}
              currency={currency}
              submitting={submitting}
              showErrors={showItemErrors}
              onLineItemChange={handleLineItemChange}
              onAddLineItem={addLineItem}
              onRemoveLineItem={removeLineItem}
            />

            <FormSection title="Notes & terms" aside={<Optional />}>
              <textarea
                id="edit_invoice_notes"
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
              <button
                type="button"
                disabled={submitting}
                onClick={cancelEditing}
                className="flex-1 rounded-md px-3.5 py-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg cursor-pointer disabled:opacity-50 sm:flex-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-canvas transition hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-muted sm:flex-none"
              >
                {submitting && <FiLoader className="size-4 animate-spin" />}
                {submitting ? "Saving" : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </main>
    );
  }

  // READ-ONLY VIEW: the invoice as paper, mirroring the PDF
  const items = invoice.line_items || [];
  const total = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const code = invoice.currency || DEFAULT_CURRENCY;
  const client = invoice.clients;

  return (
    <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-4xl mx-auto text-fg selection:bg-line-strong">
      {backLink}

      {/* Header + actions */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl lg:text-3xl font-semibold tracking-[-0.03em] text-fg">
              {invoice.invoice_number}
            </h1>
            <StatusMarker status={invoice.status} />
          </div>
          <p className="mt-1.5 text-sm text-fg-muted tabular-nums">
            Created {formatDate(invoice.created_at)}
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={downloading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-line-strong px-3.5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-fg-subtle hover:bg-surface cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-muted sm:flex-none"
            >
              <FiEdit2 className="size-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-canvas transition hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-muted sm:flex-none"
            >
              {downloading ? <FiLoader className="size-4 animate-spin" /> : <FiDownload className="size-4" />}
              {downloading ? "Building PDF" : "Download PDF"}
            </button>
          </div>
          <p aria-live="polite" className="min-h-5 text-sm">
            {justSaved && (
              <span className="inline-flex items-center gap-1.5 text-accent">
                <FiCheck className="size-4" />
                Changes saved
              </span>
            )}
          </p>
        </div>
      </div>

      <FormAlert kind="error" message={downloadError} />

      {/* Paper */}
      <article
        aria-label={`Invoice ${invoice.invoice_number}`}
        className="rounded-md bg-paper p-6 text-paper-ink shadow-[0_8px_24px_-12px_rgb(0_0_0/0.6)] ring-1 ring-black/5 sm:p-10"
      >
        {/* Masthead */}
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="text-lg font-semibold tracking-tight break-words">{senderName}</p>
            {sender.business_name && senderPerson && (
              <p className="text-sm text-paper-muted">{senderPerson}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-semibold tracking-tight">Invoice</p>
            <p className="font-mono text-sm tabular-nums text-paper-muted">{invoice.invoice_number}</p>
          </div>
        </div>

        {/* Parties */}
        <div className="mt-8 grid gap-6 border-t border-paper-rule pt-6 sm:grid-cols-2">
          <div className="min-w-0">
            <p className={paperLabel}>From</p>
            <p className="mt-1 font-medium break-words">{senderName}</p>
            <div className="mt-1 space-y-0.5 text-sm text-paper-muted">
              <p className="break-words">{sender.email}</p>
              {senderPlace && <p>{senderPlace}</p>}
            </div>
          </div>
          <div className="min-w-0">
            <p className={paperLabel}>Billing To</p>
            {client ? (
              <>
                <p className="mt-1 font-medium break-words">{client.client_name}</p>
                <div className="mt-1 space-y-0.5 text-sm text-paper-muted">
                  {client.email && <p className="break-words">{client.email}</p>}
                  {client.phone_number && <p className="tabular-nums">{client.phone_number}</p>}
                  {client.address && <p className="whitespace-pre-line break-words">{client.address}</p>}
                </div>
              </>
            ) : (
              <p className="mt-1 text-sm text-paper-faint">No client</p>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <p className={paperLabel}>Issue Date</p>
            <p className="mt-1 text-sm font-medium tabular-nums">
              {invoice.issue_date ? formatDate(invoice.issue_date) : "—"}
            </p>
          </div>
          <div>
            <p className={paperLabel}>Due Date</p>
            <p className="mt-1 text-sm font-medium tabular-nums">
              {invoice.due_date ? formatDate(invoice.due_date) : "—"}
            </p>
          </div>
        </div>

        {/* Items (desktop) */}
        <table className="mt-8 hidden w-full border-collapse text-sm sm:table">
          <thead>
            <tr className="border-b border-paper-rule text-left text-[11px] text-paper-muted">
              <th scope="col" className="pb-2 font-medium">Description</th>
              <th scope="col" className="w-16 pb-2 text-right font-medium">Qty</th>
              <th scope="col" className="w-32 pb-2 text-right font-medium">Rate</th>
              <th scope="col" className="w-36 pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-rule">
            {items.map((item, index) => (
              <tr key={item.id ?? index} className="align-top">
                <td className="py-3 pr-4 break-words">{item.description}</td>
                <td className="py-3 text-right font-mono tabular-nums">{item.quantity}</td>
                <td className="py-3 text-right font-mono tabular-nums text-paper-muted">{formatAmount(item.rate)}</td>
                <td className="py-3 text-right font-mono tabular-nums">{formatAmount(lineTotal(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Items (mobile) */}
        <ul className="mt-8 divide-y divide-paper-rule border-t border-paper-rule sm:hidden">
          {items.map((item, index) => (
            <li key={item.id ?? index} className="py-3">
              <p className="text-sm break-words">{item.description}</p>
              <div className="mt-1 flex items-baseline justify-between gap-3 font-mono text-sm tabular-nums">
                <span className="text-paper-muted">
                  {item.quantity} × {formatAmount(item.rate)}
                </span>
                <span>{formatAmount(lineTotal(item))}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Totals */}
        <div className="mt-4 flex justify-end border-t border-paper-rule pt-4 sm:border-t-0 sm:pt-0">
          <div className="w-full space-y-2 text-sm sm:w-72">
            <div className="flex items-baseline justify-between text-paper-muted">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">{formatAmount(total)}</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-paper-ink pt-2">
              <span className="font-medium">Total Due</span>
              <span className="font-mono tabular-nums whitespace-nowrap">
                <span className="text-lg font-semibold tracking-tight">{formatAmount(total)}</span>{" "}
                <span className="text-xs text-paper-muted">{code}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Payment + notes */}
        <div className="mt-10 grid gap-8 border-t border-paper-rule pt-6 sm:grid-cols-2">
          <InvoicePaymentInstructions sender={sender} />
          {invoice.notes && (
            <div>
              <p className={paperLabel}>Notes & Terms</p>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-line break-words">{invoice.notes}</p>
            </div>
          )}
        </div>
      </article>
    </main>
  );
};

export default ViewInvoicePage;
