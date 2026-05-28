import type { Profile } from "./InvoicePDFDocument";

interface InvoicePaymentInstructionsProps {
  sender: Profile;
}

export const InvoicePaymentInstructions = ({
  sender,
}: InvoicePaymentInstructionsProps) => {
  if (
    !sender.bank_name &&
    !sender.account_number &&
    !sender.account_name &&
    !sender.account_type &&
    !sender.routing_number &&
    !sender.swift_code &&
    !sender.bank_address
  ) {
    return null;
  }

  return (
    <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 select-none">
      <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-55 uppercase tracking-widest mb-3">
        Payment Instructions
      </h3>
      <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-900/60 rounded-xl max-w-lg text-xs space-y-1.5 text-zinc-700 dark:text-zinc-350">
        <p className="font-semibold text-zinc-950 dark:text-zinc-100 mb-1">
          Payment Details
        </p>
        {sender.bank_name && (
          <p>
            <span className="font-medium opacity-60">Bank Name:</span>{" "}
            {sender.bank_name}
          </p>
        )}
        {sender.account_number && (
          <p>
            <span className="font-medium opacity-60">Account Number:</span>{" "}
            {sender.account_number}
          </p>
        )}
        {sender.account_name && (
          <p>
            <span className="font-medium opacity-60">Account Name:</span>{" "}
            {sender.account_name}
          </p>
        )}
        {sender.account_type && (
          <p>
            <span className="font-medium opacity-60">Account Type:</span>{" "}
            {sender.account_type}
          </p>
        )}
        {sender.routing_number && (
          <p>
            <span className="font-medium opacity-60">Routing Number:</span>{" "}
            {sender.routing_number}
          </p>
        )}
        {sender.swift_code && (
          <p>
            <span className="font-medium opacity-60">SWIFT / BIC Code:</span>{" "}
            {sender.swift_code}
          </p>
        )}
        {sender.bank_address && (
          <p>
            <span className="font-medium opacity-60">Bank Address:</span>{" "}
            {sender.bank_address}
          </p>
        )}
      </div>
    </div>
  );
};
