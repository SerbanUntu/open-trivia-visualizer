import { createContext, type Dispatch } from "react";

export const ThemeContext = createContext<{
  theme: "light" | "dark";
  setTheme: Dispatch<React.SetStateAction<"light" | "dark">>;
} | null>(null);
