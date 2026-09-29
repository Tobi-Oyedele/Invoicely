import { FiMail, FiPhone, FiMapPin, FiMoreHorizontal } from "react-icons/fi";
import type { Client } from "./types";

interface ClientsCardsProps {
  filteredClients: Client[];
  activeMenuId: string | null;
  handleMenuToggle: (e: React.MouseEvent, clientId: string) => void;
}

export const ClientsCards = ({
  filteredClients,
  activeMenuId,
  handleMenuToggle,
}: ClientsCardsProps) => {
  return (
    <ul className="md:hidden border-y border-line divide-y divide-line">
      {filteredClients.map((client) => (
        <li key={client.id} className="py-4">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 wrap-break-word pt-1 font-medium text-fg">
              {client.client_name}
            </p>
            <button
              type="button"
              onClick={(e) => handleMenuToggle(e, client.id)}
              aria-haspopup="menu"
              aria-expanded={activeMenuId === client.id}
              aria-label={`Actions for ${client.client_name}`}
              className="-mr-1.5 flex size-8 shrink-0 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-raised hover:text-fg focus-visible:outline-2 focus-visible:outline-fg-muted cursor-pointer"
            >
              <FiMoreHorizontal className="size-4" />
            </button>
          </div>

          {(client.email || client.phone_number || client.address) && (
            <ul className="mt-2 space-y-1.5 text-sm text-fg-muted">
              {client.email && (
                <li className="flex items-center gap-2 min-w-0">
                  <FiMail className="size-3.5 shrink-0 text-fg-subtle" />
                  <a
                    href={`mailto:${client.email}`}
                    className="truncate underline-offset-4 hover:text-fg hover:underline"
                  >
                    {client.email}
                  </a>
                </li>
              )}
              {client.phone_number && (
                <li className="flex items-center gap-2">
                  <FiPhone className="size-3.5 shrink-0 text-fg-subtle" />
                  <a
                    href={`tel:${client.phone_number}`}
                    className="tabular-nums underline-offset-4 hover:text-fg hover:underline"
                  >
                    {client.phone_number}
                  </a>
                </li>
              )}
              {client.address && (
                <li className="flex items-start gap-2">
                  <FiMapPin className="mt-1 size-3.5 shrink-0 text-fg-subtle" />
                  <span className="leading-relaxed wrap-break-word">
                    {client.address}
                  </span>
                </li>
              )}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};
