import { Link } from "react-router-dom";

export const DesktopMenu = () => {
  return (
    <div className="hidden md:flex items-center gap-4">
      <Link
        to="/sign-in"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
      >
        Sign In
      </Link>
      <Link
        to="/sign-up"
        className="inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 text-white dark:text-zinc-950 text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-xs"
      >
        Get Started
      </Link>
    </div>
  );
};

