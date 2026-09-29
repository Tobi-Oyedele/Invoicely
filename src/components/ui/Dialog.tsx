import { useEffect, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** False while a request is in flight: Escape and the scrim stop closing it. */
  dismissible?: boolean;
  role?: "dialog" | "alertdialog";
  labelledBy: string;
  describedBy?: string;
  className?: string;
  children: ReactNode;
}

/** Centered modal on a plain scrim, raised surface, floating-layer shadow. */
export const Dialog = ({
  open,
  onClose,
  dismissible = true,
  role = "dialog",
  labelledBy,
  describedBy,
  className = "max-w-sm",
  children,
}: DialogProps) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60"
        onClick={() => {
          if (dismissible) onClose();
        }}
      />
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={`relative z-10 w-full rounded-xl border border-line bg-raised shadow-[0_12px_32px_-12px_rgb(0_0_0/0.35)] animate-rise ${className}`}
      >
        {children}
      </div>
    </div>
  );
};
