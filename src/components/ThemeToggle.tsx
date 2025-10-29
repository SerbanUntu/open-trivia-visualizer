import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/use-theme";

/**
 * A button for toggling the theme of the application between light and dark mode.
 * 
 * Shows a moon icon when in light mode, and a sun icon when in dark mode, indicating the theme to switch to.
 */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const label = `Switch to ${theme === "light" ? "dark" : "light"} mode`;

  return (
    <button
      aria-label={label}
      title={label}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full hover:bg-foreground/10 p-2 cursor-pointer transition-all duration-200"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}
