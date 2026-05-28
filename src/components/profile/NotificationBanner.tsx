import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

interface NotificationBannerProps {
  successMsg: string | null;
  errorMsg: string | null;
}

export const NotificationBanner = ({
  successMsg,
  errorMsg,
}: NotificationBannerProps) => {
  if (successMsg) {
    return (
      <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 flex items-start gap-3 transition-all animate-fadeIn">
        <FiCheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm font-semibold">{successMsg}</div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-start gap-3 transition-all animate-fadeIn">
        <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm font-semibold">{errorMsg}</div>
      </div>
    );
  }

  return null;
};
