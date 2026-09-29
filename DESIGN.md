---
name: Invoicely
description: Write the invoice. Download the PDF. A ruled, dark-first ledger for freelancers.
colors:
  canvas: "#f6f6f4"
  surface: "#fcfcfb"
  raised: "#ffffff"
  line: "#e4e4e0"
  line-strong: "#cfcfca"
  fg: "#1a1a1d"
  fg-muted: "#5c5c63"
  fg-subtle: "#85858c"
  accent: "#2f7d63"
  danger: "#b3312d"
  danger-bg: "#fbeceb"
  canvas-dark: "#0f0f11"
  surface-dark: "#151518"
  raised-dark: "#1b1b1f"
  line-dark: "#26262b"
  line-strong-dark: "#37373d"
  fg-dark: "#e8e8ea"
  fg-muted-dark: "#a0a0a8"
  fg-subtle-dark: "#6e6e76"
  accent-dark: "#6cbf9f"
  danger-dark: "#f0837f"
  danger-bg-dark: "#241514"
  paper: "#f3f3ef"
  paper-ink: "#1c1c1f"
  paper-muted: "#6b6b70"
  paper-faint: "#9a9aa0"
  paper-rule: "#dcdcd6"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  body-lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
  figure:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    fontFeature: "tnum"
rounded:
  xs: "4px"
  md: "6px"
  xl: "12px"
  full: "9999px"
spacing:
  gutter: "24px"
  field-x: "12px"
  field-y: "10px"
  stack-sm: "12px"
  stack-md: "20px"
  stack-lg: "32px"
  section: "80px"
  section-lg: "112px"
components:
  button-primary:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.canvas}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-compact:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "6px 14px"
  button-ghost:
    textColor: "{colors.fg-muted}"
    typography: "{typography.body}"
    padding: "10px 12px"
  button-ghost-hover:
    textColor: "{colors.fg}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  input-compact:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  segmented-option:
    textColor: "{colors.fg-subtle}"
    rounded: "{rounded.xs}"
    padding: "4px 8px"
  segmented-option-selected:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.fg}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
  dialog:
    backgroundColor: "{colors.raised}"
    rounded: "{rounded.xl}"
    padding: "24px"
  menu:
    backgroundColor: "{colors.raised}"
    rounded: "{rounded.md}"
    padding: "4px 0"
  status-marker:
    textColor: "{colors.fg}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  alert-error:
    backgroundColor: "{colors.danger-bg}"
    textColor: "{colors.danger}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  paper-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.md}"
    padding: "24px"
  logo-mark:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    size: "28px"
---

# Design System: Invoicely

## Overview

**Creative North Star: "The Ledger Sheet"**

Invoicely borrows its manners from an accountant's ruled paper. Every surface is organized by thin lines, not boxes. Every figure sits in a monospaced column so it can be checked at a glance. Nothing appears that the invoice doesn't need. The interface is a quiet charcoal desk (dark is the default theme), and the one warm, lit object on it is the invoice itself: an off-white sheet of paper with ink-dark type.

The system is deliberately low-chroma. Neutrals carry nearly all of the work. A single muted green, **Paid Green**, appears only where something is confirmed, positive, or settled. Hierarchy comes from weight, tight negative tracking on headings, and the rhythm of hairline rules. Size jumps and colour fills play no part. Density is moderate. It's comfortable enough for a first-time freelancer, and tight enough that a list of line items reads like a ledger rather than a form.

Depth is **subtly layered**. Surfaces step up tonally from canvas to surface to raised, and a soft ambient shadow may lift a panel or card off the canvas. The paper sheet always carries the deepest shadow in any view, because it is the object the user is making.

**Key Characteristics:**
- Dark-first, charcoal rather than black; off-white text rather than pure white.
- One accent (Paid Green), used sparingly and always meaning "good / done".
- Hairline dividers (1px `line`) structure lists, sections, and steps.
- Geist for words, Geist Mono with tabular numerals for every number, code, and ID.
- Ink-on-canvas primary buttons, inverted per theme, with no coloured CTAs.
- The invoice is rendered as physical paper, even in dark mode.

## Colors

