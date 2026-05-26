import { useState } from "react";
import { Link } from "react-router-dom";

export const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="md:hidden p-2 -mr-2 text-zinc-650 hover:text-zinc-900 focus:outline-none"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-zinc-950/20 backdrop-blur-xs z-40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Drawer Container */}
      <div
        className={`fixed inset-y-0 left-0 w-[285px] max-w-[80vw] bg-white z-50 p-6 border-r border-zinc-100 flex flex-col justify-between shadow-2xl transition-transform duration-350 ease-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 .125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <span className="font-bold tracking-tight text-xl text-zinc-900">Invoicio</span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 -mr-2 text-zinc-500 hover:text-zinc-900 focus:outline-none"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-1.5">
            <Link
              to="/sign-in"
              onClick={() => setIsMenuOpen(false)}
              className="text-base font-medium text-zinc-600 hover:text-zinc-900 py-2.5 px-3 rounded-lg hover:bg-zinc-50 transition-all"
            >
              Sign In
            </Link>
            <a
              href="#features"
              onClick={() => setIsMenuOpen(false)}
              className="text-base font-medium text-zinc-600 hover:text-zinc-900 py-2.5 px-3 rounded-lg hover:bg-zinc-50 transition-all"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setIsMenuOpen(false)}
              className="text-base font-medium text-zinc-600 hover:text-zinc-900 py-2.5 px-3 rounded-lg hover:bg-zinc-50 transition-all"
            >
              How It Works
            </a>
          </nav>
        </div>

        <div>
          <Link
            to="/sign-up"
            onClick={() => setIsMenuOpen(false)}
            className="w-full inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white font-medium py-3 rounded-lg transition-colors shadow-xs"
          >
            Get Started for Free
          </Link>
          <p className="text-center text-xs text-zinc-400 mt-4">
            &copy; 2026 Invoicio. Free Forever.
          </p>
        </div>
      </div>
    </>
  );
};
