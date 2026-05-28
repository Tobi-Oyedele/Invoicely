import { FiSearch, FiX } from "react-icons/fi";

interface ClientsSearchProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export const ClientsSearch = ({
  searchQuery,
  setSearchQuery,
}: ClientsSearchProps) => {
  return (
    <div className="mb-6 max-w-md">
      <div className="relative flex items-center">
        <FiSearch className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          placeholder="Search clients by name, email, address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 p-0.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 rounded-full transition-colors cursor-pointer"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
