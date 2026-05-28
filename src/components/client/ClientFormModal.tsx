import { FiX, FiAlertCircle, FiLoader } from "react-icons/fi";

interface Client {
  id: string;
  user_id: string;
  client_name: string;
  email: string;
  phone_number: string;
  address: string;
  created_at: string;
}

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClient: Client | null;
  submitting: boolean;
  actionError: string | null;
  clientName: string;
  setClientName: (val: string) => void;
  clientEmail: string;
  setClientEmail: (val: string) => void;
  clientPhone: string;
  setClientPhone: (val: string) => void;
  clientAddress: string;
  setClientAddress: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ClientFormModal = ({
  isOpen,
  onClose,
  selectedClient,
  submitting,
  actionError,
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  clientPhone,
  setClientPhone,
  clientAddress,
  setClientAddress,
  onSubmit,
}: ClientFormModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glass backdrop overlay */}
      <div
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => {
          if (!submitting) onClose();
        }}
      />

      {/* Modal Container */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden z-10 transform transition-all animate-scale-in">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {selectedClient ? "Edit Client Details" : "Add New Client"}
          </h2>
          <button
            disabled={submitting}
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-950 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {actionError && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/15 border border-red-200/50 dark:border-red-900/30 rounded-xl flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 font-medium">
                <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{actionError}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="client_name"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                id="client_name"
                type="text"
                required
                disabled={submitting}
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="client_email"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <input
                id="client_email"
                type="email"
                disabled={submitting}
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="client_phone"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Phone Number
              </label>
              <input
                id="client_phone"
                type="tel"
                disabled={submitting}
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="client_address"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Billing Address
              </label>
              <textarea
                id="client_address"
                rows={3}
                disabled={submitting}
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all resize-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="px-6 py-4.5 bg-zinc-50/50 dark:bg-zinc-950/20 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="px-4.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 dark:text-zinc-950 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-xs active:scale-[0.98] cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-2.5 h-4 w-4" />
                  Saving...
                </>
              ) : (
                "Save Client"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
