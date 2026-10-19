import axios from "axios";
import { http } from "./http";
import {
  invoicesResponseSchema,
  singleInvoiceResponseSchema,
  errorResponseSchema,
  invoiceEditInputSchema,
  invoiceCreateInputSchema,
  invoiceStatusInputSchema,
} from "./schema";
import type { ApiInvoice, InvoiceEditInput, InvoiceCreateInput } from "./schema";

function requestError(error: unknown): Error {
  if (axios.isAxiosError<unknown>(error)) {
    const result = errorResponseSchema.safeParse(error.response?.data);
    return new Error(
      result.success
        ? result.data.message
        : "Unable to load invoices. Please try again.",
      { cause: error },
    );
  }
  return error instanceof Error
    ? error
    : new Error("Invoice request failed.", { cause: error });
}

export async function getInvoices(): Promise<ApiInvoice[]> {
  try {
    const response = await http.get<unknown>("/invoices");
    const result = invoicesResponseSchema.safeParse(response.data);
    if (!result.success)
      throw new Error("The server returned an unexpected invoices response.");
    return result.data.invoices;
  } catch (error: unknown) {
    throw requestError(error);
  }
}

export async function getInvoice(id: string): Promise<ApiInvoice | null> {
  try {
    const response = await http.get<unknown>(
      `/invoices/${encodeURIComponent(id)}`,
    );
    const result = singleInvoiceResponseSchema.safeParse(response.data);
    if (!result.success)
      throw new Error("The server returned an unexpected invoice response.");
    return result.data.invoice;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404)
      return null;
    throw requestError(error);
  }
}

// Adapt API snapshots to the current table/PDF shape without inventing owner IDs.
export function invoiceToView(invoice: ApiInvoice) {
  return {
    id: invoice.id,
    client_id: invoice.clientId,
    invoice_number: invoice.invoiceNumber,
    issue_date: invoice.issueDate.slice(0, 10),
    due_date: invoice.dueDate?.slice(0, 10) ?? "",
    status: invoice.status,
    notes: invoice.notes ?? null,
    currency: invoice.currency,
    created_at: invoice.createdAt,
    line_items: invoice.lineItems.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
    })),
    clients: {
      id: invoice.clientId,
      client_name: invoice.billingTo.name,
      email: invoice.billingTo.email,
      phone_number: invoice.billingTo.phone,
      address: invoice.billingTo.location,
    },
  };
}

export async function updateInvoice(id: string, input: InvoiceEditInput): Promise<ApiInvoice> {
  const checked = invoiceEditInputSchema.safeParse(input);
  if (!checked.success) {
    throw new Error(checked.error.issues[0]?.message ?? "Check the invoice fields.");
  }
  try {
    const response = await http.patch<unknown>(`/invoices/${encodeURIComponent(id)}`, checked.data);
    const result = singleInvoiceResponseSchema.safeParse(response.data);
    if (!result.success) throw new Error("The server returned an unexpected invoice response.");
    return result.data.invoice;
  } catch (error: unknown) {
    throw requestError(error);
  }
}

export async function createInvoice(input: InvoiceCreateInput): Promise<ApiInvoice> {
  const checked = invoiceCreateInputSchema.safeParse(input);
  if (!checked.success) throw new Error(checked.error.issues[0]?.message ?? "Check the invoice fields.");
  try {
    const response = await http.post<unknown>("/invoices", checked.data);
    const result = singleInvoiceResponseSchema.safeParse(response.data);
    if (!result.success) throw new Error("The server returned an unexpected invoice response.");
    return result.data.invoice;
  } catch (error: unknown) { throw requestError(error); }
}

export async function updateInvoiceStatus(id: string, status: string): Promise<ApiInvoice> {
  const input = invoiceStatusInputSchema.safeParse({status});
  if (!input.success) throw new Error("Choose Sent or Paid. Issued invoices cannot return to Draft.");
  try {
    const response = await http.patch<unknown>(`/invoices/${encodeURIComponent(id)}/status`, input.data);
    const result = singleInvoiceResponseSchema.safeParse(response.data);
    if (!result.success) throw new Error("The server returned an unexpected invoice response.");
    return result.data.invoice;
  } catch (error: unknown) { throw requestError(error); }
}

export async function deleteInvoice(id: string): Promise<void> {
  try {
    const response = await http.delete<unknown>(`/invoices/${encodeURIComponent(id)}`);
    // A successful deletion has no JSON response body.
    if (response.status !== 204) {
      throw new Error("The server did not confirm invoice deletion. Refresh the list before trying again.");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError<unknown>(error)) {
      const result = errorResponseSchema.safeParse(error.response?.data);
      throw new Error(
        result.success ? result.data.message : "Unable to delete the invoice. Please try again.",
        {cause: error},
      );
    }
    throw error;
  }
}
