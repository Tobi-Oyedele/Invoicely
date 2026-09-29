interface LogoMarkProps {
  size?: number;
  className?: string;
}

/**
 * The "settled i": a lowercase i standing on a double rule, the accountant's
 * mark for a final total. Ink follows `currentColor` and the cut-outs use the
 * canvas colour, so the mark inverts with the theme. Keep in sync with
 * public/favicon.svg and public/apple-touch-icon.png.
 */
export const LogoMark = ({ size = 28, className = "" }: LogoMarkProps) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    aria-hidden="true"
    className={`shrink-0 ${className}`}
  >
    <rect width="32" height="32" rx="7" fill="currentColor" />
    <circle cx="16" cy="8.5" r="2.4" fill="var(--canvas)" />
    <rect x="14.25" y="12" width="3.5" height="8" rx="0.6" fill="var(--canvas)" />
    <rect x="9" y="22.5" width="14" height="2" rx="0.4" fill="var(--canvas)" />
    <rect x="9" y="25.75" width="14" height="1.25" rx="0.4" fill="var(--canvas)" />
  </svg>
);

export default LogoMark;
