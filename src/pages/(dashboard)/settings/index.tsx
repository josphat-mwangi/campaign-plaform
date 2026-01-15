import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import moment from "moment";
import { CircularLoader, Table } from "ochom-react-components";
import useAPI from "src/hooks/useAPI";

interface Admin {
  id: number;
  name: string;
  email: string;
  status: string;
  created_at: string;
  last_login: string;
}

interface Settings {
  app_name: string;
  timezone: string;
  from_email: string;
  from_name: string;
  smtp_host: string;
  smtp_port: number;
  daily_limit: number;
}

const StatusChip = ({ status }: { status: string }) => {
  return (
    <Chip
      label={status}
      color={status === "active" ? "success" : "error"}
      size="small"
      sx={{ textTransform: "capitalize" }}
    />
  );
};

export default function SettingsPage() {
  const { data: admins, loading: adminsLoading } = useAPI<Admin[]>("/admins");
  const { data: settings, loading: settingsLoading } = useAPI<Settings>("/settings", false);

  const [openAddAdmin, setOpenAddAdmin] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [, setSelectedAdmin] = useState<Admin | null>(null);

  const [addAdminForm, setAddAdminForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleOpenAddAdmin = () => {
    setAddAdminForm({ name: "", email: "", password: "" });
    setOpenAddAdmin(true);
  };

  const handleCloseAddAdmin = () => {
    setOpenAddAdmin(false);
  };

  const handleOpenChangePassword = (admin: Admin) => {
    setSelectedAdmin(admin);
    setPasswordForm({ email: admin.email, password: "", confirmPassword: "" });
    setOpenChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
    setSelectedAdmin(null);
  };

  const handleAddAdmin = () => {
    // TODO: Implement API call to add admin
    console.log("Add admin:", addAdminForm);
    handleCloseAddAdmin();
  };

  const handleChangePassword = () => {
    if (passwordForm.password !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // TODO: Implement API call to update password
    console.log("Update password:", { email: passwordForm.email, password: passwordForm.password });
    handleCloseChangePassword();
  };

  if (adminsLoading || settingsLoading) return <CircularLoader />;

  return (
    <div className="content">
      <Stack spacing={4}>
        <Typography variant="h5" color="GrayText">
          Settings
        </Typography>

        {/* App Settings */}
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Icon icon="mdi:cog" style={{ verticalAlign: "middle", marginRight: 8 }} />
              Application Settings
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="caption" color="GrayText">
                  App Name
                </Typography>
                <Typography variant="body1">{settings?.app_name}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="caption" color="GrayText">
                  Timezone
                </Typography>
                <Typography variant="body1">{settings?.timezone}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="caption" color="GrayText">
                  Daily Email Limit
                </Typography>
                <Typography variant="body1">{settings?.daily_limit?.toLocaleString()}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="caption" color="GrayText">
                  From Email
                </Typography>
                <Typography variant="body1">{settings?.from_email}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="caption" color="GrayText">
                  From Name
                </Typography>
                <Typography variant="body1">{settings?.from_name}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="caption" color="GrayText">
                  SMTP Host
                </Typography>
                <Typography variant="body1">{settings?.smtp_host}:{settings?.smtp_port}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Admin Users */}
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">
              <Icon icon="mdi:account-multiple" style={{ verticalAlign: "middle", marginRight: 8 }} />
              Admin Users
            </Typography>
            <Button
              variant="contained"
              startIcon={<Icon icon="mdi:plus" />}
              onClick={handleOpenAddAdmin}
            >
              Add Admin
            </Button>
          </Stack>

          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <Table
              data={admins || []}
              columns={[
                {
                  name: "Name",
                  selector: (row: Admin) => row.name,
                },
                {
                  name: "Email",
                  selector: (row: Admin) => row.email,
                },
                {
                  name: "Status",
                  selector: (row: Admin) => <StatusChip status={row.status} />,
                },
                {
                  name: "Created",
                  selector: (row: Admin) => moment(row.created_at).format("ll"),
                },
                {
                  name: "Last Login",
                  selector: (row: Admin) => moment(row.last_login).fromNow(),
                },
                {
                  name: "Actions",
                  selector: (row: Admin) => (
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenChangePassword(row)}
                        title="Change Password"
                      >
                        <Icon icon="mdi:key" />
                      </IconButton>
                    </Stack>
                  ),
                },
              ]}
              loading={adminsLoading}
              error={null}
            />
          </Card>
        </Box>

        {/* Add Admin Dialog */}
        <Dialog open={openAddAdmin} onClose={handleCloseAddAdmin} maxWidth="sm" fullWidth>
          <DialogTitle>Add Admin User</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Name"
                fullWidth
                value={addAdminForm.name}
                onChange={(e) => setAddAdminForm({ ...addAdminForm, name: e.target.value })}
                placeholder="John Doe"
              />
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={addAdminForm.email}
                onChange={(e) => setAddAdminForm({ ...addAdminForm, email: e.target.value })}
                placeholder="admin@example.com"
              />
              <TextField
                label="Password"
                fullWidth
                type="password"
                value={addAdminForm.password}
                onChange={(e) => setAddAdminForm({ ...addAdminForm, password: e.target.value })}
                placeholder="Enter password"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddAdmin}>Cancel</Button>
            <Button variant="contained" onClick={handleAddAdmin}>
              Add Admin
            </Button>
          </DialogActions>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={openChangePassword} onClose={handleCloseChangePassword} maxWidth="sm" fullWidth>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Email"
                fullWidth
                value={passwordForm.email}
                disabled
              />
              <TextField
                label="New Password"
                fullWidth
                type="password"
                value={passwordForm.password}
                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                placeholder="Enter new password"
              />
              <TextField
                label="Confirm Password"
                fullWidth
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseChangePassword}>Cancel</Button>
            <Button variant="contained" onClick={handleChangePassword}>
              Update Password
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </div>
  );
}
