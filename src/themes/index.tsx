import { ThemeProvider } from '@mui/material';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { createCustomTheme } from 'src/themes/custom-theme';

interface ThemeContextType {
  primaryColor: number;
  setPrimaryColor: (color: number) => void;
}

const myThemeCtx = createContext<ThemeContextType>({
  primaryColor: 0,
  setPrimaryColor: () => {}
});

export const useMyTheme = () => {
  const context = useContext(myThemeCtx);
  if (!context) {
    throw new Error('useMyTheme must be used within a MyThemeProvider');
  }
  return context;
};

interface MyThemeProviderProps {
  children: ReactNode;
}

export const MyThemeProvider = ({ children }: MyThemeProviderProps) => {
  const [primaryColor, setPrimaryColor] = useState(0);

  return (
    <myThemeCtx.Provider value={{ primaryColor, setPrimaryColor }}>
      <ThemeProvider theme={createCustomTheme(primaryColor)}>{children}</ThemeProvider>
    </myThemeCtx.Provider>
  );
};
