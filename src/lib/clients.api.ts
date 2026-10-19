import axios from "axios";
import { http } from "./http";
import { clientsResponseSchema, errorResponseSchema, clientMutationResponseSchema, clientInvoiceConflictSchema } from "./schema";
import type { Client } from "../components/client/types";

export async function getClients(): Promise<Client[]> {
  try {
    const response = await http.get<unknown>("/clients");
    const result = clientsResponseSchema.safeParse(response.data);
    if (!result.success) {
      throw new Error("The server returned an unexpected clients response.");
    }
    return result.data.clients;
  } catch (error: unknown) {
    if (axios.isAxiosError<unknown>(error)) {
      if (error.response?.status === 401) {
        throw new Error("Your session has expired. Sign in again to see your clients.", { cause: error });
      }
      const result = errorResponseSchema.safeParse(error.response?.data);
      throw new Error(
        result.success ? result.data.message : "Unable to load clients. Please try again.",
        { cause: error },
      );
    }
    throw error;
  }
}

export interface ClientInput {
  name: string;
  email: string;
  phone: string;
  billingAddress: string;
}

export class ClientHasInvoicesError extends Error {
  readonly invoiceCount: number;
  constructor(invoiceCount: number, cause: unknown) {
    super("This client has invoices and cannot be deleted.", { cause });
    this.name = "ClientHasInvoicesError";
    this.invoiceCount = invoiceCount;
  }
}

function clientRequestError(error: unknown): Error {
  if (axios.isAxiosError<unknown>(error)) {
    const result = errorResponseSchema.safeParse(error.response?.data);
    return new Error(
      result.success ? result.data.message : "Unable to reach the server. Please try again.",
      { cause: error },
    );
  }
  return error instanceof Error ? error : new Error("Client request failed.", { cause: error });
}

export async function createClient(input: ClientInput): Promise<Client> {
  try {
    const response = await http.post<unknown>("/clients", input);
    const result = clientMutationResponseSchema.safeParse(response.data);
    if (!result.success) throw new Error("The server returned an unexpected client response.");
    return result.data.client;
  } catch (error: unknown) {
    throw clientRequestError(error);
  }
}

export async function updateClient(id: string, input: ClientInput): Promise<Client> {
  try {
    const response = await http.patch<unknown>(`/clients/${encodeURIComponent(id)}`, input);
    const result = clientMutationResponseSchema.safeParse(response.data);
    if (!result.success) throw new Error("The server returned an unexpected client response.");
    return result.data.client;
  } catch (error: unknown) {
    throw clientRequestError(error);
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    await http.delete<unknown>(`/clients/${encodeURIComponent(id)}`);
  } catch (error: unknown) {
    if (axios.isAxiosError<unknown>(error) && error.response?.status === 409) {
      const result = clientInvoiceConflictSchema.safeParse(error.response.data);
      if (result.success) {
        throw new ClientHasInvoicesError(result.data.invoiceCount, error);
      }
    }
    throw clientRequestError(error);
  }
}
