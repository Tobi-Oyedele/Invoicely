import { FiLoader } from "react-icons/fi";
import { Dialog } from "../ui/Dialog";
import { FormAlert } from "../auth/FormAlert";
import type { Client } from "./types";

interface ClientDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClient: Client | null;
  /** Invoices billed to this client; null while counting. */
  invoiceCount: number | null;
  submitting: boolean;
  actionError: string | null;
  onDeleteConfirm: () => void;
}

export const ClientDeleteModal = ({
  isOpen,
  onClose,
  selectedClient,
  invoiceCount,
  submitting,
  actionError,
  onDeleteConfirm,
}: ClientDeleteModalProps) => {
  if (!selectedClient) return null;

  const counting = invoiceCount === null;
  // Invoices reference their client without cascading, so a client with invoices can't be deleted
  const blocked = !counting && invoiceCount > 0;
  const invoiceLabel = `${invoiceCount} ${invoiceCount === 1 ? "invoice" : "invoices"}`;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      dismissible={!submitting}
      role="alertdialog"
      labelledBy="delete-client-title"
      describedBy="delete-client-body"
    >
      <div className="p-6">
        <h2
          id="delete-client-title"
          className="text-lg font-semibold tracking-[-0.02em] text-fg wrap-break-word"
        >
          {blocked
            ? `${selectedClient.client_name} can't be deleted yet`
            : `Delete ${selectedClient.client_name}?`}
        </h2>
        <p
          id="delete-client-body"
          className="mt-2 text-sm text-fg-muted leading-relaxed wrap-break-word"
        >
          {counting ? (
            "Checking for invoices billed to this client…"
          ) : blocked ? (
            <>
              <span className="font-medium text-fg">{invoiceLabel}</span>{" "}
              {invoiceCount === 1 ? "is" : "are"} billed to this client. Delete{" "}
              {invoiceCount === 1 ? "it" : "them"} first, then you can delete
              the client.
            </>
          ) : (
            "This removes the client from your list. It can't be undone."
          )}
        </p>

        {actionError && (
          <div className="mt-4 [&>div]:mb-0">
            <FormAlert kind="error" message={actionError} />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            autoFocus
            disabled={submitting}
            onClick={onClose}
            className="rounded-md px-3.5 py-2 text-sm font-medium text-fg-muted hover:text-fg hover:bg-surface transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-fg-muted"
          >
            {blocked ? "Close" : "Cancel"}
          </button>
          {!blocked && (
            <button
              type="button"
              disabled={submitting || counting}
              onClick={onDeleteConfirm}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-danger px-3.5 py-2 text-sm font-medium text-canvas transition hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-wait focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
            >
              {submitting && <FiLoader className="size-4 animate-spin" />}
              {submitting ? "Deleting" : "Delete client"}
            </button>
          )}
        </div>
      </div>
    </Dialog>
  );
};
