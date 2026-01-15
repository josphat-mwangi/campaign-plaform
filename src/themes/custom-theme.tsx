import { createTheme } from '@mui/material';
import { blue, blueGrey, deepOrange, purple, teal } from '@mui/material/colors';

const primaryColors = [purple, teal, deepOrange, blue, blueGrey];

const createCustomTheme = (primaryColor: number) => {
  return createTheme({
    typography: {
      fontSize: 12,
      allVariants: {
        fontFamily: 'Poppins, sans-serif'
      }
    },
    colorSchemes: {
      light: {
        palette: {
          primary: primaryColors[primaryColor]
        }
      },
      dark: {
        palette: {
          primary: primaryColors[primaryColor]
        }
      }
    },
    components: {
      MuiButton: {
        defaultProps: {
          size: 'small'
        }
      },
      MuiTextField: {
        defaultProps: {
          size: 'small'
        }
      },
      MuiListItem: {
        defaultProps: {
          dense: true
        }
      },
      MuiFab: {
        defaultProps: {
          size: 'small'
        }
      }
    }
  });
};

export { createCustomTheme, primaryColors };
