import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestPasswordReset } from "../lib/api";
import { AuthShell } from "../components/auth/AuthShell";
import { AuthField } from "../components/auth/AuthField";
import { FormAlert } from "../components/auth/FormAlert";
import { SubmitButton } from "../components/auth/SubmitButton";
import { useAuth } from "../hooks/useAuth";
import { validateEmail } from "../lib/authValidation";

const SignInPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    document.title = "Sign In | Invoicely";
  }, []);

  // Form Field States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password toggle
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = validateEmail(email);
  const passwordError = password ? null : "Enter your password.";
  const touchEmail = () => setTouched((t) => ({ ...t, email: true }));
  const touchPassword = () => setTouched((t) => ({ ...t, password: true }));

  // Sign In Handler
  const handleSubmitSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (emailError || passwordError) {
      setTouched({ email: true, password: true });
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await signIn(email, password);

      // Redirect to /invoices
      navigate("/invoices");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handler
  const handleSubmitReset = async (e: FormEvent) => {
    e.preventDefault();
    if (emailError) {
      setTouched((t) => ({ ...t, email: true }));
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      setSuccessMsg(await requestPasswordReset(email));
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unable to request a reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (forgot: boolean) => {
    setIsForgotPassword(forgot);
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <AuthShell
      title={isForgotPassword ? "Reset your password" : "Sign in"}
      subtitle={
        isForgotPassword
          ? "We'll email you a link to set a new one."
          : "Welcome back. Pick up where you left off."
      }
      footer={
        isForgotPassword ? (
          <button
            type="button"
            onClick={() => switchMode(false)}
            className="font-medium text-fg underline-offset-4 hover:underline cursor-pointer"
          >
            Back to sign in
          </button>
        ) : (
          <>
            New here?{" "}
            <Link
              to="/sign-up"
              className="font-medium text-fg underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </>
        )
      }
    >
      <FormAlert kind="error" message={error} />
      <FormAlert kind="success" message={successMsg} />

      {isForgotPassword ? (
        <form key="reset" className="space-y-4 animate-rise" onSubmit={handleSubmitReset} noValidate>
          <AuthField
            label="Email"
            type="email"
            autoComplete="email"
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={touchEmail}
            error={touched.email ? emailError : null}
            placeholder="you@studio.com"
          />
          <div className="pt-2">
            <SubmitButton loading={loading} loadingLabel="Sending link">
              Send reset link
            </SubmitButton>
          </div>
        </form>
      ) : (
        <form key="signin" className="space-y-4 animate-rise" onSubmit={handleSubmitSignIn} noValidate>
          <AuthField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={touchEmail}
            error={touched.email ? emailError : null}
            placeholder="you@studio.com"
          />
          <AuthField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={touchPassword}
            error={touched.password ? passwordError : null}
            labelAside={
              <button
                type="button"
                onClick={() => switchMode(true)}
                className="text-[13px] text-fg-muted hover:text-fg transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            }
          />
          <div className="pt-2">
            <SubmitButton loading={loading} loadingLabel="Signing in">
              Sign in
            </SubmitButton>
          </div>
        </form>
      )}
    </AuthShell>
  );
};

export default SignInPage;
