import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Logo from "../components/sign-up/Logo";
import Header from "../components/sign-up/Header";

const SignUpPage = () => {
  const navigate = useNavigate();

  // Form Field States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profession, setProfession] = useState("");
  const [businessName, setBusinessName] = useState("");

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
        profession: profession,
        business_name: businessName.trim() || null,
      });

      if (profileError) {
        throw profileError;
      }

      // 3. Redirect to /invoices
      navigate("/invoices");
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during sign up.");
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
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl md:px-10 transition-colors">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                {error}
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name Fields (Grid layout for larger devices) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
                >
                  First Name
                </label>
                <input
                  id="first-name"
                  name="firstName"
                  type="text"
                  required
                  disabled={loading}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                  className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="last-name"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
                >
                  Last Name
                </label>
                <input
                  id="last-name"
                  name="lastName"
                  type="text"
                  required
                  disabled={loading}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.doe@example.com"
                className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-3.5 pr-11 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye Off Icon
                    <svg
                      className="w-4.5 h-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    // Eye Icon
                    <svg
                      className="w-4.5 h-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Profession Field */}
            <div>
              <label
                htmlFor="profession"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Profession
              </label>
              <input
                id="profession"
                name="profession"
                type="text"
                required
                disabled={loading}
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Freelancer, Designer, Developer"
                className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
              />
            </div>

            {/* Business Name (Optional) Field */}
            <div>
              <label
                htmlFor="business-name"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Business Name{" "}
                <span className="text-zinc-400 dark:text-zinc-500 font-normal normal-case italic">
                  (Optional)
                </span>
              </label>
              <input
                id="business-name"
                name="businessName"
                type="text"
                disabled={loading}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white dark:text-zinc-950 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-sans"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white dark:text-zinc-950"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4Zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647Z"
                      />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>

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
