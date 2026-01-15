import {
  Badge,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Icon } from "@iconify/react";
import useScreenSize from "src/hooks/useScreenSize";
import { PageAppBar } from "../../common/styled";
// import { useAuth } from "../AuthGuard";

const TopBar = ({ toggleSidebar }) => {
  const isMobile = useScreenSize();
  const navigateTo = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  //   const { signOut } = useAuth();

  const handleSignOut = () => {
    // signOut();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuLinks = [
    {
      title: "Profile",
      icon: "tabler:user",
      onClick: () => {
        handleClose();
        navigateTo("/settings/profile");
      },
    },

    {
      title: "Logout",
      icon: "tabler:lock",
      onClick: () => {
        handleClose();
        handleSignOut();
      },
    },
  ];

  return (
    <PageAppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        {isMobile && (
          <IconButton onClick={toggleSidebar} aria-label="menu" color="inherit">
            <Icon icon="tabler:menu-2" fontSize={25} />
          </IconButton>
        )}
        {!isMobile && (
          <Typography
            variant="h6"
            sx={{
              display: "block",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: 200,
            }}
          >
            Admin Dashboard
          </Typography>
        )}
      </Box>

      <Stack direction="row" columnGap={1} alignItems="center">
        <IconButton aria-label="notifications" color="inherit">
          <Badge variant="dot" color="error">
            <Icon icon="tabler:bell" fontSize={25} />
          </Badge>
        </IconButton>
        <IconButton
          id="basic-button"
          aria-controls="basic-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={handleClick}
          aria-label="user"
          color="inherit"
        >
          <Icon icon="tabler:user-hexagon" fontSize={25} />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{ "aria-labelledby": "basic-button" }}
        >
          <Box sx={{ width: 200, maxWidth: "100%" }}>
            {menuLinks.map((c, i) => (
              <MenuItem onClick={c.onClick} key={i}>
                <ListItemIcon>
                  <Icon icon={c.icon} />
                </ListItemIcon>
                <ListItemText>{c.title}</ListItemText>
              </MenuItem>
            ))}
          </Box>
        </Menu>
      </Stack>
    </PageAppBar>
  );
};

export default TopBar;
