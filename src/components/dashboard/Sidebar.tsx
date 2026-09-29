import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiX, FiLogOut, FiLoader } from "react-icons/fi";
import { supabase } from "../../lib/supabase";
import { navItems } from "../../data/navigation";
import { useTheme } from "../../hooks/useTheme";
import { Logo } from "../brand/Logo";

interface SidebarProps {
  onClose?: () => void;
}

const THEMES = [
  { value: "light", label: "Light", Icon: FiSun },
  { value: "dark", label: "Dark", Icon: FiMoon },
] as const;

const Sidebar = ({ onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [theme, setTheme] = useTheme();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // 1. Navigate to the public landing page first.
      // This unmounts the protected DashboardLayout, preventing its AuthGuard from intercepting the null session and redirecting the user to /sign-in.
      navigate("/");

      // 2. Perform the sign-out routine in the background
      await supabase.auth.signOut();
      if (onClose) onClose();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Brand Header */}
      <div className="flex h-14 shrink-0 items-center justify-between px-5">
        <Logo to="/invoices" onClick={onClose} />

        {/* Mobile Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden -mr-1.5 flex size-8 items-center justify-center rounded-md text-fg-muted hover:text-fg hover:bg-raised transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-fg-muted"
            aria-label="Close menu"
          >
            <FiX className="size-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 pt-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fg-muted ${
                    isActive
                      ? "bg-raised font-medium text-fg ring-1 ring-line"
                      : "text-fg-muted hover:bg-surface hover:text-fg"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Theme + Sign out */}
      <div className="space-y-2 border-t border-line p-3">
        <div
          role="radiogroup"
          aria-label="Theme"
          className="flex rounded-md border border-line-strong bg-canvas p-0.5"
        >
          {THEMES.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={theme === value}
              onClick={() => setTheme(value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded py-1.5 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-fg-muted ${
                theme === value ? "bg-raised text-fg" : "text-fg-subtle hover:text-fg"
              }`}
            >
              <Icon className="size-3.5 shrink-0" />
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm text-fg-muted hover:bg-surface hover:text-fg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fg-muted"
        >
          {loggingOut ? (
            <FiLoader className="size-4 shrink-0 animate-spin" />
          ) : (
            <FiLogOut className="size-4 shrink-0" />
          )}
          {loggingOut ? "Signing out" : "Sign out"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
