import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface Client {
  id: string;
  client_name: string;
  email?: string | null;
  phone_number?: string | null;
  address?: string | null;
}

export interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string;
  business_name: string | null;
  city: string | null;
  country: string | null;
  bank_name: string | null;
  account_number: string | null;
  account_name: string | null;
  account_type?: string | null;
  routing_number?: string | null;
  swift_code?: string | null;
  bank_address?: string | null;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: "draft" | "sent" | "paid";
  notes: string | null;
  created_at: string;
  line_items: LineItem[];
  clients: Client | null;
  currency?: string | null;
}

// React-PDF Styling Definition
const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    color: "#1c1917", // zinc-900
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7", // zinc-200
    paddingBottom: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#09090b", // zinc-950
  },
  invoiceMeta: {
    textAlign: "right",
  },
  invoiceNum: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#18181b",
    marginBottom: 4,
  },
  metaText: {
    fontSize: 9,
    color: "#71717a", // zinc-500
    marginTop: 2,
  },
  parties: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  partyColumn: {
    width: "45%",
  },
  label: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#a1a1aa", // zinc-400
    marginBottom: 6,
    letterSpacing: 0.8,
  },
  partyName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#09090b",
    marginBottom: 4,
  },
  partyInfo: {
    fontSize: 9,
    color: "#3f3f46", // zinc-700
    lineHeight: 1.4,
  },
  table: {
    marginTop: 10,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f4f4f5", // zinc-100
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    padding: 6,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    padding: 8,
  },
  colDesc: { width: "50%" },
  colQty: { width: "15%", textAlign: "center" },
  colRate: { width: "15%", textAlign: "right" },
  colAmt: { width: "20%", textAlign: "right" },
  headerColText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#52525b",
  },
  rowColText: {
    fontSize: 9,
    color: "#18181b",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  summaryBlock: {
    width: "40%",
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 9,
    color: "#71717a",
  },
  summaryValue: {
    fontSize: 9,
    color: "#18181b",
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#18181b",
    paddingTop: 8,
    marginTop: 4,
    fontWeight: "bold",
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#09090b",
  },
  totalValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#09090b",
  },
  payoutInfo: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
    paddingTop: 15,
  },
  payoutTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#52525b",
    marginBottom: 4,
  },
  notesInfo: {
    marginTop: 20,
  },
});

interface InvoicePDFDocumentProps {
  invoice: Invoice;
  sender: Profile;
}

