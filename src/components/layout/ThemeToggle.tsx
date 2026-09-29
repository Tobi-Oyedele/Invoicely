import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../hooks/useTheme";

export const ThemeToggle = () => {
  const [theme, setTheme] = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md text-fg-muted hover:text-fg hover:bg-raised transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-fg-muted"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? <FiSun className="size-4" /> : <FiMoon className="size-4" />}
    </button>
  );
};
export default ThemeToggle;
