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

interface ClientsTableProps {
  filteredClients: Client[];
  handleMenuToggle: (e: React.MouseEvent, clientId: string) => void;
}

export const ClientsTable = ({
  filteredClients,
  handleMenuToggle,
}: ClientsTableProps) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 select-none">
            <th className="px-6 py-4.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-4.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Address
            </th>
            <th className="w-16 px-6 py-4.5"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {filteredClients.map((client) => (
            <tr
              key={client.id}
              className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors group"
            >
              <td className="px-6 py-4.5">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">
                    {client.client_name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4.5 text-sm text-zinc-500 dark:text-zinc-400">
                {client.email ? (
                  <a
                    href={`mailto:${client.email}`}
                    className="hover:underline hover:text-zinc-900 dark:hover:text-zinc-200 inline-flex items-center gap-1.5"
                  >
                    <FiMail className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    <span>{client.email}</span>
                  </a>
                ) : (
                  <span className="text-zinc-300 dark:text-zinc-700 italic select-none">No email</span>
                )}
              </td>
              <td className="px-6 py-4.5 text-sm text-zinc-500 dark:text-zinc-400">
                {client.phone_number ? (
                  <a
                    href={`tel:${client.phone_number}`}
                    className="hover:underline hover:text-zinc-900 dark:hover:text-zinc-200 inline-flex items-center gap-1.5"
                  >
                    <FiPhone className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    <span>{client.phone_number}</span>
                  </a>
                ) : (
                  <span className="text-zinc-300 dark:text-zinc-700 italic select-none">No phone</span>
                )}
              </td>
              <td className="px-6 py-4.5 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs truncate">
                {client.address ? (
                  <span className="inline-flex items-center gap-1.5">
                    <FiMapPin className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    <span>{client.address}</span>
                  </span>
                ) : (
                  <span className="text-zinc-300 dark:text-zinc-700 italic select-none">No address</span>
                )}
              </td>
              <td className="px-6 py-4.5 text-right relative">
                <button
                  onClick={(e) => handleMenuToggle(e, client.id)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors cursor-pointer"
                >
                  <FiMoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
