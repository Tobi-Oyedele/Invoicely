import { z } from "zod";
import { emailSchema, passwordSchema, requiredSchema } from "./authValidation";

export const registerInputSchema = z.object({
  firstName: requiredSchema("first name"),
  lastName: requiredSchema("last name"),
  email: emailSchema,
  password: passwordSchema,
});
export type RegisterInput = z.infer<typeof registerInputSchema>;

export const registerResponseSchema = z.object({
  user: z.object({
    id: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.email(),
  }),
});
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

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

export const paymentDetailsSchema = z.object({
  bankName: z.string().min(1),
  accountNumber: z.string().min(1),
  accountHolderName: z.string().min(1),
  accountType: z.string().optional(),
  routingSortCode: z.string().optional(),
  swiftBicCode: z.string().optional(),
  bankBranchAddress: z.string().optional(),
});

export const userSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  currency: z.enum(["NGN", "USD", "EUR", "GBP", "CAD"]),
  businessName: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  paymentDetails: paymentDetailsSchema.optional(),
  createdAt: z.iso.datetime(),
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

const invoicePartySchema = z.object({
  name: z.string().min(1), email: z.string().optional(),
  location: z.string().optional(), phone: z.string().optional(),
});
export const invoiceResponseSchema = z.object({
  id: z.string().min(1), clientId: z.string().min(1),
  invoiceNumber: z.string().min(1),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
  currency: z.string().min(1),
  from: invoicePartySchema.extend({email: z.email()}),
  billingTo: invoicePartySchema,
  issueDate: z.iso.datetime(), dueDate: z.iso.datetime().optional(),
  lineItems: z.array(z.object({
    description: z.string(), quantity: z.number(), rate: z.number(), amount: z.number(),
  })),
  subtotal: z.number(), notes: z.string().optional(),
  createdAt: z.iso.datetime(), updatedAt: z.iso.datetime(),
});
export type ApiInvoice = z.infer<typeof invoiceResponseSchema>;
export const invoicesResponseSchema = z.object({invoices: z.array(invoiceResponseSchema)});
export const singleInvoiceResponseSchema = z.object({invoice: invoiceResponseSchema});

export const invoiceEditInputSchema = z.object({
  issueDate: z.string().min(1, "Issue date is required.").pipe(z.iso.date("Enter a valid issue date.")),
  dueDate: z.iso.date("Enter a valid due date.").nullable(),
  notes: z.string(),
  lineItems: z.array(z.object({
    description: z.string().trim().min(1, "Every line item needs a description."),
    quantity: z.number().min(1, "Quantity must be at least 1."),
    rate: z.number().min(0, "Rate cannot be negative."),
  })).min(1, "Add at least one line item."),
}).refine(data => data.dueDate === null || data.dueDate >= data.issueDate, {
  message: "The due date can't be before the issue date.", path: ["dueDate"],
});
export type InvoiceEditInput = z.infer<typeof invoiceEditInputSchema>;

export const invoiceCreateInputSchema = z.object({
  clientId: z.string().min(1, "Choose who this invoice is for."),
  issueDate: z.string().min(1, "Issue date is required.").pipe(z.iso.date("Enter a valid issue date.")),
  dueDate: z.iso.date("Enter a valid due date.").optional(),
  notes: z.string(),
  lineItems: invoiceEditInputSchema.shape.lineItems,
}).refine(data => data.dueDate === undefined || data.dueDate >= data.issueDate, {
  message: "The due date can't be before the issue date.", path: ["dueDate"],
});
export type InvoiceCreateInput = z.infer<typeof invoiceCreateInputSchema>;

export const invoiceStatusInputSchema = z.object({ status: z.enum(["sent", "paid"]) });
