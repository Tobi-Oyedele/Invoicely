export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export const STATUSES: InvoiceStatus[] = ["draft", "sent", "paid"];

// Paid is the only status that earns the accent; sent is ink, draft is faint.
export const STATUS_STYLES: Record<InvoiceStatus, { text: string; dot: string }> = {
  overdue: { text: "text-danger", dot: "bg-danger" },
  paid: { text: "text-accent", dot: "bg-accent" },
  sent: { text: "text-fg", dot: "bg-fg-muted" },
  draft: { text: "text-fg-subtle", dot: "border border-fg-subtle" },
};
