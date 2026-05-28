import { FiMail, FiPhone, FiMapPin, FiMoreVertical } from "react-icons/fi";

interface Client {
  id: string;
  user_id: string;
  client_name: string;
  email: string;
  phone_number: string;
  address: string;
  created_at: string;
}

interface ClientsCardsProps {
  filteredClients: Client[];
  handleMenuToggle: (e: React.MouseEvent, clientId: string) => void;
}

export const ClientsCards = ({
  filteredClients,
  handleMenuToggle,
}: ClientsCardsProps) => {
  return (
    <div className="block md:hidden divide-y divide-zinc-100 dark:divide-zinc-800">
      {filteredClients.map((client) => (
        <div key={client.id} className="p-5 flex flex-col gap-3 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">
                {client.client_name}
              </span>
            </div>

            <div>
              <button
                onClick={(e) => handleMenuToggle(e, client.id)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors cursor-pointer"
              >
                <FiMoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            {client.email && (
              <div className="flex items-center gap-2">
                <FiMail className="w-3.5 h-3.5 shrink-0 opacity-60" />
                <a href={`mailto:${client.email}`} className="hover:underline">
                  {client.email}
                </a>
              </div>
            )}
            {client.phone_number && (
              <div className="flex items-center gap-2">
                <FiPhone className="w-3.5 h-3.5 shrink-0 opacity-60" />
                <a href={`tel:${client.phone_number}`} className="hover:underline">
                  {client.phone_number}
                </a>
              </div>
            )}
            {client.address && (
              <div className="flex items-start gap-2">
                <FiMapPin className="w-3.5 h-3.5 shrink-0 opacity-60 mt-0.5" />
                <span className="leading-relaxed">{client.address}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
