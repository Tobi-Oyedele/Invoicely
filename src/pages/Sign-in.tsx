import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { FiEye, FiEyeOff, FiLoader, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const SignInPage = () => {
  const navigate = useNavigate();

  // Form Field States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password toggle
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In Handler
  const handleSubmitSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // Redirect to /dashboard
      navigate("/dashboard");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handler
  const handleSubmitReset = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setSuccessMsg("A password reset link has been sent to your email address.");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "An unexpected error occurred while requesting reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-3 lg:px-8 selection:bg-zinc-100 dark:selection:bg-zinc-800 transition-colors">
      <div className="mx-auto w-full max-w-md flex flex-col items-center">
        {/* Brand Logo & Header */}
        <Link to="/" className="flex items-center gap-2.5 group mb-6">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-950 transition-transform group-hover:scale-[1.02]">
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
          <span className="font-bold tracking-tight text-xl text-zinc-900 dark:text-zinc-50">
            Invoicely
          </span>
        </Link>

        <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {isForgotPassword ? "Reset your password" : "Sign in to your account"}
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {isForgotPassword
            ? "Enter your email to receive a recovery link"
            : "Manage and monitor your invoices in one dashboard"}
        </p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl lg:px-10 transition-colors">
          {/* Notifications */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 flex items-start gap-3 transition-all">
              <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                {error}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 flex items-start gap-3 transition-all">
              <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <div className="text-sm text-green-700 dark:text-green-400 font-semibold">
                {successMsg}
              </div>
            </div>
          )}

          {isForgotPassword ? (
            /* Forgot password request form */
            <form className="space-y-5" onSubmit={handleSubmitReset}>
              <div>
                <label
                  htmlFor="reset-email"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@example.com"
                  className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white dark:text-zinc-950 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-sans"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin -ml-1 mr-3 h-4 w-4 text-white dark:text-zinc-950" />
                      Sending link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:underline hover:text-zinc-800 dark:hover:text-zinc-300 cursor-pointer"
                >
                  Back to Sign in
                </button>
              </div>
            </form>
          ) : (
            /* Regular Sign In form */
            <form className="space-y-5" onSubmit={handleSubmitSignIn}>
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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
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
                      <FiEyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <FiEye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white dark:text-zinc-950 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-sans"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin -ml-1 mr-3 h-4 w-4 text-white dark:text-zinc-950" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Bottom redirection link */}
          <div className="mt-6 text-center border-t border-zinc-100 dark:border-zinc-800 pt-5">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Don't have an account?{" "}
              <Link
                to="/sign-Up"
                className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
