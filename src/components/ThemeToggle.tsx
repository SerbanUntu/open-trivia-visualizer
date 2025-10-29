import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/use-theme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full hover:bg-foreground/10 p-2 cursor-pointer transition-all duration-200"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}
