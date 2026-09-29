export type InvoiceStatus = "draft" | "sent" | "paid";

export const STATUSES: InvoiceStatus[] = ["draft", "sent", "paid"];

// Paid is the only status that earns the accent; sent is ink, draft is faint.
export const STATUS_STYLES: Record<InvoiceStatus, { text: string; dot: string }> = {
  paid: { text: "text-accent", dot: "bg-accent" },
  sent: { text: "text-fg", dot: "bg-fg-muted" },
  draft: { text: "text-fg-subtle", dot: "border border-fg-subtle" },
};
