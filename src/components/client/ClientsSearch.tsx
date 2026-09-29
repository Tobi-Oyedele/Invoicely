import { FiSearch, FiX } from "react-icons/fi";

interface ClientsSearchProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  total: number;
  matching: number;
}

export const ClientsSearch = ({
  searchQuery,
  setSearchQuery,
  total,
  matching,
}: ClientsSearchProps) => {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="relative flex w-full max-w-sm items-center">
        <FiSearch className="pointer-events-none absolute left-3 size-4 text-fg-subtle" />
        <input
          type="search"
          aria-label="Search clients"
          placeholder="Search by name, email, phone or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-md border border-line-strong bg-surface py-2.5 pl-9 pr-9 text-sm text-fg placeholder:text-fg-subtle transition-colors hover:border-fg-subtle focus:border-fg-muted focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
            className="absolute right-1.5 flex size-7 items-center justify-center rounded text-fg-subtle hover:text-fg transition-colors cursor-pointer"
          >
            <FiX className="size-3.5" />
          </button>
        )}
      </div>
      <p className="hidden shrink-0 text-sm text-fg-subtle tabular-nums sm:block" aria-live="polite">
        {searchQuery.trim()
          ? `${matching} of ${total}`
          : `${total} ${total === 1 ? "client" : "clients"}`}
      </p>
    </div>
  );
};
