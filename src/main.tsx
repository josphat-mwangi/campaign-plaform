import { createRoot } from "react-dom/client";
import "./index.css";
import { Routes } from "@generouted/react-router";
import { MyThemeProvider } from "./themes";
import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { ConfirmHost } from "ochom-react-components";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

const App = () => {
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <QueryClientProvider client={queryClient}>
          <MyThemeProvider>
            <CssBaseline />
            <Routes />
            <Toaster position="top-right" />
            <ConfirmHost />
          </MyThemeProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </div>
  );
};

const root = document.getElementById("root") as HTMLElement;
createRoot(root).render(<App />);
