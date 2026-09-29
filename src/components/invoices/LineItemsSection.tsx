import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import type { LineItem } from "./InvoicePDFDocument";

interface LineItemsSectionProps {
  lineItems: LineItem[];
  currency: string;
  submitting: boolean;
  /** Mark rows missing a description or quantity after a failed save. */
  showErrors?: boolean;
  onLineItemChange: (index: number, field: keyof LineItem, value: string | number) => void;
  onAddLineItem: () => void;
  onRemoveLineItem: (index: number) => void;
}

// Amounts are figures plus a faint currency code, so columns align across currencies.
const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const inputBase =
  "block w-full rounded-md border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-subtle transition-colors focus:outline-none disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

const borderFor = (invalid: boolean) =>
  invalid ? "border-danger" : "border-line-strong hover:border-fg-subtle focus:border-fg-muted";

const mobileLabel = "mb-1 block text-xs font-medium text-fg-muted md:hidden";

// Desktop column template shared by the header and every row
const columns = "md:grid md:grid-cols-[minmax(0,1fr)_5.5rem_9.5rem_8.5rem_2rem] md:items-center md:gap-3";

export const LineItemsSection = ({
  lineItems,
  currency,
  submitting,
  showErrors = false,
  onLineItemChange,
  onAddLineItem,
  onRemoveLineItem,
}: LineItemsSectionProps) => {
  // The row added last takes focus so typing can continue straight away
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const code = currency || "NGN";

  const total = lineItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.rate || 0),
    0,
  );

  return (
    <section>
      <div className="mb-2 border-b border-line pb-2">
        <h2 className="font-medium text-fg">Line items</h2>
      </div>

      {/* Column headers (desktop) */}
      <div className={`hidden text-xs font-medium text-fg-muted pb-1 ${columns}`} aria-hidden>
        <span>Description</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Rate</span>
        <span className="text-right">Amount</span>
        <span />
      </div>

      <ul className="divide-y divide-line md:divide-y-0">
        {lineItems.map((item, index) => {
          const n = index + 1;
          const descriptionInvalid = showErrors && !item.description.trim();
          const quantityInvalid = showErrors && !(item.quantity > 0);

          return (
            <li key={index} className={`relative py-4 md:py-1.5 ${columns}`}>
              {/* Description */}
              <div className="pr-10 md:pr-0">
                <label htmlFor={`item-${index}-description`} className={mobileLabel}>
                  Description
                </label>
                <input
                  id={`item-${index}-description`}
                  type="text"
                  aria-label={`Item ${n} description`}
                  aria-invalid={descriptionInvalid || undefined}
                  autoFocus={focusIndex === index}
                  disabled={submitting}
                  placeholder="e.g. Website design"
                  value={item.description}
                  onChange={(e) => onLineItemChange(index, "description", e.target.value)}
                  className={`${inputBase} ${borderFor(descriptionInvalid)}`}
                />
              </div>

              {/* Qty + rate side by side on mobile */}
              <div className="mt-3 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 md:contents">
                <div>
                  <label htmlFor={`item-${index}-qty`} className={mobileLabel}>
                    Qty
                  </label>
                  <input
                    id={`item-${index}-qty`}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    aria-label={`Item ${n} quantity`}
                    aria-invalid={quantityInvalid || undefined}
                    disabled={submitting}
                    value={item.quantity || ""}
                    placeholder="0"
                    onChange={(e) => onLineItemChange(index, "quantity", e.target.value)}
                    className={`${inputBase} ${borderFor(quantityInvalid)} text-right font-mono tabular-nums`}
                  />
                </div>

                <div>
                  <label htmlFor={`item-${index}-rate`} className={mobileLabel}>
                    Rate
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-fg-subtle">
                      {code}
                    </span>
                    <input
                      id={`item-${index}-rate`}
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      aria-label={`Item ${n} rate in ${code}`}
                      disabled={submitting}
                      value={item.rate || ""}
                      placeholder="0.00"
                      onChange={(e) => onLineItemChange(index, "rate", e.target.value)}
                      className={`${inputBase} ${borderFor(false)} pl-12 text-right font-mono tabular-nums`}
                    />
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="mt-3 flex items-baseline justify-between md:mt-0 md:block md:text-right">
                <span className="text-xs font-medium text-fg-muted md:hidden">Amount</span>
                <span className="font-mono text-sm tabular-nums text-fg whitespace-nowrap">
                  {formatAmount((item.quantity || 0) * (item.rate || 0))}
                </span>
              </div>

              {/* Remove */}
              <div className="absolute right-0 top-4 md:static md:flex md:justify-end">
                <button
                  type="button"
                  disabled={lineItems.length === 1 || submitting}
                  onClick={() => {
                    setFocusIndex(null);
                    onRemoveLineItem(index);
                  }}
                  aria-label={`Remove item ${n}`}
                  className="flex size-8 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-danger-bg hover:text-danger focus-visible:outline-2 focus-visible:outline-fg-muted cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg-subtle"
                >
                  <FiX className="size-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Add item + total */}
      <div className="mt-3 flex flex-col gap-5 border-t border-line pt-4 sm:flex-row sm:items-start sm:justify-between">
        <button
          type="button"
          disabled={submitting}
          onClick={() => {
            setFocusIndex(lineItems.length);
            onAddLineItem();
          }}
          className="inline-flex items-center gap-1.5 self-start rounded-md py-1 text-sm font-medium text-fg-muted transition-colors hover:text-fg cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-muted"
        >
          <FiPlus className="size-4" />
          Add line item
        </button>

        <div className="flex items-baseline justify-between gap-6 border-t border-fg pt-3 sm:min-w-64">
          <span className="text-sm font-medium text-fg">Total</span>
          <span className="font-mono tabular-nums whitespace-nowrap" aria-live="polite">
            <span className="text-xl font-semibold tracking-tight text-fg">{formatAmount(total)}</span>{" "}
            <span className="text-xs text-fg-subtle">{code}</span>
          </span>
        </div>
      </div>
    </section>
  );
};
