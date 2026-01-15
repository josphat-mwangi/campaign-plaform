import { useQuery } from "@tanstack/react-query";
import { CircularLoader, useModal } from "ochom-react-components";
import { Outlet } from "react-router-dom";
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

export default function Component() {
  const [open, toggleSidebar] = useModal();

  const query = useQuery({
    queryKey: ["auth-layout"],
    queryFn: async () => {
      //get token from url params
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (!token) {
        return { user: null };
      }
    },
  });

  if (query.isPending || query.isFetching) return <CircularLoader />;

  return (
    // <AuthGuard>
    <>
      <Sidebar menus={menuItems} open={open} toggleSidebar={toggleSidebar} />
      <PageBody>
        <TopBar toggleSidebar={toggleSidebar} />
        <PageContent>
          <Outlet />
        </PageContent>
      </PageBody>
    </>

    // </AuthGuard>
  );
}
