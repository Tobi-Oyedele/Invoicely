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
