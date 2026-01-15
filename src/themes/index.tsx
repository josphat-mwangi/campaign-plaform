import { ThemeProvider } from "@mui/material";
import { createContext, useContext, useState } from "react";
import { createCustomTheme } from "src/themes/custom-theme";

const myThemeCtx = createContext({
  primaryColor: 0,
  setPrimaryColor: (_color: number) => {},
});

export const useMyTheme = () => {
  const context = useContext(myThemeCtx);
  if (!context) {
    throw new Error("useMyTheme must be used within a MyThemeProvider");
  }
  return context;
};

export const MyThemeProvider = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState(2);

  return (
    <myThemeCtx.Provider value={{ primaryColor, setPrimaryColor }}>
      <ThemeProvider theme={createCustomTheme(primaryColor)}>
        {children}
      </ThemeProvider>
    </myThemeCtx.Provider>
  );
};
