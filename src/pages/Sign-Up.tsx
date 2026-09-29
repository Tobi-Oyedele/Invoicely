import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { AuthShell } from "../components/auth/AuthShell";
import { FormAlert } from "../components/auth/FormAlert";
import { SignUpForm } from "../components/auth/SignUpForm";

const SignUpPage = () => {
  const navigate = useNavigate();

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
      // 1. Call supabase.auth.signUp with email and password
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw signUpError;
      }

      const user = data.user;
      if (!user) {
        throw new Error("Could not create user account. Please try again.");
      }

      // 2. On success, insert a row into the profiles table
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
      });

      if (profileError) {
        throw profileError;
      }

      // 3. Redirect to /invoices
      navigate("/invoices");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "An unexpected error occurred during sign up.");
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