A near-neutral, faintly warm grey palette in two themes, plus one muted green and one warning red. Tokens are semantic CSS custom properties in `src/index.css`: light values on `:root`, dark values on `.dark`. They are exposed to Tailwind as `bg-canvas`, `text-fg-muted`, `border-line`, and so on. Always use the semantic name. Never use the hex value or a raw Tailwind palette class.

### Primary
- **Paid Green** (`accent` / `accent-dark`): the only chromatic brand colour. It's used for positive confirmation (check marks in the auth aside, success alerts at 10% fill with a 40% border), feature icons, and anything meaning "paid" or "settled". It's never used for large fills or primary buttons.

### Neutral
- **Bone Canvas / Charcoal Canvas** (`canvas` / `canvas-dark`): the page background. Charcoal is never `#000`.
- **Surface** (`surface` / `surface-dark`): one step up, for panels, input fills, and the auth-page aside.
- **Raised** (`raised` / `raised-dark`): the top tonal step, for the selected segment in a segmented control, hover fills on icon buttons, and future menus and popovers.
- **Hairline** (`line` / `line-dark`): section dividers, list separators, and panel borders.
- **Strong Hairline** (`line-strong` / `line-strong-dark`): the resting border on inputs and icon wells; also the selection highlight.
- **Ink** (`fg` / `fg-dark`): primary text, primary-button fill, the logo mark, and the thick top rule on numbered steps.
- **Muted Ink** (`fg-muted` / `fg-muted-dark`): secondary text, field labels, ghost links, and input focus borders.
- **Faint Ink** (`fg-subtle` / `fg-subtle-dark`): placeholders, hints, captions, legal text, and the input hover border.

### Semantic
- **Warning Red** (`danger`, `danger-bg`, and their dark variants): errors only. It's used for field error borders and messages, the error alert (with a 40% `danger` border on `danger-bg`), and destructive hover on remove buttons.

### Paper (theme-independent)
- **Paper** (`paper`), **Paper Ink** (`paper-ink`), **Paper Muted** (`paper-muted`), **Paper Faint** (`paper-faint`), **Paper Rule** (`paper-rule`): the invoice document's own palette, available as Tailwind tokens (`bg-paper`, `text-paper-ink`, `border-paper-rule`). It stays the same in both themes, because an invoice is a printed artifact. It should match the colours used by `InvoicePDFDocument` so the preview and the PDF agree.

### Named Rules
**The Paid Green Rule.** Green means money is right or done. If an element isn't confirming, succeeding, or marking something as settled, it doesn't get the accent. Keep it to roughly one accent moment per viewport.

**The Semantic Token Rule.** Colour comes only from the semantic tokens. `zinc-*`, `red-*`, `bg-white`, and paired `dark:` classes are legacy and should not be used. Theming happens once, in `index.css`.

**The No Pure Extremes Rule.** No `#000` canvas and no `#fff` text in dark mode. The darkest value is `canvas-dark`; the lightest dark-mode text is `fg-dark`.

## Typography

**Display Font:** Geist (with ui-sans-serif, system-ui)
**Body Font:** Geist
**Label/Mono Font:** Geist Mono (with ui-monospace, SFMono-Regular), used for figures, codes, and IDs.

**Character:** Geist is a neutral, engineered grotesk. Set tight and semibold, it reads as competent rather than decorative. Geist Mono carries every number, so columns of money line up like a ledger.

### Hierarchy
- **Display** (600, 2.25rem mobile → 3.5rem md+, line-height 1.05, tracking -0.035em): the landing hero headline only. Short, declarative, one idea.
- **Headline** (600, 1.5rem → 1.875rem, tracking -0.03em): section headings and auth page titles (auth uses 1.5rem). The auth aside statement uses 1.875rem at line-height 1.15.
- **Title** (500, 1rem): list and step headings (feature names, step names).
- **Body Lead** (400, 1rem → 1.125rem, line-height 1.625, `fg-muted`): the hero sub-copy. Max width ~36rem.
- **Body** (400, 0.875rem, line-height 1.625): default UI and supporting text. Descriptions cap at ~32rem (`max-w-lg`).
- **Label** (500, 0.75rem–0.875rem): field labels (`text-sm` in forms, `text-xs` in compact editors), table headers, and panel captions. Sentence case, never uppercase.
- **Figure** (Geist Mono, `tabular-nums`): quantities, rates, amounts, totals, currency codes, and invoice numbers.

