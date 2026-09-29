import { FiPlus } from "react-icons/fi";

interface ClientsHeaderProps {
  onAddClick: () => void;
}

export const ClientsHeader = ({ onAddClick }: ClientsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-[-0.03em] text-fg">
          Clients
        </h1>
        <p className="mt-1.5 text-sm text-fg-muted">
          Save a client once, then pick them from a list on every new invoice.
        </p>
      </div>
      <button
        type="button"
        onClick={onAddClick}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-canvas transition hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-muted cursor-pointer w-full md:w-auto"
      >
        <FiPlus className="size-4 shrink-0" />
        Add client
      </button>
    </div>
  );
};
