import { FiAlertCircle } from "react-icons/fi";

interface ErrorBannerProps {
  error: string | null;
}

export const ErrorBanner = ({ error }: ErrorBannerProps) => {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 flex items-start gap-3 transition-all animate-fadeIn">
      <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
      <div className="text-sm text-red-600 dark:text-red-400 font-medium">
        {error}
      </div>
    </div>
  );
};
