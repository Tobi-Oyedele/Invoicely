import { Link } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <div
      className={`fixed inset-0 w-full h-full bg-white dark:bg-zinc-950 z-50 p-6 flex flex-col justify-between transition-all duration-300 ease-out md:hidden ${
        isOpen
          ? "translate-x-0 opacity-100 visible pointer-events-auto"
          : "-translate-x-full opacity-0 invisible pointer-events-none"
      }`}
    >
      <div>
        {/* Header inside full-screen menu */}
        <div className="flex items-center justify-between mb-12">
          <Link to="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-950">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 .125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <span className="font-bold tracking-tight text-xl text-zinc-900 dark:text-zinc-50">
              Invoicio
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 focus:outline-none transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Large, high-impact vertical nav links */}
        <nav className="flex flex-col gap-2 mt-4">
          <Link
            to="/sign-in"
            onClick={onClose}
            className="hamburgerMenuLinkStyles"
          >
            Sign In
          </Link>
          <a
            href="#features"
            onClick={onClose}
            className="hamburgerMenuLinkStyles"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={onClose}
            className="hamburgerMenuLinkStyles"
          >
            How It Works
          </a>
        </nav>
      </div>

      {/* Footer controls inside full-screen menu */}
      <div className="flex flex-col gap-4">
        <Link
          to="/sign-up"
          onClick={onClose}
          className="w-full inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 text-white dark:text-zinc-950 font-bold py-4 rounded-xl transition-colors shadow-sm text-lg"
        >
          Get Started for Free
        </Link>
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
          &copy; 2026 Invoicio. All rights reserved.
        </p>
      </div>
    </div>
  );
};
