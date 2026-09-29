import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { AuthShell } from "../components/auth/AuthShell";
import { AuthField } from "../components/auth/AuthField";
import { FormAlert } from "../components/auth/FormAlert";
import { SubmitButton } from "../components/auth/SubmitButton";
import { validatePassword } from "../lib/authValidation";

const ResetPassword = () => {
  const navigate = useNavigate();

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

    if (passwordError || mismatchError) {
      setTouched(true);
      return;
    }

    try {
      setLoading(true);

      // Call supabase auth.updateUser to save the new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccessMsg("Your password has been successfully updated! Redirecting to sign in...");
      setTimeout(() => {
        navigate("/sign-in");
      }, 3000);
    } catch (err) {
      const error = err as Error;
      console.error("Error resetting password:", error);
      setErrorMsg(error.message || "Failed to update your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a password you haven't used here before."
      footer={
        <Link
          to="/sign-in"
          className="font-medium text-fg underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      }
    >
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
          disabled={loading}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onBlur={() => setTouched(true)}
          error={touched ? passwordError : null}
          placeholder="At least 6 characters"
        />
        <AuthField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          disabled={loading}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={touched || confirmPassword ? confirmError : null}
        />
        <div className="pt-2">
          <SubmitButton loading={loading} loadingLabel="Updating password">
            Update password
          </SubmitButton>
        </div>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
