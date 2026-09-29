import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  /** Right-aligned beside the heading, e.g. an "Optional" marker or a link. */
  aside?: ReactNode;
  children: ReactNode;
}

/** A titled group of form fields, heading above the fields with a hairline under it. */
export const FormSection = ({ title, aside, children }: FormSectionProps) => (
  <section>
    <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-line pb-2">
      <h2 className="font-medium text-fg">{title}</h2>
      {aside}
    </div>
    <div className="space-y-5">{children}</div>
  </section>
);

export const Optional = () => <span className="text-xs text-fg-subtle">Optional</span>;
