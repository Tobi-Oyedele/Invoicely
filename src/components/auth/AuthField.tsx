import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";

interface AuthFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id"
> {
  label: string;
  error?: string | null;
  labelAside?: ReactNode;
}

export const AuthField = ({
  label,
  error,
  labelAside,
  type,
  className = "",
  ...rest
}: AuthFieldProps) => {
  const id = useId();
  const errorId = `${id}-error`;
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <input
          {...rest}
          id={id}
          type={isPassword && revealed ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`block w-full rounded-md border bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-fg-subtle transition-[border-color,box-shadow] duration-150 focus:outline-none disabled:opacity-50 ${
            isPassword ? "pr-10" : ""
          } ${
            error
              ? "border-danger"
              : "border-line-strong hover:border-fg-subtle focus:border-fg-muted"
          } ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-fg-subtle hover:text-fg transition-colors cursor-pointer"
          >
            {revealed ? (
              <FiEyeOff className="size-4" />
            ) : (
              <FiEye className="size-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-[13px] text-danger animate-rise"
        >
          <FiAlertCircle className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
