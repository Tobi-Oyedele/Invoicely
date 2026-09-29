import type { ReactNode } from "react";
import { FiLoader } from "react-icons/fi";

interface SubmitButtonProps {
  loading: boolean;
  loadingLabel: string;
  children: ReactNode;
}

export const SubmitButton = ({ loading, loadingLabel, children }: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={loading}
    className="flex w-full items-center justify-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-canvas transition hover:opacity-90 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-muted disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
  >
    {loading && <FiLoader className="size-4 animate-spin" />}
    {loading ? loadingLabel : children}
  </button>
);