export const InvoicePDFDocument = ({ invoice, sender }: InvoicePDFDocumentProps) => {
  const lineItems = invoice.line_items || [];
  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity || 0) * (item.rate || 0), 0);

  const formatPDFCurrency = (amount: number) => {
    return `${invoice.currency || "NGN"} ${amount.toFixed(2)}`;
  };

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Header Block */}
        <View style={pdfStyles.header}>
          <View>
            <Text style={pdfStyles.title}>
              {sender.business_name || `${sender.first_name || ""} ${sender.last_name || ""}`.trim() || "INVOICE"}
            </Text>
            {sender.business_name && (sender.first_name || sender.last_name) && (
              <Text style={pdfStyles.metaText}>{`${sender.first_name || ""} ${sender.last_name || ""}`.trim()}</Text>
            )}
          </View>
          <View style={pdfStyles.invoiceMeta}>
            <Text style={pdfStyles.invoiceNum}>{invoice.invoice_number}</Text>
          </View>
        </View>

        {/* Sender & Client billing parties info */}
        <View style={pdfStyles.parties}>
          <View style={pdfStyles.partyColumn}>
            <Text style={pdfStyles.label}>From</Text>
            <Text style={pdfStyles.partyName}>
              {sender.business_name || `${sender.first_name || ""} ${sender.last_name || ""}`.trim()}
            </Text>
            <Text style={pdfStyles.partyInfo}>{sender.email}</Text>
            {(sender.city || sender.country) && (
              <Text style={pdfStyles.partyInfo}>
                {[sender.city, sender.country].filter(Boolean).join(", ")}
              </Text>
            )}
          </View>

          <View style={pdfStyles.partyColumn}>
            <Text style={pdfStyles.label}>Billing To</Text>
            {invoice.clients ? (
              <>
                <Text style={pdfStyles.partyName}>{invoice.clients.client_name}</Text>
                {invoice.clients.email && <Text style={pdfStyles.partyInfo}>{invoice.clients.email}</Text>}
                {invoice.clients.phone_number && <Text style={pdfStyles.partyInfo}>{invoice.clients.phone_number}</Text>}
                {invoice.clients.address && <Text style={pdfStyles.partyInfo}>{invoice.clients.address}</Text>}
              </>
            ) : (
              <Text style={pdfStyles.partyInfo}>Anonymous Client</Text>
            )}
          </View>
        </View>

        {/* Invoice Dates info block */}
        <View style={{ flexDirection: "row", marginBottom: 25 }}>
          <View style={{ marginRight: 40 }}>
            <Text style={pdfStyles.label}>Issue Date</Text>
            <Text style={pdfStyles.partyInfo}>{invoice.issue_date || "—"}</Text>
          </View>
          <View>
            <Text style={pdfStyles.label}>Due Date</Text>
            <Text style={pdfStyles.partyInfo}>{invoice.due_date || "—"}</Text>
          </View>
        </View>

        {/* Product Items Table */}
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeader}>
            <View style={pdfStyles.colDesc}>
              <Text style={pdfStyles.headerColText}>Description</Text>
            </View>
            <View style={pdfStyles.colQty}>
              <Text style={[pdfStyles.headerColText, { textAlign: "center" }]}>Qty</Text>
            </View>
            <View style={pdfStyles.colRate}>
              <Text style={[pdfStyles.headerColText, { textAlign: "right" }]}>Rate</Text>
            </View>
            <View style={pdfStyles.colAmt}>
              <Text style={[pdfStyles.headerColText, { textAlign: "right" }]}>Amount</Text>
            </View>
          </View>

          {lineItems.map((item, index) => (
            <View key={index} style={pdfStyles.tableRow}>
              <View style={pdfStyles.colDesc}>
                <Text style={pdfStyles.rowColText}>{item.description}</Text>
              </View>
              <View style={pdfStyles.colQty}>
                <Text style={[pdfStyles.rowColText, { textAlign: "center" }]}>{item.quantity}</Text>
              </View>
              <View style={pdfStyles.colRate}>
                <Text style={[pdfStyles.rowColText, { textAlign: "right" }]}>{formatPDFCurrency(item.rate)}</Text>
              </View>
              <View style={pdfStyles.colAmt}>
                <Text style={[pdfStyles.rowColText, { textAlign: "right" }]}>
                  {formatPDFCurrency((item.quantity || 0) * (item.rate || 0))}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary Block */}
        <View style={pdfStyles.summaryContainer}>
          <View style={pdfStyles.summaryBlock}>
            <View style={pdfStyles.summaryRow}>
              <Text style={pdfStyles.summaryLabel}>Subtotal</Text>
              <Text style={pdfStyles.summaryValue}>{formatPDFCurrency(subtotal)}</Text>
            </View>
            <View style={pdfStyles.totalRow}>
              <Text style={pdfStyles.totalLabel}>Total Due</Text>
              <Text style={pdfStyles.totalValue}>{formatPDFCurrency(subtotal)}</Text>
            </View>
          </View>
        </View>

        {/* Payout Bank info details */}
        {(sender.bank_name || sender.account_number) && (
          <View style={pdfStyles.payoutInfo}>
            <Text style={pdfStyles.payoutTitle}>Payment Instructions</Text>
            <Text style={pdfStyles.partyInfo}>
              Please settle via bank transfer to:
            </Text>
            <Text style={[pdfStyles.partyInfo, { marginTop: 2, lineHeight: 1.4 }]}>
              {[
                sender.bank_name && `Bank: ${sender.bank_name}`,
                sender.account_number && `Account: ${sender.account_number}`,
                sender.account_name && `Name: ${sender.account_name}`,
                sender.account_type && `Type: ${sender.account_type}`,
                sender.routing_number && `Routing: ${sender.routing_number}`,
                sender.swift_code && `SWIFT: ${sender.swift_code}`,
                sender.bank_address && `Bank Address: ${sender.bank_address}`,
              ]
                .filter(Boolean)
                .join("  •  ")}
            </Text>
          </View>
        )}

        {/* Notes Info */}
        {invoice.notes && (
          <View style={pdfStyles.notesInfo}>
            <Text style={pdfStyles.label}>Notes & Terms</Text>
            <Text style={pdfStyles.partyInfo}>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
