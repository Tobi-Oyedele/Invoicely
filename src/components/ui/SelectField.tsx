import { useId, type ReactNode, type SelectHTMLAttributes } from "react";
import { FiAlertCircle, FiChevronDown } from "react-icons/fi";

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: string;
  error?: string | null;
  labelAside?: ReactNode;
  children: ReactNode;
}

/** Native select styled to match AuthField: label above, border-shift focus, inline error. */
export const SelectField = ({ label, error, labelAside, className = "", children, ...rest }: SelectFieldProps) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <select
          {...rest}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`block w-full appearance-none rounded-md border bg-surface py-2.5 pl-3 pr-9 text-sm text-fg transition-colors focus:outline-none disabled:opacity-50 cursor-pointer ${
            error ? "border-danger" : "border-line-strong hover:border-fg-subtle focus:border-fg-muted"
          } ${className}`}
        >
          {children}
        </select>
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" />
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 flex items-start gap-1.5 text-[13px] text-danger animate-rise">
          <FiAlertCircle className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
