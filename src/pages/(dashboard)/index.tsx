import styled from "@emotion/styled";
import { Icon } from "@iconify/react";
import {
  Grid,
  Card,
  Stack,
  Typography,
  ListItemIcon,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import moment from "moment";
import { CircularLoader, Table } from "ochom-react-components";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { formatNumber } from "src/utils/utils";
import { TextView } from "src/common/text-view";
import StatCard from "src/components/stats-card";
import useAPI from "src/hooks/useAPI";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover {
    text-decoration: underline;
  }
`;

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
          {data?.summary?.stats?.map((stat: any, index: number) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <StatCard
                title={stat.title}
                value={formatNumber(stat.value)}
                icon={stat.icon}
                color={stat.color}
                opacity={0.5}
              />
            </Grid>
          ))}

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
                    selector: (row: any) => (
                      <TextView primary={row.name} secondary={row.subject} />
                    ),
                  },
                  {
                    name: "Status",
                    selector: (row: any) => <StatusChip status={row.status} />,
                  },
                  {
                    name: "Recipients",
                    selector: (row: any) => formatNumber(row?.recipients || 0),
                  },
                  {
                    name: "Sent",
                    selector: (row: any) => formatNumber(row?.sent || 0),
                  },
                  {
                    name: "Opened",
                    selector: (row: any) => formatNumber(row?.opened || 0),
                  },
                  {
                    name: "Created",
                    selector: (row: any) => moment(row.created_at).format("ll"),
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
