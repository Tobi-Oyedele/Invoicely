import { FiTrash2, FiLoader, FiAlertCircle } from "react-icons/fi";

interface Client {
  id: string;
  user_id: string;
  client_name: string;
  email: string;
  phone_number: string;
  address: string;
  created_at: string;
}

interface ClientDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClient: Client | null;
  submitting: boolean;
  actionError: string | null;
  onDeleteConfirm: () => void;
}

export const ClientDeleteModal = ({
  isOpen,
  onClose,
  selectedClient,
  submitting,
  actionError,
  onDeleteConfirm,
}: ClientDeleteModalProps) => {
  if (!isOpen || !selectedClient) return null;

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
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden z-10 transform transition-all animate-scale-in">
        {/* Modal Content */}
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/30 rounded-xl flex items-center justify-center text-red-600 dark:text-red-450 mx-auto mb-4 shadow-xs">
            <FiTrash2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Delete Client?
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              "{selectedClient.client_name}"
            </span>
            ? This will permanently remove them from your directory.
          </p>

          {actionError && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/15 border border-red-200/50 dark:border-red-900/30 rounded-xl text-left text-xs text-red-600 dark:text-red-400 font-medium mb-4 flex items-start gap-2.5">
              <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="flex-1 px-4.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={onDeleteConfirm}
              className="flex-1 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-xl px-4.5 py-2.5 text-sm font-semibold transition-all shadow-xs active:scale-[0.98] cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-2.5 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
