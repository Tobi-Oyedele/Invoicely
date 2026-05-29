import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Logo from "../components/sign-up/Logo";
import Header from "../components/sign-up/Header";
import { ErrorBanner } from "../components/sign-up/ErrorBanner";
import { SignUpForm } from "../components/sign-up/SignUpForm";

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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-3 lg:px-8 selection:bg-zinc-100 dark:selection:bg-zinc-800 transition-colors">
      <div className="mx-auto w-full max-w-md flex flex-col items-center">
        {/* Brand Logo & Header */}
        <Logo />
        <Header />
      </div>

      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl lg:px-10 transition-colors">
          {/* Error Banner */}
          <ErrorBanner error={error} />

          {/* Form */}
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
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onSubmit={handleSubmit}
          />

          {/* Bottom redirection message */}
          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
