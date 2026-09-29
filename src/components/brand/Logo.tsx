import { Link } from "react-router-dom";
import { LogoMark } from "./LogoMark";

interface LogoProps {
  onClick?: () => void;
  size?: "sm" | "md";
  to?: string;
}

export const Logo = ({ onClick, size = "md", to = "/" }: LogoProps) => (
  <Link
    to={to}
    onClick={onClick}
    className="group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg-muted"
  >
    <LogoMark size={size === "sm" ? 24 : 28} className="text-fg" />
    <span className="text-[17px] font-semibold tracking-tight text-fg">
      Invoicely
    </span>
  </Link>
);

export default Logo;