### Named Rules
**The Tabular Figures Rule.** Any number a user might add, compare, or check (quantity, rate, amount, total, invoice number, currency code) is set in Geist Mono with `tabular-nums`. Words are never set in mono.

**The Tight Heading Rule.** Headings are semibold (600) with negative tracking (-0.03em to -0.035em). Body text keeps default tracking. Bold (700) is not used for headings in the token system.

## Layout

- **Container (marketing):** `max-w-6xl` (72rem) centered, with a 24px (`px-6`) side gutter at every width.
- **App shell:** a fixed 256px (`w-64`) sidebar on the left from md up, on `canvas` with a hairline right border. Below md it becomes a slide-in drawer behind a sticky 56px top bar (logo left, menu button right). Page content sits in `max-w-7xl` for lists and `max-w-4xl` for forms, with 16px / 32px side padding (mobile / lg).
- **App page header:** a 1.5rem → 1.875rem semibold title with a one-line `fg-muted` subtitle, and the page's primary action on the right (full width below md). 32px below it before content.
- **Sections:** separated by a full-width top hairline (`border-t border-line`), with 80px vertical padding (112px at md+).
- **Navigation bar:** a fixed 56px (`h-14`) height, sticky, with 85%-opacity canvas and background blur.
- **Asymmetric splits:** two-column layouts use unequal fractions rather than 50/50. Features use 4fr : 7fr with a sticky heading column. The editor preview uses 5fr : 6fr. Auth is the one exception: an even split at lg+, and the right-hand aside is hidden below lg.
- **Stacks:** form fields sit 20px apart (`stack-md`). Headings sit 12–20px above their copy. Groups sit 32–48px apart.
- **Lists as ledgers:** repeated items are separated by `divide-y divide-line` inside a top and bottom `border-y`. They aren't placed in cards. On desktop they are tables; below md the same data becomes a stacked list.
- **Forms:** section headings sit above their fields, underlined by a hairline, with 32px between sections. Fields sit in 2- or 3-column grids from sm up, single column on mobile.
- **Responsive:** single column below md (768px). Multi-column grids appear at md, and heavy editors split at lg (1024px). The mobile menu takes over below md.

## Elevation & Depth

The system is subtly layered. The main depth cue is tonal: `canvas` → `surface` → `raised`, with a 1px hairline at every edge. Soft ambient shadows may reinforce that step on panels and cards, but they stay quiet: diffuse, low-opacity, never a hard drop. In dark mode, shadows barely read, so the tonal step and a faint inner top highlight do the work instead. The paper sheet always sits highest.

