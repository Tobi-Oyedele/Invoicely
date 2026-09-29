import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

interface FormAlertProps {
  kind: "error" | "success";
  message: string | null;
}

export const FormAlert = ({ kind, message }: FormAlertProps) => {
  if (!message) return null;
  const isError = kind === "error";
  const Icon = isError ? FiAlertCircle : FiCheckCircle;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`mb-5 flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-sm animate-rise ${
        isError
          ? "border-danger/40 bg-danger-bg text-danger"
          : "border-accent/40 bg-accent/10 text-accent"
      }`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
};
