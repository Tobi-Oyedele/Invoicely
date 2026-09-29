import type { ReactNode } from "react";
import { FiFileText, FiUsers, FiUser } from "react-icons/fi";

export interface NavItem {
  name: string;
  to: string;
  icon: ReactNode;
}

export const navItems: NavItem[] = [
  {
    name: "Invoices",
    to: "/invoices",
    icon: <FiFileText className="size-4 shrink-0" />,
  },
  {
    name: "Clients",
    to: "/clients",
    icon: <FiUsers className="size-4 shrink-0" />,
  },
  {
    name: "Profile",
    to: "/profile",
    icon: <FiUser className="size-4 shrink-0" />,
  },
];