### Shadow Vocabulary
- **Panel highlight** (`box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.03)`): the top-edge sheen on dark panels such as the hero editor. Implemented.
- **Paper lift** (`box-shadow: 0 8px 24px -12px rgb(0 0 0 / 0.6)`): under the invoice paper sheet. It's the deepest shadow in the system. Implemented.
- **Ambient card** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 4px 16px -8px rgb(0 0 0 / 0.08)`): the optional lift for panels and cards on the canvas. *Provisional:* this was chosen as the direction but isn't used anywhere yet, so tune it on first use.
- **Floating layer** (`box-shadow: 0 12px 32px -12px rgb(0 0 0 / 0.35)`): row menus, the status menu, and dialogs, always on a `raised` background with a `line` border. Implemented.

### Named Rules
**The Paper Is Highest Rule.** No component may cast a heavier shadow than the invoice paper in the same view.

**The Ambient Only Rule.** Shadows are soft and diffuse (large blur, negative spread, ≤10% opacity on cards). No hard offsets, coloured shadows, or glows.

## Shapes

Corners are small and precise. Buttons, inputs, alerts, icon wells, the logo mark, and the paper sheet all use a 6px radius (`rounded-md`). Segments inside a segmented control use 4px. Only large composite panels (the hero editor frame) and dialogs reach 12px (`rounded-xl`). Pills (`rounded-full`) are reserved for small status markers. Borders are always 1px. The one heavier line is the full-ink top rule on numbered steps (`border-t border-fg`), a ledger's "total" line. The paper sheet uses the same device: a full-ink rule above "Total due".

**The Small Corners Rule.** Nothing interactive goes above 6px. `rounded-2xl` and larger belong to the legacy styling and are being retired.

## Components

Precise and restrained: ink fills, hairline strokes, muted links, and no ornament.

### Buttons
- **Shape:** gently squared (6px).
- **Primary:** ink fill on canvas-coloured text (`bg-fg text-canvas`), 14px medium, 10px × 16px padding (6px × 14px compact in the nav). It inverts with the theme: near-black on light, off-white on dark. It may carry a trailing arrow icon that nudges 2px right on hover.
- **Hover / Focus / Active:** hover drops to 90% opacity; active scales to 0.98–0.99. Focus is a 2px `fg-muted` outline at 2px offset. Disabled is 60% opacity with a not-allowed or wait cursor. Loading swaps in a spinning loader icon and a present-tense label ("Building PDF").
- **Ghost / Link:** `fg-muted` text with no fill, turning `fg` on hover. Used for secondary actions such as "Sign in" next to a primary button.
- **Icon button:** a 32px hit area with a `fg-subtle` or `fg-muted` icon. Hover turns the icon `fg` on a `raised` fill. Every icon button has an `aria-label` naming its action and target ("Actions for ACME-003").
- **Secondary (outline):** 1px `line-strong` border, `fg` text, no fill, surface fill on hover. Used for recovery actions such as "Try again".
- **Destructive:** `danger` fill with canvas-coloured text, used only as the confirm button inside a delete dialog. Its label names what goes ("Delete invoice", "Delete client").

### Inputs / Fields
- **Style:** `surface` fill (or `canvas` in compact editors), 1px `line-strong` border, 6px radius, 10px × 12px padding, 14px text, `fg-subtle` placeholder.
- **Hover / Focus:** the border moves to `fg-subtle` on hover and `fg-muted` on focus. There is no glow ring; the border shift is the focus.
- **Error:** the border turns `danger`, and a 13px `danger` message with an alert icon rises in below (`animate-rise`), linked through `aria-describedby`.
- **Label:** 14px medium `fg`, above the field. It may carry a right-aligned aside, such as a "Forgot password?" link or a 12px `fg-subtle` "Optional" marker. Optional fields are marked; required ones are not starred.
- **No helper text:** fields and form sections carry a label only. No descriptions under fields and no explanatory blurbs beside section headings.
- **Component:** `AuthField` (`src/components/auth/AuthField.tsx`) is the shared field for all forms, not only auth, with built-in label, error, and password reveal.
- **Numeric:** Geist Mono, tabular, with no spin buttons. Quantity and rate accept decimals (`step="any"`, `inputMode="decimal"`).
- **Read-only value:** a value the user can see but not change here (invoice reference, invoice currency) sits in a field-shaped box: `canvas` fill, 1px `line` border, `fg-muted` Geist Mono text, same 42px height as inputs. It is not a disabled input. Where it can be changed elsewhere, the section links there (e.g. "Edit profile").
- **Select:** `SelectField` (`src/components/ui/SelectField.tsx`) matches `AuthField`: native select, custom chevron, same border-shift focus and inline error.

### Segmented Control
- **Style:** a `canvas` track with a 1px `line-strong` border and 2px inner padding. Options are 12px Geist Mono. The selected option gets a `raised` fill and `fg` text; the rest are `fg-subtle`. Used for currency selection, with `role="radiogroup"`.

### Alerts
- **Error:** a `danger-bg` fill with a 40% `danger` border and `danger` text, 6px radius, and a leading icon.
- **Success:** a 10% Paid Green fill with a 40% accent border and accent text.
- Both enter with `animate-rise`.

### Status Marker
- **Style:** a small pill (`rounded-full`, 1px `line` border, 12px medium, lowercase value capitalized) with a 6px dot. **Paid** is Paid Green text and dot. **Sent** is ink text with a `fg-muted` dot. **Draft** is `fg-subtle` text with a hollow ring. No blue, amber, or other hues; status is carried by the dot and ink weight.
- **Interaction:** the marker is also the status control. It opens a small floating menu of the three states with the current one checked.

### Menus
- **Style:** a floating layer: `raised` fill, 1px `line` border, 6px radius, floating-layer shadow, 4px vertical padding, entering with `animate-rise`. Fixed to the viewport so tables can't clip it.
- **Items:** 14px `fg-muted` with a 14px leading icon, turning `fg` on a `surface` fill on hover and focus. A destructive item sits last, after a hairline, in `danger` with a `danger-bg` hover.
- **Behavior:** opened from a 32px `…` (horizontal) icon button. Escape, scroll, resize, or clicking outside closes it. The first item takes focus. Uses `role="menu"` / `menuitem` (`menuitemradio` for the status menu).

### Dialogs
- **Component:** `Dialog` (`src/components/ui/Dialog.tsx`). Plain `black/40` scrim (`black/60` in dark), no blur. A `raised` panel with a 1px `line` border, 12px radius, and the floating-layer shadow.
- **Behavior:** Escape and the scrim close it, except while a request is in flight. Confirmations use `role="alertdialog"` and put initial focus on Cancel.
- **Content:** a left-aligned 18px semibold title that names the object ("Delete ACME-003?"), one line of consequence in `fg-muted`, then right-aligned actions: a ghost Cancel and the confirm button. No icon tiles. When the action is blocked (a client that still has invoices), the title says so ("Acme Ltd can't be deleted yet"), the body says why and what to do first, and the only action is Close. Form dialogs split a header (title + close button) and a footer of actions from the body with hairlines.

### Data Lists
- **Desktop table:** full width, no outer card. The header row is 12px medium `fg-muted`, sentence case, between two hairlines. Rows are divided by hairlines, with 14px vertical cell padding and a `surface` fill on hover. Amounts are right-aligned.
- **Mobile list:** the same rows stacked: primary text and amount on the first line, secondary details and controls on the second.
- **Content:** missing values show a faint `—`, not grey italic placeholder text. Long text truncates with the full value in a `title`. Amounts read "1,240.00 USD": mono tabular figures with the currency code in `fg-subtle`, so a mixed-currency column still aligns.
- **Search:** a max-width 384px (`max-w-sm`) search field with a leading icon and a clear button, and a `fg-subtle` count on the right ("12 invoices", "3 of 12").

### Page States
- **Loading:** skeleton rows of `line`-coloured bars inside the same hairline structure the loaded content will have, pulsing only when motion is allowed.
- **Empty:** a left-aligned block under a full-ink top rule: a medium title ("No invoices yet"), one line of `fg-muted` copy, and the primary action. No big icon tiles.
- **Load error:** the same block, titled "We couldn't load …", with the error message and an outline "Try again" button. A failed load never falls through to the empty state or to an empty editable form.
- **No search results:** a centred line between hairlines quoting the query, with a "Clear search" link.

### Invoice References
- New invoices are numbered per client: the first four letters of the client's name plus that client's count, e.g. `ACME-003`, so a client never sees the freelancer's overall invoice count. Always set in Geist Mono. Older invoices keep their `INV-###` numbers.

