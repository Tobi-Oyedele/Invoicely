# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Freelancers and independent contractors anywhere in the world. Some are very small business owners too. They bill clients for work they've finished and need a correct, professional invoice fast, usually in the gap between doing the work and getting paid. They often bill clients in more than one currency.

## Product Purpose

Invoicely (invoicely.online) lets a freelancer save a client once, write an itemized invoice, track whether it has been sent or paid, and download a PDF they can send the same day. Success means an invoice goes from blank to downloaded PDF with no setup friction, no fighting with templates, and totals the user trusts without checking them again.

## Positioning

Free and deliberately minimal. Invoicely does invoices and the clients you send them to. It has no project boards, no time tracking, and no upsell tiers. The PDF is rendered in the browser, so nothing is uploaded to generate it.

## Operating Context

- Account flow: sign up, then sign in, with password reset (Supabase Auth).
- Profile: personal info, business details, and payout/bank credentials. Payment details print on every invoice, and onboarding checks that they're complete.
- Clients: create, edit, delete, and search a saved client directory (table on desktop, cards on mobile).
- Invoices: list with search by invoice number or client, clickable status badges (`draft`, `sent`, `paid`), subtotals grouped by currency, and new, view, and edit pages.
- Output: a vector PDF generated client-side with `@react-pdf/renderer` and sent by the user through their own channels.

## Capabilities and Constraints

- Stack: React 19, TypeScript, Vite, Tailwind CSS 4, Supabase (auth + Postgres, `supabase/schema.sql`), `@react-pdf/renderer`, React Icons. Deployed on Vercel.
- Currencies: NGN, USD, EUR, GBP, CAD (`src/lib/currency.ts`). Each user picks one currency in Profile (`profiles.default_currency`, default NGN). Every new invoice is issued in it and keeps it afterwards; there is no per-invoice or per-line-item currency choice.
- Invoices get a per-client reference (first four letters of the client name + that client's count, e.g. `ACME-003`, via `src/lib/invoiceNumber.ts`), so a client never sees how many invoices the freelancer has issued overall. Older invoices keep their original `INV-###` numbers. Invoices also have an optional due date and line items (quantity × rate) with live totals.
- Dark theme is the default; light is opt-in via a toggle.
- The Settings route was removed. Profile holds account and business configuration.
- Terminology: "invoice", "client", "line item", "draft / sent / paid", "payment details".

## Brand Commitments

- Name: **Invoicely**. Domain: invoicely.online.
- Voice (from current copy): plain, direct, and concrete. It says what the product does in short declarative sentences ("Write the invoice. Download the PDF.") and avoids hype.
- Logo component: `src/components/brand/Logo.tsx`.

## Evidence on Hand

- Real product functionality and screenshots (`public/screenshots/`).
- **None yet:** no testimonials, customer logos, user counts, usage metrics, or press. Future work must not invent any of these.

## Product Principles

1. **Only what an invoice needs.** Any new capability has to serve getting an invoice written, sent, or paid. Scope creep toward project management or time tracking is out.
2. **Free means free.** No upsell tiers, paywalled features, or pressure toward upgrades.
3. **Trustworthy numbers.** Totals, currencies, and payment details must always be correct and visibly clear. A wrong amount costs the user money.
4. **Fast to a sendable PDF.** Cut the steps between opening the app and holding a professional document.
5. **Global by default.** Don't assume one country's conventions for currency, formatting, or banking beyond what the user configures.
