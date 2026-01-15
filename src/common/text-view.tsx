import { Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";

const getColor = (color, theme) => {
  switch (color) {
    case "primary":
      return theme.palette.primary.main;
    case "secondary":
      return theme.palette.secondary.main;
    case "success":
      return theme.palette.success.main;
    case "error":
      return theme.palette.error.main;
    case "warning":
      return theme.palette.warning.main;
    case "info":
      return theme.palette.info.main;
    default:
      return color;
  }
};

type TextViewProps = {
  primary: string;
  secondary?: string;
  mainColor?: any;
  secondaryColor?: any;
  sx?: any;
};

export const TextView = ({
  primary,
  secondary,
  mainColor,
  secondaryColor,
  sx = {},
}: TextViewProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ ...sx }}>
      <Typography
        color={getColor(mainColor || "inherit", theme)}
        sx={{ fontSize: "inherit" }}
        component="div"
      >
        {primary}
      </Typography>
      <Typography
        variant="caption"
        color={getColor(secondaryColor || "GrayText", theme)}
        component="div"
      >
        {secondary}
      </Typography>
    </Box>
  );
};

export const TextView2 = ({
  primary,
  secondary,
  mainColor,
  secondaryColor,
  sx = {},
}: TextViewProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ ...sx }}>
      <Typography
        variant="caption"
        color={getColor(secondaryColor || "GrayText", theme)}
        component="div"
      >
        {primary}
      </Typography>
      <Typography
        color={getColor(mainColor || "inherit", theme)}
        sx={{ fontSize: "inherit" }}
        component="div"
      >
        {secondary}
      </Typography>
    </Box>
  );
};
