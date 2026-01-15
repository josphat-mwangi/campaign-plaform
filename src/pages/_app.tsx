import { useModal } from "ochom-react-components";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "src/common/sidenav";
import { PageBody, PageContent } from "src/common/styled";
import TopBar from "src/components/topbar";

const menuItems = [
  {
    items: [
      {
        icon: "mdi:view-dashboard",
        href: "/",
        title: "Dashboard",
        exact: true,
      },
      {
        title: "Campaigns",
        href: "/campaign",
        icon: "mdi:email-multiple",
      },
      {
        title: "Whitelist",
        href: "/whitelist",
        icon: "mdi:email-check",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: "mdi:cog",
      },
    ],
  },
];

export default function RootLayout() {
  const [open, toggleSidebar] = useModal();
  const location = useLocation();

  // Check if current route is an auth route
  const isAuthRoute = location.pathname.startsWith("/auth");

  // For auth routes, render without sidebar/topbar
  if (isAuthRoute) {
    return <Outlet />;
  }

  // For all other routes, render with sidebar/topbar
  return (
    <>
      <Sidebar menus={menuItems} open={open} toggleSidebar={toggleSidebar} />
      <PageBody>
        <TopBar toggleSidebar={toggleSidebar} />
        <PageContent>
          <Outlet />
        </PageContent>
      </PageBody>
    </>
  );
}
