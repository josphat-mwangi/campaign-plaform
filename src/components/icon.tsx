import { Icon as Base } from "@iconify/react";
import { useTheme } from "@mui/material";

export default function Icon({ icon, ...rest }) {
  const theme = useTheme();

  let color;
  switch (rest?.color) {
    case "primary":
    case "secondary":
    case "success":
    case "error":
    case "warning":
      color = theme.palette[rest.color].main;
      break;
    default:
      color = rest.color || "inherit";
      break;
  }

  return <Base icon={icon} {...rest} color={color} />;
}
