import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

/**
 * A hook for accessing and changing the theme of the application.
 *
 * @returns The context data for the theme (getter and setter for theme).
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
