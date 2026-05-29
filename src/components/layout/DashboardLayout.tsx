import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import Sidebar from "../dashboard/Sidebar";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center transition-colors">
        <svg
          className="animate-spin h-8 w-8 text-zinc-900 dark:text-zinc-100"
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors flex flex-col md:block">
      {/* Sticky Mobile Header */}
      <header className="flex md:hidden items-center justify-between h-16 px-6 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 -ml-1 text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 focus:outline-none cursor-pointer"
            aria-label="Open sidebar"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="font-bold tracking-tight text-lg text-zinc-900 dark:text-zinc-50">
            Invoicely
          </span>
        </div>
      </header>

      {/* Mobile Drawer Backdrop overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-zinc-950/40 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Persistent Desktop Sidebar & Sliding Drawer on Mobile */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 z-50 transform transition-transform duration-300 md:translate-x-0 md:fixed md:inset-y-0 md:left-0 md:w-64 md:flex md:flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
