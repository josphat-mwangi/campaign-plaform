import Icon from "src/components/icon";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { SmoothBox } from "src/common/styled";

export default function StatCard({
  title,
  value,
  icon,
  color,
  opacity,
}: {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  opacity?: number;
}) {
  const theme = useTheme();

  return (
    <SmoothBox sx={{ p: 2, height: "100%", borderRadius: 1 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Icon
          icon={icon}
          color={color || theme.palette.secondary.light}
          fontSize={"3rem"}
          style={{ opacity }}
        />
        <Box>
          <Typography variant="body1" sx={{ m: 0, p: 0 }}>
            {value}
          </Typography>
          <Typography variant="caption" sx={{ m: 0, p: 0 }}>
            {title}
          </Typography>
        </Box>
      </Stack>
    </SmoothBox>
  );
}
