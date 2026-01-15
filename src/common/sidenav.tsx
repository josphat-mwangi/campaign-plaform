import { Icon } from "@iconify/react";
import { Button, IconButton } from "@mui/material";
import { useModal } from "ochom-react-components";
import { NavLink } from "react-router-dom";
import AppName from "src/components/appname";
import useScreenSize from "src/hooks/useScreenSize";

import {
  SideNav,
  SideNavBody,
  SideNavGroup,
  SideNavGroupBody,
  SideNavGroupHeader,
  SideNavHeader,
} from "./styled";

function Sidebar({ menus, open, toggleSidebar }) {
  const isMobile = useScreenSize();

  return (
    <SideNav
      style={{
        left: isMobile && !open ? "-250px" : 0,
      }}
    >
      <SideNavHeader>
        <AppName />
        {isMobile && (
          <IconButton onClick={toggleSidebar}>
            <Icon icon="bx:bx-x" />
          </IconButton>
        )}
      </SideNavHeader>
      <SideNavBody>
        {menus.map((group, index) => (
          <Group key={index} {...group} toggleSidebar={toggleSidebar} />
        ))}
      </SideNavBody>
    </SideNav>
  );
}

const Group = (props) => {
  const {
    title,
    items,
    toggleSidebar,
    expanded = true,
    expandable = true,
  } = props;
  const [open, toggleOpen] = useModal(expanded);

  return (
    <SideNavGroup>
      <SideNavGroupHeader
        onClick={expandable ? toggleOpen : () => {}}
        style={{
          display: title ? "flex" : "none",
        }}
      >
        <span>{title}</span>
        {expandable && <Icon icon={`bx:bx-chevron-${open ? "up" : "down"}`} />}
      </SideNavGroupHeader>
      <SideNavGroupBody className={open ? "open" : ""}>
        {items.map((item, index) => {
          if (item.href) {
            return (
              <MenuLink
                key={index}
                {...item}
                href={item.href}
                onClick={toggleSidebar}
              />
            );
          }
          return <MenuButton key={index} {...item} />;
        })}
      </SideNavGroupBody>
    </SideNavGroup>
  );
};

const MenuLink = ({ href, icon, title, exact, onClick }) => {
  return (
    <NavLink className="item" to={href} end={!!exact} onClick={onClick}>
      <Icon icon={icon} />
      <span>{title}</span>
    </NavLink>
  );
};

const MenuButton = ({ icon, title, onClick }) => {
  return (
    <Button variant="text" className="item" onClick={onClick}>
      <Icon icon={icon} />
      <span> {title}</span>
    </Button>
  );
};

export default Sidebar;
