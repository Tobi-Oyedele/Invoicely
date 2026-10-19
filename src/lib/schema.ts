import { z } from "zod";

export const loginResponseSchema = z.object({
  user: z.object({
    id: z.string().min(1),
    email: z.email(),
  }),
});

// Derive the TypeScript type from the runtime schema.
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const errorResponseSchema = z.object({
  message: z.string().min(1),
});

export const userSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  currency: z.string(),
});

export type AuthUser = z.infer<typeof userSchema>;

export const meResponseSchema = z.object({
  success: z.literal(true),
  data: userSchema,
});

// Validate Express data, then adapt it to the existing client table fields.
export const clientResponseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.email().optional(),
  phone: z.string().optional(),
  billingAddress: z.string().optional(),
  createdAt: z.iso.datetime(),
}).transform((client) => ({
  id: client.id,
  client_name: client.name,
  email: client.email ?? "",
  phone_number: client.phone ?? "",
  address: client.billingAddress ?? "",
  created_at: client.createdAt,
}));

export const clientsResponseSchema = z.object({
  clients: z.array(clientResponseSchema),
});

export const clientMutationResponseSchema = z.object({ client: clientResponseSchema });
export const clientInvoiceConflictSchema = z.object({
  code: z.literal("CLIENT_HAS_INVOICES"),
  message: z.string(),
  invoiceCount: z.number().int().positive(),
});
