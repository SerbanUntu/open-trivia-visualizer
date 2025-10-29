import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";

/**
 * A context provider for the theme of the application.
 *
 * @property children - The children that have access to the theme context.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const mediaQueryObj = window.matchMedia("(prefers-color-scheme: dark)");
  const browserPreference = mediaQueryObj.matches ? "dark" : "light";
  const [theme, setTheme] = useState<"light" | "dark">(browserPreference);

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
