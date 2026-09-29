import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { Logo } from "../brand/Logo";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-canvas p-6 transition-all duration-300 ease-out md:hidden ${
        isOpen
          ? "translate-x-0 opacity-100 visible pointer-events-auto"
          : "-translate-x-full opacity-0 invisible pointer-events-none"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-10">
          <Logo onClick={onClose} />
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-fg-muted hover:text-fg transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <FiX className="size-5" />
          </button>
        </div>

        <nav className="flex flex-col">
          <Link to="/sign-in" onClick={onClose} className="hamburgerMenuLinkStyles">
            Sign in
          </Link>
          <a href="#features" onClick={onClose} className="hamburgerMenuLinkStyles">
            Features
          </a>
          <a href="#how-it-works" onClick={onClose} className="hamburgerMenuLinkStyles">
            How it works
          </a>
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <Link
          to="/sign-up"
          onClick={onClose}
          className="w-full inline-flex items-center justify-center bg-fg text-canvas font-medium py-3.5 rounded-md text-base"
        >
          Get started free
        </Link>
        <p className="text-center text-xs text-fg-subtle">
          &copy; 2026 Invoicely
        </p>
      </div>
    </div>
  );
};
