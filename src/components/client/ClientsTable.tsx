import { FiMoreHorizontal } from "react-icons/fi";
import type { Client } from "./types";

interface ClientsTableProps {
  filteredClients: Client[];
  activeMenuId: string | null;
  handleMenuToggle: (e: React.MouseEvent, clientId: string) => void;
}

const Empty = () => <span className="text-fg-subtle">—</span>;

const contactLink =
  "rounded-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-muted";

export const ClientsTable = ({
  filteredClients,
  activeMenuId,
  handleMenuToggle,
}: ClientsTableProps) => {
  return (
    <div className="hidden md:block">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <thead>
          <tr className="border-y border-line text-xs text-fg-muted">
            <th scope="col" className="w-[24%] py-2.5 pr-4 font-medium">Name</th>
            <th scope="col" className="w-[26%] py-2.5 pr-4 font-medium">Email</th>
            <th scope="col" className="w-[16%] py-2.5 pr-4 font-medium">Phone</th>
            <th scope="col" className="py-2.5 pr-4 font-medium">Billing address</th>
            <th scope="col" className="w-10 py-2.5">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line border-b border-line">
          {filteredClients.map((client) => (
            <tr key={client.id} className="transition-colors hover:bg-surface">
              <td className="truncate py-3.5 pr-4 font-medium text-fg" title={client.client_name}>
                {client.client_name}
              </td>
              <td className="truncate py-3.5 pr-4">
                {client.email ? (
                  <a href={`mailto:${client.email}`} className={contactLink} title={client.email}>
                    {client.email}
                  </a>
                ) : (
                  <Empty />
                )}
              </td>
              <td className="truncate py-3.5 pr-4 tabular-nums">
                {client.phone_number ? (
                  <a href={`tel:${client.phone_number}`} className={contactLink}>
                    {client.phone_number}
                  </a>
                ) : (
                  <Empty />
                )}
              </td>
              <td className="truncate py-3.5 pr-4 text-fg-muted" title={client.address || undefined}>
                {client.address || <Empty />}
              </td>
              <td className="py-2 text-right">
                <button
                  type="button"
                  onClick={(e) => handleMenuToggle(e, client.id)}
                  aria-haspopup="menu"
                  aria-expanded={activeMenuId === client.id}
                  aria-label={`Actions for ${client.client_name}`}
                  className="flex size-8 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-raised hover:text-fg focus-visible:outline-2 focus-visible:outline-fg-muted cursor-pointer"
                >
                  <FiMoreHorizontal className="size-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
