import { type FormEvent } from "react";
import { FiEye, FiEyeOff, FiLoader } from "react-icons/fi";

interface SignUpFormProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  profession: string;
  setProfession: (val: string) => void;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  onSubmit: (e: FormEvent) => void;
}

export const SignUpForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  profession,
  setProfession,
  loading,
  showPassword,
  setShowPassword,
  onSubmit,
}: SignUpFormProps) => {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {/* Name Fields (Grid layout on lg desktop only) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
              <FiEyeOff className="w-4.5 h-4.5" />
            ) : (
              <FiEye className="w-4.5 h-4.5" />
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

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white dark:text-zinc-950 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-sans"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin -ml-1 mr-3 h-4 w-4 text-white dark:text-zinc-950" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </div>
    </form>
  );
};
