import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthShell } from "../components/auth/AuthShell";
import { FormAlert } from "../components/auth/FormAlert";
import { SignUpForm } from "../components/auth/SignUpForm";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  useEffect(() => {
    document.title = "Get Started | Invoicely";
  }, []);

  // Form Field States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUp({ firstName, lastName, email, password });
      // AuthProvider now has the full profile before opening the dashboard.
      navigate("/invoices");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start sending invoices in a few minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="font-medium text-fg underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <FormAlert kind="error" message={error} />
      <SignUpForm
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </AuthShell>
  );
};

export default SignUpPage;
