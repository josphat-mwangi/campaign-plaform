import { useMediaQuery } from "@mui/material";

export default function useScreenSize() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return isMobile;
}
