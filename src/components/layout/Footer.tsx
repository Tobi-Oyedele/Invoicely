import { Link } from "react-router-dom";
import { Logo } from "../brand/Logo";

const Footer = () => {
  return (
    <footer className="border-t border-line">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Logo size="sm" />
        <nav className="flex gap-6 text-sm text-fg-muted">
          <Link to="/sign-in" className="hover:text-fg transition-colors">
            Sign in
          </Link>
          <Link to="/sign-up" className="hover:text-fg transition-colors">
            Sign up
          </Link>
        </nav>
        <p className="text-xs text-fg-subtle">&copy; 2026 Invoicely</p>
      </div>
    </footer>
  );
};

export default Footer;
