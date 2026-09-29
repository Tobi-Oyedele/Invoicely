import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../dashboard/Sidebar";
import { Logo } from "../brand/Logo";

const DashboardLayout = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isSidebarOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center transition-colors">
        <svg
          className="animate-spin size-6 text-fg-subtle"
          aria-label="Loading"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4Zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647Z"
          />
        </svg>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="min-h-screen bg-canvas text-fg selection:bg-line-strong flex flex-col md:block">
      {/* Sticky Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-canvas/85 px-4 backdrop-blur-md">
        <Logo to="/invoices" />
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="-mr-1.5 flex size-9 items-center justify-center rounded-md text-fg-muted hover:text-fg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-fg-muted"
          aria-label="Open menu"
          aria-expanded={isSidebarOpen}
          aria-controls="dashboard-sidebar"
        >
          <FiMenu className="size-5" />
        </button>
      </header>

      {/* Mobile Drawer Backdrop overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/40 dark:bg-black/60"
        />
      )}

      {/* Persistent Desktop Sidebar & Sliding Drawer on Mobile.
          Closed on mobile it is also invisible, so its links leave the tab order. */}
      <div
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-canvas transition-[transform,visibility] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] md:visible md:translate-x-0 ${
          isSidebarOpen ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Responsive Layout Wrapper */}
      <div className="md:pl-64 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
