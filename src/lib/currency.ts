export interface CurrencyOption {
  code: string;
  symbol: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "NGN", symbol: "₦" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "CAD", symbol: "CA$" },
];

export const DEFAULT_CURRENCY = "NGN";
