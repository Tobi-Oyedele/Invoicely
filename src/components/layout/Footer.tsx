import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-950">
            <svg
              className="w-3.5 h-3.5"
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
          <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Invoicely
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-100 md:order-last">
          &copy; 2026 Invoicely. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-450">
          <Link
            to="/sign-in"
            className="text-zinc-900 dark:text-zinc-100 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/Sign-Up"
            className="text-zinc-900 dark:text-zinc-100 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
