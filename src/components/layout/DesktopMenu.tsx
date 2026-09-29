import { Link } from "react-router-dom";

export const DesktopMenu = () => {
  return (
    <div className="hidden md:flex items-center gap-1">
      <Link
        to="/sign-in"
        className="text-sm font-medium text-fg-muted hover:text-fg px-3 py-2 transition-colors"
      >
        Sign in
      </Link>
      <Link
        to="/sign-up"
        className="inline-flex items-center justify-center bg-fg text-canvas hover:opacity-90 active:scale-[0.98] text-sm font-medium px-3.5 py-1.5 rounded-md transition"
      >
        Get started
      </Link>
    </div>
  );
};
