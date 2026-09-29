import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { Client } from "./types";

interface ClientDropdownMenuProps {
  activeMenuId: string | null;
  menuPosition: { top: number; right: number } | null;
  clients: Client[];
  onClose: () => void;
  openEditModal: (client: Client) => void;
  openDeleteModal: (client: Client) => void;
}

const menuItemClass =
  "w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-fg-muted hover:text-fg hover:bg-surface focus-visible:bg-surface focus-visible:text-fg focus-visible:outline-none transition-colors cursor-pointer";

export const ClientDropdownMenu = ({
  activeMenuId,
  menuPosition,
  clients,
  onClose,
  openEditModal,
  openDeleteModal,
}: ClientDropdownMenuProps) => {
  if (!activeMenuId || !menuPosition) return null;

  const activeMenuClient = clients.find((c) => c.id === activeMenuId);
  if (!activeMenuClient) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div
        role="menu"
        aria-label={`Actions for ${activeMenuClient.client_name}`}
        style={{ top: `${menuPosition.top + 4}px`, right: `${menuPosition.right}px` }}
        className="fixed z-40 w-40 rounded-md border border-line bg-raised py-1 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.35)] animate-rise"
      >
        <button
          role="menuitem"
          autoFocus
          onClick={() => openEditModal(activeMenuClient)}
          className={menuItemClass}
        >
          <FiEdit2 className="size-3.5 shrink-0" />
          Edit client
        </button>
        <div className="my-1 border-t border-line" />
        <button
          role="menuitem"
          onClick={() => openDeleteModal(activeMenuClient)}
          className={`${menuItemClass} text-danger! hover:bg-danger-bg! focus-visible:bg-danger-bg!`}
        >
          <FiTrash2 className="size-3.5 shrink-0" />
          Delete client
        </button>
      </div>
    </>
  );
};
