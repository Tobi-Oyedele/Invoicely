import { FiPlus, FiTrash2 } from "react-icons/fi";
import type { LineItem } from "./InvoicePDFDocument";

interface LineItemsSectionProps {
  lineItems: LineItem[];
  currency: string;
  submitting: boolean;
  onLineItemChange: (index: number, field: keyof LineItem, value: string | number) => void;
  onAddLineItem: () => void;
  onRemoveLineItem: (index: number) => void;
}

export const LineItemsSection = ({
  lineItems,
  currency,
  submitting,
  onLineItemChange,
  onAddLineItem,
  onRemoveLineItem,
}: LineItemsSectionProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const total = lineItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.rate || 0),
    0,
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs p-6 lg:p-8 space-y-6">
      <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
        Line Items Details
      </h3>

      <div className="space-y-4">
        {/* Header rows - hide on mobile, render on wide screens */}
        <div className="hidden md:flex gap-4 pb-2 border-b border-zinc-100 dark:border-zinc-850 text-xs font-bold text-zinc-500 uppercase select-none">
          <div className="flex-1">Description</div>
          <div className="w-24 text-center">Qty</div>
          <div className="w-48 text-right">Rate</div>
          <div className="w-36 text-right">Amount</div>
          <div className="w-10"></div>
        </div>

        {/* List of dynamic items */}
        {lineItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-4 p-4 md:p-0 bg-zinc-50/50 dark:bg-zinc-950/20 md:bg-transparent rounded-xl border border-zinc-100 dark:border-zinc-900 md:border-none relative"
          >
            {/* Description column */}
            <div className="flex-1 pr-10 md:pr-0">
              <label className="block md:hidden text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Description
              </label>
              <input
                type="text"
                required
                disabled={submitting}
                placeholder="e.g. Website development consultancy"
                value={item.description}
                onChange={(e) => onLineItemChange(index, "description", e.target.value)}
                className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
              />
            </div>

            {/* Grid wrap Qty, Rate and Amount for mobile compatibility */}
            <div className="grid grid-cols-12 md:flex gap-4 md:items-center">
              {/* Quantity column */}
              <div className="col-span-4 md:w-24">
                <label className="block md:hidden text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Qty
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  disabled={submitting}
                  value={item.quantity}
                  onChange={(e) => onLineItemChange(index, "quantity", e.target.value)}
                  className="block w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
                />
              </div>

              {/* Rate column */}
              <div className="col-span-8 md:w-48">
                <label className="block md:hidden text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Rate
                </label>
                <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2 focus-within:border-zinc-450 dark:focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-600 transition-all">
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 select-none shrink-0 py-2.5">
                    {currency || "NGN"}
                  </span>
                  <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                  <input
                    type="number"
                    required
                    min={0}
                    disabled={submitting}
                    value={item.rate || ""}
                    placeholder="0.00"
                    onChange={(e) => onLineItemChange(index, "rate", e.target.value)}
                    className="block w-full border-none outline-hidden focus:ring-0 text-sm text-right bg-transparent text-zinc-900 dark:text-zinc-50 py-2.5 min-w-0"
                  />
                </div>
              </div>

              {/* Amount text column - wraps to new line on mobile with a clean border, aligned left-to-right */}
              <div className="col-span-12 md:w-36 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end select-none border-t border-zinc-100 dark:border-zinc-800/60 pt-2.5 md:pt-0 mt-1 md:mt-0">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider md:hidden">
                  Amount
                </span>
                <span className="text-sm font-bold md:font-semibold text-zinc-900 dark:text-zinc-50 py-0.5 md:py-2.5 truncate">
                  {formatCurrency((item.quantity || 0) * (item.rate || 0))}
                </span>
              </div>
            </div>

            {/* Remove button */}
            <div className="absolute right-3 top-3 md:static md:w-10 flex items-center justify-end">
              <button
                type="button"
                disabled={lineItems.length === 1 || submitting}
                onClick={() => onRemoveLineItem(index)}
                className="p-2 text-zinc-450 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Remove line item"
              >
                <FiTrash2 className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add item trigger & summary block */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <button
          type="button"
          disabled={submitting}
          onClick={onAddLineItem}
          className="inline-flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 select-none shadow-xs hover:shadow-sm"
        >
          <FiPlus className="w-4 h-4 shrink-0" />
          <span>Add Line Item</span>
        </button>

        {/* Rolling subtotal display */}
        <div className="flex flex-col items-end gap-1.5 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-850 pt-4 sm:pt-0 text-right">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider select-none">
            Invoice Total:
          </span>
          <div className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            {formatCurrency(total)}
          </div>
        </div>
      </div>
    </div>
  );
};
