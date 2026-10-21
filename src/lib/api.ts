import axios from "axios";
import { http } from "./http";
import {
  loginResponseSchema,
  errorResponseSchema,
  meResponseSchema,
} from "./schema";
import type { AuthUser, LoginResponse } from "./schema";

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    // Axios sends JSON; <unknown> keeps the response untrusted until validation.
    const response = await http.post<unknown>("/auth/login", {
      email,
      password,
    });

    const result = loginResponseSchema.safeParse(response.data);

    if (!result.success) {
      throw new Error("The server returned an unexpected login response.");
    }

    return result.data;
  } catch (error: unknown) {
    // Axios rejects non-2xx responses, including 401.
    if (axios.isAxiosError<unknown>(error)) {
      const result = errorResponseSchema.safeParse(error.response?.data);

      if (result.success) {
        throw new Error(result.data.message, { cause: error });
      }

      throw new Error(
        error.response
          ? "Login failed. Please try again."
          : "Unable to reach the server. Please try again.",
        { cause: error },
      );
    }

    // Preserve errors from response validation.
    throw error;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await http.get<unknown>("/auth/me");
    const result = meResponseSchema.safeParse(response.data);

    if (!result.success) {
      throw new Error("The server returned an unexpected profile response.");
    }

    return result.data.data;
  } catch (error: unknown) {
    // A missing or expired login is an expected result, not a server failure.
    if (axios.isAxiosError<unknown>(error) && error.response?.status === 401) {
      return null;
    }

    // Keep network, server, and response-validation failures visible.
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    // Logout returns 204 with no JSON body to validate.
    await http.post<unknown>("/auth/logout");
  } catch (error: unknown) {
    if (axios.isAxiosError<unknown>(error)) {
      const result = errorResponseSchema.safeParse(error.response?.data);
      throw new Error(
        result.success
          ? result.data.message
          : "Unable to sign out. Please try again.",
        { cause: error },
      );
    }
    throw error;
  }
}
