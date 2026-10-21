import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { LogoMark } from "./components/brand/LogoMark";

// Temporary migration entry point. Do not mount routes or authentication.
// Restore the application entry point when the final migration is complete.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="flex min-h-dvh items-center justify-center bg-canvas px-6 py-16 text-fg">
      <div className="w-full max-w-lg">
        <div className="mb-12 flex items-center gap-2.5">
          <LogoMark size={28} />
          <span className="text-[17px] font-semibold tracking-tight">Invoicely</span>
        </div>
        <p className="mb-3 text-sm font-medium text-fg-muted">Scheduled maintenance</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          We’re upgrading Invoicely.
        </h1>
        <p className="mt-5 text-base leading-7 text-fg-muted">
          Invoicely is temporarily unavailable while we complete an upgrade.
          Sign-in and access to your invoices will return when maintenance is complete.
        </p>
        <p className="mt-8 border-t border-line pt-6 text-sm text-fg-muted">
          Please check back soon. Thank you for your patience.
        </p>
      </div>
    </main>
  </StrictMode>,
);
