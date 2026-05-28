import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface Client {
  id: string;
  user_id: string;
  client_name: string;
  email: string;
  phone_number: string;
  address: string;
  created_at: string;
}

interface ClientDropdownMenuProps {
  activeMenuId: string | null;
  menuPosition: { top: number; right: number } | null;
  clients: Client[];
  setActiveMenuId: (id: string | null) => void;
  setMenuPosition: (pos: { top: number; right: number } | null) => void;
  openEditModal: (client: Client) => void;
  openDeleteModal: (client: Client) => void;
}

export const ClientDropdownMenu = ({
  activeMenuId,
  menuPosition,
  clients,
  setActiveMenuId,
  setMenuPosition,
  openEditModal,
  openDeleteModal,
}: ClientDropdownMenuProps) => {
  if (!activeMenuId || !menuPosition) return null;

  const activeMenuClient = clients.find((c) => c.id === activeMenuId);
  if (!activeMenuClient) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-30"
        onClick={() => {
          setActiveMenuId(null);
          setMenuPosition(null);
        }}
      />
      <div
        style={{
          position: "fixed",
          top: `${menuPosition.top + 4}px`,
          right: `${menuPosition.right}px`,
        }}
        className="w-36 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg py-1.5 z-40 animate-fade-in"
      >
        <button
          onClick={() => openEditModal(activeMenuClient)}
          className="w-full text-left px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FiEdit2 className="w-3.5 h-3.5 shrink-0 opacity-70" />
          <span>Edit details</span>
        </button>
        <button
          onClick={() => openDeleteModal(activeMenuClient)}
          className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-455 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FiTrash2 className="w-3.5 h-3.5 shrink-0 opacity-70" />
          <span>Delete client</span>
        </button>
      </div>
    </>
  );
};
