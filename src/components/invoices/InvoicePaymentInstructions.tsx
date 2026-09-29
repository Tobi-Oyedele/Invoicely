import type { Profile } from "./InvoicePDFDocument";

interface InvoicePaymentInstructionsProps {
  sender: Profile;
}

/** Payment block on the invoice paper; labels match the PDF. */
export const InvoicePaymentInstructions = ({
  sender,
}: InvoicePaymentInstructionsProps) => {
  const rows: { label: string; value: string | null | undefined; mono?: boolean }[] = [
    { label: "Bank", value: sender.bank_name },
    { label: "Account", value: sender.account_number, mono: true },
    { label: "Name", value: sender.account_name },
    { label: "Type", value: sender.account_type },
    { label: "Routing", value: sender.routing_number, mono: true },
    { label: "SWIFT", value: sender.swift_code, mono: true },
    { label: "Bank Address", value: sender.bank_address },
  ].filter((row) => row.value);

  if (rows.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] font-medium text-paper-muted">Payment Details</p>
      <dl className="mt-2 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-1.5 text-sm">
        {rows.map(({ label, value, mono }) => (
          <div key={label} className="contents">
            <dt className="text-paper-muted">{label}</dt>
            <dd className={`break-words ${mono ? "font-mono tabular-nums" : ""}`}>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
