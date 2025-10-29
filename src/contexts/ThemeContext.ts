import { createContext, type Dispatch } from "react";

/**
 * A context for the theme of the application (light or dark mode).
 *
 * @property theme - The current theme of the application.
 * @property setTheme - A function for setting the theme of the application.
 */
export const ThemeContext = createContext<{
  theme: "light" | "dark";
  setTheme: Dispatch<React.SetStateAction<"light" | "dark">>;
} | null>(null);
