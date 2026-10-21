import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "../../auth/AuthContext";
import type { AuthUser, RegisterInput } from "../../lib/schema";
import { getCurrentUser, login, logout, register } from "../../lib/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function retry(): Promise<void> {
    setError(null);
    setLoading(true);

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Unable to check your login.",
      );
    } finally {
      setLoading(false);
    }
  }

  // On mount, check getCurrentUser().
  useEffect(() => {
    let active = true;

    async function checkLogin() {
      try {
        const currentUser = await getCurrentUser();
        if (active) {
          setUser(currentUser);
        }
      } catch (error: unknown) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to check your login.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void checkLogin();

    return () => {
      active = false;
    };
  }, []);

  // Sign-in forms own their submitting/error state.
  async function signIn(email: string, password: string): Promise<void> {
    await login(email, password);
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Login could not be confirmed. Please sign in again.");
    }

    setUser(currentUser);
    setError(null);
  }

  async function signUp(input: RegisterInput): Promise<void> {
    await register(input);
    // Use the new cookie to load the same full profile as sign-in.
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Your account was created, but login could not be confirmed. Please sign in.");
    }
    setUser(currentUser);
    setError(null);
  }

  async function signOut(): Promise<void> {
    // Clear local state only after the server clears the cookie.
    // Failures propagate to the caller so it can offer another attempt.
    await logout();
    setUser(null);
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signIn, signUp, signOut, retry }}
    >
      {children}
    </AuthContext.Provider>
  );
}
