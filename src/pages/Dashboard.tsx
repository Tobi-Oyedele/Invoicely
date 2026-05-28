import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { FiAlertCircle, FiArrowRight } from "react-icons/fi";

const Dashboard = () => {
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) return;

        const { data: profile, error: dbError } = await supabase
          .from("profiles")
          .select("city, country, bank_name, account_number")
          .eq("id", user.id)
          .maybeSingle();

        if (dbError) throw dbError;

        const missing = [];
        if (!profile) {
          missing.push("City", "Country", "Bank Name", "Account Number");
        } else {
          if (!profile.city) missing.push("City");
          if (!profile.country) missing.push("Country");
          if (!profile.bank_name) missing.push("Bank Name");
          if (!profile.account_number) missing.push("Account Number");
        }

        setMissingFields(missing);
      } catch (err) {
        console.error("Error checking profile status:", err);
      }
    };

    checkProfileStatus();
  }, []);

  return (
    <main className="py-10 px-6 max-w-7xl mx-auto selection:bg-zinc-100 dark:selection:bg-zinc-800 transition-all">
      {/* Profile Setup Reminder Banner */}
      {missingFields.length > 0 && (
        <div className="mb-8 p-5 md:p-6 bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/10 dark:to-orange-950/10 border border-amber-200/60 dark:border-amber-900/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs transition-all animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
              <FiAlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm md:text-base">
                Welcome! Let's complete your profile
              </h3>
              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed max-w-2xl">
                Please take a moment to complete your profile details. To
                dismiss this reminder, you need to set up your:{" "}
                <span className="font-semibold text-amber-800 dark:text-amber-300">
                  {missingFields.join(", ")}
                </span>
                .{" "}
              </p>
            </div>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs md:text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 dark:text-zinc-950 rounded-xl shrink-0 shadow-xs hover:shadow-md active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto"
          >
            <span>Complete Profile</span>
            <FiArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Welcome back! Here's an overview of your business performance.
        </p>
      </div>

      {/* Placeholder Area */}
      <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl h-96 flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm">
        Content is coming soon...
      </div>
    </main>
  );
};

export default Dashboard;
