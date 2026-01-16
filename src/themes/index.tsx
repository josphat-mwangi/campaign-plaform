import { ThemeProvider } from "@mui/material";
import { createContext, useContext, useState, type ReactNode } from "react";
import { createCustomTheme } from "src/themes/custom-theme";

const myThemeCtx = createContext({
  primaryColor: 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPrimaryColor: (_color: number) => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useMyTheme = () => {
  const context = useContext(myThemeCtx);
  if (!context) {
    throw new Error("useMyTheme must be used within a MyThemeProvider");
  }
  return context;
};

export const MyThemeProvider = ({ children }: { children: ReactNode }) => {
  const [primaryColor, setPrimaryColor] = useState(2);

  return (
    <myThemeCtx.Provider value={{ primaryColor, setPrimaryColor }}>
      <ThemeProvider theme={createCustomTheme(primaryColor)}>
        {children}
      </ThemeProvider>
    </myThemeCtx.Provider>
  );
};
