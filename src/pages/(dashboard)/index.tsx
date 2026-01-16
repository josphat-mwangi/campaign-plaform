import { Grid, Card, Stack, Typography, Chip } from "@mui/material";
import moment from "moment";
import { Table } from "ochom-react-components";
import { useMemo } from "react";
import { formatNumber } from "src/utils/utils";
import { TextView } from "src/common/text-view";
import StatCard from "src/components/stats-card";
// import useAPI from "src/hooks/useAPI";

const StatusChip = ({ status }: { status: string }) => {
  const getColor = () => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "info";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Chip
      label={status}
      color={getColor()}
      size="small"
      sx={{ textTransform: "capitalize" }}
    />
  );
};

export default function Page() {
  const { user } = {
    user: { first_name: "Admin" },
  };
  // const { data, loading, error } = useAPI<any>("/dashboard", false);

  const data = {
    dashboard: {
      summary: {
        stats: [
          {
            title: "Total Campaigns",
            value: 24,
            icon: "mdi:email-multiple",
            color: "#1976d2",
          },
          {
            title: "Active Campaigns",
            value: 8,
            icon: "mdi:email-fast",
            color: "#2e7d32",
          },
          {
            title: "Whitelisted Emails",
            value: 1560,
            icon: "mdi:email-check",
            color: "#ed6c02",
          },
          {
            title: "Emails Sent",
            value: 45230,
            icon: "mdi:send",
            color: "#9c27b0",
          },
          {
            title: "Pending",
            value: 12,
            icon: "mdi:clock-outline",
            color: "#d32f2f",
          },
          {
            title: "Delivered",
            value: 44100,
            icon: "mdi:check-circle",
            color: "#0288d1",
          },
        ],
        recent_activities: [
          {
            icon: "mdi:email-plus",
            time: "2026-01-15T10:30:00Z",
            action: "New campaign created",
            link: "/campaign/1",
            campaign: "Product Launch 2026",
          },
          {
            icon: "mdi:email-fast",
            time: "2026-01-15T09:15:00Z",
            action: "Campaign sent successfully",
            link: "/campaign/5",
            campaign: "Flash Sale Promo",
          },
          {
            icon: "mdi:account-plus",
            time: "2026-01-14T16:45:00Z",
            action: "New emails whitelisted",
            link: "/whitelist",
            campaign: "50 contacts added",
          },
          {
            icon: "mdi:check-decagram",
            time: "2026-01-14T14:20:00Z",
            action: "Campaign completed",
            link: "/campaign/8",
            campaign: "Holiday Special",
          },
          {
            icon: "mdi:pencil-outline",
            time: "2026-01-14T11:00:00Z",
            action: "Campaign updated",
            link: "/campaign/3",
            campaign: "Weekly Newsletter",
          },
        ],
        recent_campaigns: [
          {
            id: 1,
            name: "Product Launch 2026",
            subject: "Introducing Our New Product Line!",
            status: "active",
            recipients: 5000,
            sent: 3200,
            opened: 1850,
            created_at: "2026-01-15T08:00:00Z",
          },
          {
            id: 2,
            name: "Flash Sale Promo",
            subject: "50% OFF - This Weekend Only!",
            status: "completed",
            recipients: 8500,
            sent: 8500,
            opened: 4200,
            created_at: "2026-01-14T10:30:00Z",
          },
          {
            id: 3,
            name: "Weekly Newsletter",
            subject: "Your Weekly Update",
            status: "active",
            recipients: 12000,
            sent: 6800,
            opened: 3400,
            created_at: "2026-01-13T14:15:00Z",
          },
          {
            id: 4,
            name: "Customer Feedback",
            subject: "We Value Your Opinion",
            status: "pending",
            recipients: 3000,
            sent: 0,
            opened: 0,
            created_at: "2026-01-12T09:45:00Z",
          },
          {
            id: 5,
            name: "Loyalty Rewards",
            subject: "Exclusive Rewards for You!",
            status: "active",
            recipients: 4500,
            sent: 2100,
            opened: 980,
            created_at: "2026-01-11T16:20:00Z",
          },
        ],
      },
    },
  };

  const hour = useMemo(() => {
    const date = new Date();
    const hours = date.getHours();
    let greetTime = "morning";
    if (hours > 12 && hours <= 17) {
      greetTime = "afternoon";
    } else if (hours > 17 && hours <= 24) {
      greetTime = "evening";
    }
    return greetTime;
  }, []);

  // if (loading) return <CircularLoader />;
  // if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <div className="content">
      <Stack rowGap={3} className="dashboard">
        <Typography color="GrayText" variant="h5" sx={{ ml: 1 }}>
          Hi <b>{user?.first_name}</b>, good {hour}!
        </Typography>

        <Grid container spacing={{ xs: 1, md: 2 }} sx={{ mb: 3 }}>
          {data?.dashboard?.summary?.stats?.map(
            (
              stat: {
                title: string;
                value: number;
                icon: string;
                color: string;
              },
              index: number
            ) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <StatCard
                  title={stat.title}
                  value={formatNumber(stat.value)}
                  icon={stat.icon}
                  color={stat.color}
                  opacity={0.5}
                />
              </Grid>
            )
          )}

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <Typography variant="body1" color="GrayText" sx={{ mt: 2, mb: 1 }}>
              Recent campaigns
            </Typography>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <Table
                data={data?.dashboard?.summary?.recent_campaigns || []}
                columns={[
                  {
                    name: "Campaign",
                    selector: (row) => (
                      <TextView primary={row.name} secondary={row.subject} />
                    ),
                  },
                  {
                    name: "Status",
                    selector: (row) => <StatusChip status={row.status} />,
                  },
                  {
                    name: "Recipients",
                    selector: (row) => formatNumber(row?.recipients || 0),
                  },
                  {
                    name: "Sent",
                    selector: (row) => formatNumber(row?.sent || 0),
                  },
                  {
                    name: "Opened",
                    selector: (row) => formatNumber(row?.opened || 0),
                  },
                  {
                    name: "Created",
                    selector: (row) => moment(row.created_at).format("ll"),
                  },
                ]}
                // loading={loading}
                // error={error}
              />
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </div>
  );
}
