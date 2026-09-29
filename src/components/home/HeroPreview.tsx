import { useMemo, useState } from "react";
import { FiDownload, FiLoader, FiPlus, FiX } from "react-icons/fi";
import { CURRENCIES } from "../../lib/currency";
import type { Invoice, Profile } from "../invoices/InvoicePDFDocument";

interface DraftItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
}

const INITIAL_ITEMS: DraftItem[] = [
  { id: 1, description: "Menu redesign, print-ready", quantity: 1, rate: 1240 },
  { id: 2, description: "Photography, day rate", quantity: 2, rate: 385 },
  { id: 3, description: "Revision rounds (hourly)", quantity: 3.5, rate: 62.5 },
];

const inputBase =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none " +
  "w-full bg-canvas border border-line-strong rounded-md px-2.5 py-1.5 text-sm text-fg placeholder:text-fg-subtle transition-colors hover:border-fg-subtle focus:outline-none focus:border-fg-muted";

const HeroPreview = () => {
  const [client, setClient] = useState("Lekki Ridge Coffee Co.");
  const [currency, setCurrency] = useState("USD");
  const [items, setItems] = useState<DraftItem[]>(INITIAL_ITEMS);
  const [nextId, setNextId] = useState(4);
  const [busy, setBusy] = useState(false);

  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "";
  const money = (n: number) =>
    `${symbol}${n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.rate, 0),
    [items],
  );

  const updateItem = (id: number, patch: Partial<DraftItem>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: nextId, description: "", quantity: 1, rate: 0 },
    ]);
    setNextId((n) => n + 1);
  };

  const download = async () => {
    setBusy(true);
    try {
      // Same renderer the signed-in app uses, loaded only on demand.
      const [{ pdf }, { InvoicePDFDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("../invoices/InvoicePDFDocument"),
      ]);
      const today = new Date().toISOString().slice(0, 10);
      const due = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);
      const invoice: Invoice = {
        id: "preview",
        user_id: "preview",
        client_id: "preview",
        invoice_number: "LEKK-003",
        issue_date: today,
        due_date: due,
        status: "draft",
        notes: null,
        created_at: today,
        currency,
        line_items: items.map(({ description, quantity, rate }) => ({
          description: description || "Untitled item",
          quantity,
          rate,
        })),
        clients: { id: "preview", client_name: client || "Client" },
      };
      const sender: Profile = {
        first_name: "Adaeze",
        last_name: "Okonkwo",
        email: "adaeze@okonkwo.studio",
        business_name: "Okonkwo Studio",
        city: "Lagos",
        country: "Nigeria",
        bank_name: null,
        account_number: null,
        account_name: null,
      };
      const blob = await pdf(
        <InvoicePDFDocument invoice={invoice} sender={sender} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "LEKK-003.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-[0_1px_0_0_rgb(255_255_255/0.03)_inset]">
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5">
        <span className="font-mono text-xs text-fg-muted">New invoice</span>
        <span className="text-xs text-fg-subtle">Edit anything, totals update live</span>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Editor */}
        <div className="p-4 sm:p-5 space-y-5 lg:border-r border-line">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label htmlFor="pv-client" className="block text-xs font-medium text-fg-muted mb-1.5">
                Bill to
              </label>
              <input
                id="pv-client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className={inputBase}
              />
            </div>
            <div>
              <span className="block text-xs font-medium text-fg-muted mb-1.5">Currency</span>
              <div role="radiogroup" aria-label="Currency" className="flex rounded-md border border-line-strong p-0.5 bg-canvas">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    role="radio"
                    aria-checked={currency === c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`px-2 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                      currency === c.code
                        ? "bg-raised text-fg"
                        : "text-fg-subtle hover:text-fg"
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="hidden sm:grid grid-cols-[1fr_4rem_5.5rem_1.5rem] gap-2 text-xs font-medium text-fg-muted mb-1.5">
              <span>Item</span>
              <span>Qty</span>
              <span>Rate</span>
              <span />
            </div>
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-[1fr_4rem_5.5rem_1.5rem] gap-2 items-center animate-rise"
                >
                  <input
                    aria-label="Description"
                    value={item.description}
                    placeholder="Description"
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    className={inputBase}
                  />
                  <input
                    aria-label="Quantity"
                    type="number"
                    min={0}
                    step="any"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: Math.max(0, Number(e.target.value)) })}
                    className={`${inputBase} font-mono tabular-nums px-2`}
                  />
                  <input
                    aria-label="Rate"
                    type="number"
                    min={0}
                    step="any"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, { rate: Math.max(0, Number(e.target.value)) })}
                    className={`${inputBase} font-mono tabular-nums px-2`}
                  />
                  <button
                    aria-label="Remove item"
                    onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                    disabled={items.length === 1}
                    className="text-fg-subtle hover:text-danger disabled:opacity-30 disabled:hover:text-fg-subtle transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <FiX className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={addItem}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg transition-colors cursor-pointer"
            >
              <FiPlus className="size-3.5" /> Add line item
            </button>
          </div>
        </div>

        {/* Live paper */}
        <div className="p-4 sm:p-5 bg-canvas/60">
          <div className="rounded-md bg-paper text-paper-ink p-5 sm:p-6 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.6)]">
            <div className="flex justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-tight">Okonkwo Studio</p>
                <p className="text-xs text-paper-muted">Lagos, Nigeria</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tracking-tight">Invoice</p>
                <p className="font-mono text-xs text-paper-muted">LEKK-003</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-paper-rule">
              <p className="text-[11px] text-paper-muted">Billed to</p>
              <p className="text-sm font-medium truncate">{client || "Client name"}</p>
            </div>

            <table className="mt-5 w-full text-xs">
              <thead>
                <tr className="text-left text-paper-muted border-b border-paper-rule">
                  <th className="pb-1.5 font-medium">Item</th>
                  <th className="pb-1.5 font-medium text-right">Qty</th>
                  <th className="pb-1.5 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id} className="align-top">
                    <td className="py-1.5 pr-2 break-words max-w-[10rem]">
                      {i.description || <span className="text-paper-faint">Untitled item</span>}
                    </td>
                    <td className="py-1.5 text-right font-mono tabular-nums">{i.quantity}</td>
                    <td className="py-1.5 text-right font-mono tabular-nums">
                      {money(i.quantity * i.rate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3 pt-3 border-t border-paper-ink flex items-baseline justify-between">
              <span className="text-xs font-medium">Total due</span>
              <span className="font-mono tabular-nums text-lg font-semibold tracking-tight">
                {money(total)}
              </span>
            </div>
          </div>

          <button
            onClick={download}
            disabled={busy}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-md bg-fg text-canvas py-2.5 text-sm font-medium hover:opacity-90 active:scale-[0.99] transition disabled:opacity-60 cursor-pointer disabled:cursor-wait"
          >
            {busy ? <FiLoader className="size-4 animate-spin" /> : <FiDownload className="size-4" />}
            {busy ? "Building PDF" : "Download this as a PDF"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroPreview;
