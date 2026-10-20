import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { AuthShell } from "../components/auth/AuthShell";
import { AuthField } from "../components/auth/AuthField";
import { FormAlert } from "../components/auth/FormAlert";
import { SubmitButton } from "../components/auth/SubmitButton";
import { validatePassword } from "../lib/authValidation";

const ResetPassword = () => {
  const { retry } = useAuth();
  const [token] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "");
  const validToken = /^[a-f0-9]{64}$/.test(token);
  useEffect(() => {
    // Keep the secret in memory, and remove it from the address bar/history entry.
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  // Form states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI States
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const passwordError = validatePassword(newPassword);
  const mismatchError =
    confirmPassword && newPassword !== confirmPassword ? "Passwords do not match." : null;
  const confirmError = !confirmPassword ? "Confirm your new password." : mismatchError;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (passwordError || confirmError) {
      setTouched(true);
      return;
    }

    try {
      setLoading(true);

      const message = await resetPassword(token, newPassword);
      setSuccessMsg(message);
      setNewPassword("");
      setConfirmPassword("");
      setTouched(false);
      // Express cleared this browser's cookie; update shared login state too.
      await retry();
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : "Unable to update your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a new password for your account."
      footer={
        <Link
          to="/sign-in"
          className="font-medium text-fg underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      }
    >
      {!validToken && <FormAlert kind="error" message="This reset link is missing or invalid. Go back to sign in and request a new link." />}
      <FormAlert kind="error" message={errorMsg} />
      <FormAlert kind="success" message={successMsg} />
      <form
        className="space-y-4"
        noValidate
        onSubmit={(e) => {
          if (confirmError) {
            e.preventDefault();
            setTouched(true);
            return;
          }
          handleSubmit(e);
        }}
      >
        <AuthField
          label="New password"
          type="password"
          autoComplete="new-password"
          disabled={loading || !validToken || !!successMsg}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onBlur={() => setTouched(true)}
          error={touched ? passwordError : null}
          placeholder="At least 8 characters"
        />
        <AuthField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          disabled={loading || !validToken || !!successMsg}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={touched || confirmPassword ? confirmError : null}
        />
        <div className="pt-2">
          <SubmitButton disabled={!validToken || !!successMsg} loading={loading} loadingLabel="Updating password">
            Update password
          </SubmitButton>
        </div>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
