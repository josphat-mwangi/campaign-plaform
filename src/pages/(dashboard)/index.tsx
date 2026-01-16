/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid, Card, Stack, Typography, Chip } from "@mui/material";
import moment from "moment";
import { CircularLoader, Table } from "ochom-react-components";
import { useMemo } from "react";
import { formatNumber } from "src/utils/utils";
import { TextView } from "src/common/text-view";
import StatCard from "src/components/stats-card";
import useAPI from "src/hooks/useAPI";

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
  const { data, loading, error } = useAPI<any>("/dashboard", false);

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

  if (loading) return <CircularLoader />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <div className="content">
      <Stack rowGap={3} className="dashboard">
        <Typography color="GrayText" variant="h5" sx={{ ml: 1 }}>
          Hi <b>{user?.first_name}</b>, good {hour}!
        </Typography>

        <Grid container spacing={{ xs: 1, md: 2 }} sx={{ mb: 3 }}>
          {data?.summary?.stats?.map(
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
                data={data?.summary?.recent_campaigns || []}
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
                loading={loading}
                error={error}
              />
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </div>
  );
}