### Currency
- One currency per user, chosen in Profile → Invoicing. Invoices show it as a read-only value; amounts render as figures plus the ISO code in `fg-subtle` ("1,240.00 CAD"), never a symbol alone.

### Save Bar
- A sticky bar at the bottom of long forms: hairline top border, 85% `canvas` with background blur. The primary "Save changes" button sits right, disabled until something changes. Status sits left: `fg-muted` "You have unsaved changes", Paid Green "Saved" (fades after 4s), or a `danger` error that stays until the next attempt.

### Cards / Panels
- **Corner Style:** 12px for large composite panels, 6px for small cards.
- **Background:** `surface` on `canvas`, with a 1px `line` border.
- **Shadow:** panel highlight in dark mode; ambient card is allowed (see Elevation).
- **Internal Padding:** 16–20px. A header strip is split off by a hairline, with a mono caption on the left and a `fg-subtle` hint on the right.

### Navigation
- **Top bar:** sticky, 56px, a hairline bottom border, and a translucent blurred canvas. The logo sits left; on the right are the theme toggle, a ghost "Sign in", and a compact primary "Get started". Below md, a menu icon opens a full-screen menu of 20px semibold links divided by hairlines.
- **Footer:** a hairline top border, then the small logo, muted text links, and 12px `fg-subtle` copyright.
- **App sidebar:** the logo (linking to `/invoices`) at the top, then nav links with 16px Feather icons: 14px `fg-muted`, turning `fg` on a `surface` hover. The current page gets a `raised` fill, a 1px `line` ring, and medium weight. At the bottom, below a hairline: the theme segmented control (Light / Dark) and a neutral "Sign out" row. Sign out is not red.

