/**
 * Invoice references are numbered per client, e.g. "ACME-003", so a client
 * only ever sees how many invoices they have had, never the freelancer's total.
 */

/** First four letters of the client's name, uppercased; accents are folded to plain letters. */
export const clientPrefix = (clientName: string): string => {
  const letters = clientName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
  // Names with fewer than two Latin letters (e.g. "3M", non-Latin scripts) fall back to a neutral prefix
  return letters.length >= 2 ? letters.slice(0, 4) : "CLNT";
};

/**
 * Next reference for this prefix. Counts every existing invoice with the same
 * prefix, so two clients that share one ("Acme Ltd", "Acme Studio") still get
 * unique numbers.
 */
export const nextInvoiceNumber = (clientName: string, existingNumbers: string[]): string => {
  const prefix = clientPrefix(clientName);
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  const highest = existingNumbers.reduce((max, number) => {
    const match = pattern.exec(number);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);
  return `${prefix}-${String(highest + 1).padStart(3, "0")}`;
};

/** Same prefix, next count: used when a save collides with a number taken meanwhile. */
export const bumpInvoiceNumber = (number: string): string => {
  const match = /^(.*?)(\d+)$/.exec(number);
  if (!match) return `${number}-2`;
  const [, head, digits] = match;
  return `${head}${String(parseInt(digits, 10) + 1).padStart(digits.length, "0")}`;
};
