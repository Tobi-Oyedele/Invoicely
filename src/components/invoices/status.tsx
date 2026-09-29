import { STATUS_STYLES, type InvoiceStatus } from "./statusStyles";

export const StatusDot = ({ status }: { status: InvoiceStatus }) => (
  <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${STATUS_STYLES[status].dot}`} />
);

/** Read-only status pill; the invoice list wraps the same look in a button. */
export const StatusMarker = ({ status }: { status: InvoiceStatus }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status].text}`}
  >
    <StatusDot status={status} />
    {status}
  </span>
);
