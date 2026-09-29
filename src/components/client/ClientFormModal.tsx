import { FiX, FiLoader } from "react-icons/fi";
import { Dialog } from "../ui/Dialog";
import { AuthField } from "../auth/AuthField";
import { FormAlert } from "../auth/FormAlert";
import type { Client } from "./types";

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClient: Client | null;
  submitting: boolean;
  actionError: string | null;
  nameError: string | null;
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

const Optional = () => <span className="text-xs text-fg-subtle">Optional</span>;

export const ClientFormModal = ({
  isOpen,
  onClose,
  selectedClient,
  submitting,
  actionError,
  nameError,
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
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      dismissible={!submitting}
      labelledBy="client-form-title"
      className="max-w-md"
    >
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 id="client-form-title" className="text-lg font-semibold tracking-[-0.02em] text-fg">
          {selectedClient ? "Edit client" : "Add client"}
        </h2>
        <button
          type="button"
          disabled={submitting}
          onClick={onClose}
          aria-label="Close"
          className="-mr-1.5 flex size-8 items-center justify-center rounded-md text-fg-subtle hover:text-fg hover:bg-surface transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-fg-muted"
        >
          <FiX className="size-4" />
        </button>
      </div>

      <form onSubmit={onSubmit}>
        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
          {actionError && (
            <div className="[&>div]:mb-0">
              <FormAlert kind="error" message={actionError} />
            </div>
          )}

          <AuthField
            label="Client name"
            autoFocus
            autoComplete="organization"
            disabled={submitting}
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            error={nameError}
          />

          <AuthField
            label="Email"
            type="email"
            autoComplete="off"
            labelAside={<Optional />}
            disabled={submitting}
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />

          <AuthField
            label="Phone"
            type="tel"
            autoComplete="off"
            labelAside={<Optional />}
            disabled={submitting}
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className="tabular-nums"
          />

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="client_address" className="text-sm font-medium text-fg">
                Billing address
              </label>
              <Optional />
            </div>
            <textarea
              id="client_address"
              rows={3}
              disabled={submitting}
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              className="block w-full resize-none rounded-md border border-line-strong bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-fg-subtle transition-colors hover:border-fg-subtle focus:border-fg-muted focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-6 py-4">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="rounded-md px-3.5 py-2 text-sm font-medium text-fg-muted hover:text-fg hover:bg-surface transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-fg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-fg px-3.5 py-2 text-sm font-medium text-canvas transition hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-wait focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-muted"
          >
            {submitting && <FiLoader className="size-4 animate-spin" />}
            {submitting ? "Saving" : selectedClient ? "Save changes" : "Add client"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};
