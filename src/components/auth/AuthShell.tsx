import type { ReactNode } from "react";
import { FiCheck } from "react-icons/fi";
import { Logo } from "../brand/Logo";
import { ThemeToggle } from "../layout/ThemeToggle";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const points = [
  "Free to use, no card required",
  "PDFs are built in your browser",
  "NGN, USD, EUR, GBP and CAD invoices",
];

/** Split-screen frame: form on the left, product context on the right (lg+). */
export const AuthShell = ({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) => (
  <div className="min-h-screen bg-canvas text-fg font-sans antialiased selection:bg-line-strong lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
    <div className="flex min-h-screen flex-col px-6 sm:px-10">
      <header className="flex h-14 items-center justify-between">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-sm animate-rise">
          <h1 className="text-2xl font-semibold tracking-[-0.03em]">{title}</h1>
          <p className="mt-1.5 text-sm text-fg-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 border-t border-line pt-5 text-sm text-fg-muted">
            {footer}
          </div>
        </div>
      </main>
    </div>

    <aside className="hidden lg:flex flex-col justify-end border-l border-line bg-surface p-14">
      <p className="max-w-md text-3xl font-semibold leading-[1.15] tracking-[-0.03em] text-fg">
        Bill the client, then get back to the work.
      </p>
      <ul className="mt-8 space-y-3">
        {points.map((p) => (
          <li key={p} className="flex items-center gap-3 text-sm text-fg-muted">
            <FiCheck className="size-4 text-fg-muted" />
            {p}
          </li>
        ))}
      </ul>
    </aside>
  </div>
);
