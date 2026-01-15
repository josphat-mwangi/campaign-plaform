import { createTheme } from "@mui/material";
import { blue, blueGrey, deepOrange, purple, teal } from "@mui/material/colors";

const primaryColors = [purple, teal, deepOrange, blue, blueGrey];

const createCustomTheme = (primaryColor: number) => {
  return createTheme({
    typography: {
      fontSize: 12,
      allVariants: {
        fontFamily: "Poppins, sans-serif",
      },
    },
    palette: {
      mode: "light",
      primary: primaryColors[primaryColor],
      background: {
        default: "#f5f5f5",
        paper: "#ffffff",
      },
      text: {
        primary: "#333333",
        secondary: "#666666",
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          size: "small",
        },
      },
      MuiTextField: {
        defaultProps: {
          size: "small",
        },
      },
      MuiListItem: {
        defaultProps: {
          dense: true,
        },
      },
      MuiFab: {
        defaultProps: {
          size: "small",
        },
      },
    },
  });
};

export { createCustomTheme, primaryColors };
