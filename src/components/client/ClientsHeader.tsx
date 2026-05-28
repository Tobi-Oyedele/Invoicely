import { FiPlus } from "react-icons/fi";

interface ClientsHeaderProps {
  onAddClick: () => void;
}

export const ClientsHeader = ({ onAddClick }: ClientsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Clients
        </h1>
        <p className="mt-1 lg:mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your client directory, contact numbers, and billing addresses.
        </p>
      </div>
      <button
        onClick={onAddClick}
        className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 dark:text-zinc-950 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-xs hover:shadow-sm active:scale-[0.98] cursor-pointer shrink-0 w-full md:w-auto"
      >
        <FiPlus className="w-4 h-4" />
        <span>Add Client</span>
      </button>
    </div>
  );
};
