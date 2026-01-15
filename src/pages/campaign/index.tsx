import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import moment from "moment";
import { CircularLoader, Table } from "ochom-react-components";
import { TextView } from "src/common/text-view";
import { formatNumber } from "src/utils/utils";
import useAPI from "src/hooks/useAPI";

interface Campaign {
  id: number;
  name: string;
  subject: string;
  body: string;
  status: string;
  recipients: number;
  sent: number;
  delivered: number;
  opened: number;
  failed: number;
  created_at: string;
  updated_at: string;
}

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

export default function CampaignPage() {
  const { data: campaigns, loading, error } = useAPI<Campaign[]>("/campaigns");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
  });

  const handleOpenCreate = () => {
    setSelectedCampaign(null);
    setFormData({ name: "", subject: "", body: "" });
    setOpenDialog(true);
  };

  const handleOpenView = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      subject: campaign.subject,
      body: campaign.body,
    });
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedCampaign(null);
  };

  const handleSubmit = () => {
    // TODO: Implement API call to create/update campaign
    console.log("Form data:", formData);
    handleClose();
  };

  if (loading) return <CircularLoader />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <div className="content">
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" color="GrayText">
            Email Campaigns
          </Typography>
          <Button
            variant="contained"
            startIcon={<Icon icon="mdi:plus" />}
            onClick={handleOpenCreate}
          >
            New Campaign
          </Button>
        </Stack>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <Table
            data={campaigns || []}
            columns={[
              {
                name: "Campaign",
                selector: (row: Campaign) => (
                  <TextView primary={row.name} secondary={row.subject} />
                ),
              },
              {
                name: "Status",
                selector: (row: Campaign) => <StatusChip status={row.status} />,
              },
              {
                name: "Recipients",
                selector: (row: Campaign) => formatNumber(row.recipients),
              },
              {
                name: "Sent",
                selector: (row: Campaign) => formatNumber(row.sent),
              },
              {
                name: "Delivered",
                selector: (row: Campaign) => formatNumber(row.delivered),
              },
              {
                name: "Opened",
                selector: (row: Campaign) => formatNumber(row.opened),
              },
              {
                name: "Failed",
                selector: (row: Campaign) => formatNumber(row.failed),
              },
              {
                name: "Created",
                selector: (row: Campaign) => moment(row.created_at).format("ll"),
              },
              {
                name: "Actions",
                selector: (row: Campaign) => (
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenView(row)}
                    >
                      <Icon icon="mdi:eye" />
                    </IconButton>
                    {row.status === "pending" && (
                      <IconButton size="small" color="success">
                        <Icon icon="mdi:send" />
                      </IconButton>
                    )}
                  </Stack>
                ),
              },
            ]}
            loading={loading}
            error={error}
          />
        </Card>

        <Dialog
          open={openDialog}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedCampaign ? "Campaign Details" : "Create New Campaign"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Campaign Name"
                fullWidth
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!!selectedCampaign}
              />
              <TextField
                label="Email Subject"
                fullWidth
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                disabled={!!selectedCampaign}
              />
              <TextField
                label="Email Body (HTML)"
                fullWidth
                multiline
                rows={6}
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                disabled={!!selectedCampaign}
              />

              {selectedCampaign && (
                <Box>
                  <Typography variant="subtitle2" color="GrayText" gutterBottom>
                    Campaign Statistics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                      <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h6">
                          {formatNumber(selectedCampaign.recipients)}
                        </Typography>
                        <Typography variant="caption" color="GrayText">
                          Recipients
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                      <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h6" color="primary">
                          {formatNumber(selectedCampaign.sent)}
                        </Typography>
                        <Typography variant="caption" color="GrayText">
                          Sent
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                      <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h6" color="success.main">
                          {formatNumber(selectedCampaign.delivered)}
                        </Typography>
                        <Typography variant="caption" color="GrayText">
                          Delivered
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                      <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h6" color="info.main">
                          {formatNumber(selectedCampaign.opened)}
                        </Typography>
                        <Typography variant="caption" color="GrayText">
                          Opened
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                      <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h6" color="error.main">
                          {formatNumber(selectedCampaign.failed)}
                        </Typography>
                        <Typography variant="caption" color="GrayText">
                          Failed
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            {!selectedCampaign && (
              <Button variant="contained" onClick={handleSubmit}>
                Create Campaign
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Stack>
    </div>
  );
}