### Logo
- **Mark: the "settled i".** A lowercase *i* standing on a double rule, the accountant's mark for a final, settled total, cut out of a 7/32-radius ink square. One vector (`LogoMark`, `src/components/brand/LogoMark.tsx`, 32-unit grid): ink is `currentColor`, cut-outs are `var(--canvas)`, so it inverts with the theme like the primary button.
- **Lockup:** `Logo` = mark (28px, 24px small) + "Invoicely" wordmark at 17px semibold, tight tracking, 10px gap. Used in the marketing nav, footer, auth pages, app sidebar and mobile app bar.
- **Favicon:** `public/favicon.svg` is the same mark and switches ink/canvas with the browser's `prefers-color-scheme`. **Home-screen icon:** `public/apple-touch-icon.png` (180px, full-bleed ink square; the OS rounds the corners).
- **Don't** redraw the mark as text ("i."), add colour to it, or use a different icon anywhere a logo appears. Change `LogoMark` and regenerate the favicon files together.

### The Paper Sheet (signature)
- A live, theme-independent miniature of the invoice: a `paper` fill, `paper-ink` text, 6px radius, 24px padding, and the paper-lift shadow. It has a business name and invoice number header, a `paper-rule` divider, a "Billed to" block, and a line-item table with right-aligned mono amounts. A full-ink rule sits above "Total due", set in mono at 18px semibold. It should mirror the real PDF output.
- **Full invoice view:** the invoice detail page renders the whole invoice as paper (`ring-1 ring-black/5` plus paper lift, so it still reads on the light canvas). It follows the PDF's order and labels (From, Billing To, Issue Date, Due Date, Subtotal, Total Due, Payment Details, Notes & Terms). App controls (status, Edit, Download PDF) sit above it on the canvas, never on the paper.

### Numbered Steps
- A three-column ordered list. Each step has a full-ink top rule, a title, and muted body text, with no numerals or icons. The ink rule is the marker.

## Do's and Don'ts

### Do:
- **Do** use the semantic tokens (`bg-canvas`, `text-fg-muted`, `border-line`) for every colour, so both themes work from one class.
- **Do** set every quantity, rate, amount, total, currency code, and invoice number in Geist Mono with `tabular-nums`.
- **Do** structure lists and sections with 1px hairlines (`divide-line`, `border-t border-line`) before reaching for cards.
- **Do** keep the primary button ink-on-canvas (`bg-fg text-canvas`) at a 6px radius.
- **Do** reserve Paid Green for confirmation, success, and "paid".
- **Do** render the invoice preview as theme-independent paper that matches the PDF.
- **Do** respect `prefers-reduced-motion`. Motion is limited to a short 240ms rise-in (`cubic-bezier(0.2, 0.7, 0.2, 1)`) and 150–200ms colour transitions.
- **Do** reuse the shared pieces: `AuthField`, `FormAlert`, `Dialog`, `Logo`.
- **Do** give every async page a loading, empty, load-error (with retry), and no-results state.
- **Do** say plainly what a destructive action removes. When something blocks it (a client that still has invoices), say what and why instead of offering the delete.
- **Do** use the shared status pieces (`components/invoices/status.tsx`, `statusStyles.ts`) wherever an invoice status appears.

### Don't:
- **Don't** use raw Tailwind palette classes (`zinc-*`, `red-*`, `green-*`, `bg-white`) or paired `dark:` overrides. That's the legacy pattern being retired.
- **Don't** add helper text under fields or descriptions beside form section headings.
- **Don't** colour statuses with blue, amber, or other hues, or colour non-error actions (like Sign out) red.
- **Don't** use `alert()`, blurred scrims, or gradient notices. Errors go in `FormAlert` or inline next to the action.
- **Don't** use pure `#000` backgrounds or pure `#fff` text in dark mode.
- **Don't** use coloured or gradient primary buttons, or use the accent as a large fill.
- **Don't** go above 6px radius on buttons, inputs, or small cards, or use `rounded-2xl` anywhere.
- **Don't** add hard or coloured shadows, or let anything cast a heavier shadow than the paper sheet.
- **Don't** set headings in bold (700) or uppercase labels. Headings are 600 with tight tracking; labels are sentence case.
- **Don't** set prose in Geist Mono or numbers in proportional figures.
