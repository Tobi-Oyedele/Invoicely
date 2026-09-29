import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .pipe(z.email("Enter a valid email address, like name@company.com."));

export const passwordSchema = z
  .string()
  .min(1, "Enter a password.")
  .min(6, "Password should be at least 6 characters.");

export const requiredSchema = (label: string) =>
  z.string().trim().min(1, `Enter your ${label}.`);

/** Returns the first error message, or null when the value is valid. */
const check = (schema: z.ZodType, value: string): string | null => {
  const result = schema.safeParse(value);
  return result.success ? null : result.error.issues[0].message;
};

export const validateEmail = (value: string) => check(emailSchema, value);
export const validatePassword = (value: string) => check(passwordSchema, value);
export const validateRequired = (label: string) => (value: string) =>
  check(requiredSchema(label), value);
