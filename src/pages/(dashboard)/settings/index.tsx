import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import moment from "moment";
import { CircularLoader, Form, Table, useForm } from "ochom-react-components";
import useAPI from "src/hooks/useAPI";
import useCURD from "src/hooks/useCURD";
import toast from "react-hot-toast";

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
  const { data: admins, loading: adminsLoading, refetch } = useAPI<Admin[]>("/v1/api/user");
  const { data: settings, loading: settingsLoading } =
    useAPI<Settings>("/settings", false);

  const [openAddAdmin, setOpenAddAdmin] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { post, put, processing } = useCURD();

  const {
    createField: createAddField,
    formData: addFormData,
    setFormData: setAddFormData,
  } = useForm({
    name: "",
    email: "",
    password: "",
  });

  const {
    createField: createPasswordField,
    formData: passwordFormData,
    setFormData: setPasswordFormData,
  } = useForm({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleOpenAddAdmin = () => {
    setAddFormData({ name: "", email: "", password: "" });
    setShowPassword(false);
    setOpenAddAdmin(true);
  };

  const handleCloseAddAdmin = () => {
    setOpenAddAdmin(false);
  };

  const handleOpenChangePassword = (admin: Admin) => {
    setPasswordFormData({
      email: admin.email,
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setOpenChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !addFormData.name.trim() ||
      !addFormData.email.trim() ||
      !addFormData.password.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    post("/v1/api/user", {
      name: addFormData.name,
      email: addFormData.email,
      password: addFormData.password,
    })
      .then(() => {
        toast.success("Admin user created successfully!");
        handleCloseAddAdmin();
        refetch();
      })
      .catch((err) => toast.error(err.message));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordFormData.password !== passwordFormData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!passwordFormData.password.trim()) {
      toast.error("Please enter a password");
      return;
    }

    put("/v1/api/user", {
      email: passwordFormData.email,
      password: passwordFormData.password,
    })
      .then(() => {
        toast.success("Password updated successfully!");
        handleCloseChangePassword();
      })
      .catch((err) => toast.error(err.message));
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
              <Icon
                icon="mdi:cog"
                style={{ verticalAlign: "middle", marginRight: 8 }}
              />
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
                <Typography variant="body1">
                  {settings?.daily_limit?.toLocaleString()}
                </Typography>
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
                <Typography variant="body1">
                  {settings?.smtp_host}:{settings?.smtp_port}
                </Typography>
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
              <Icon
                icon="mdi:account-multiple"
                style={{ verticalAlign: "middle", marginRight: 8 }}
              />
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
        <Dialog
          open={openAddAdmin}
          onClose={handleCloseAddAdmin}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Admin User</DialogTitle>
          <DialogContent>
            <Form
              onSubmit={handleAddAdmin}
              submitText="Add Admin"
              submitButtonProps={{ loading: processing }}
              fields={[
                createAddField("name", "Name", {
                  placeholder: "John Doe",
                }),
                createAddField("email", "Email", {
                  type: "email",
                  placeholder: "admin@example.com",
                }),
                createAddField("password", "Password", {
                  type: "custom",
                  component: (
                    <FormControl variant="outlined" fullWidth size="small">
                      <InputLabel htmlFor="add-admin-password">
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="add-admin-password"
                        size="small"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        endAdornment={
                          <InputAdornment sx={{ mx: 1 }} position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword((prev) => !prev)}
                              onMouseDown={(e) => e.preventDefault()}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? (
                                <Icon icon="tabler:eye-off" fontSize={15} />
                              ) : (
                                <Icon icon="tabler:eye" fontSize={15} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                        value={addFormData.password}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            password: e.target.value,
                          })
                        }
                      />
                    </FormControl>
                  ),
                }),
              ]}
            />
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog
          open={openChangePassword}
          onClose={handleCloseChangePassword}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Form
              onSubmit={handleChangePassword}
              submitText="Update Password"
              submitButtonProps={{ loading: processing }}
              fields={[
                createPasswordField("email", "Email", {
                  disabled: true,
                }),
                createPasswordField("password", "New Password", {
                  type: "custom",
                  component: (
                    <FormControl variant="outlined" fullWidth size="small">
                      <InputLabel htmlFor="new-password">
                        New Password
                      </InputLabel>
                      <OutlinedInput
                        id="new-password"
                        size="small"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        endAdornment={
                          <InputAdornment sx={{ mx: 1 }} position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword((prev) => !prev)}
                              onMouseDown={(e) => e.preventDefault()}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? (
                                <Icon icon="tabler:eye-off" fontSize={15} />
                              ) : (
                                <Icon icon="tabler:eye" fontSize={15} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="New Password"
                        value={passwordFormData.password}
                        onChange={(e) =>
                          setPasswordFormData({
                            ...passwordFormData,
                            password: e.target.value,
                          })
                        }
                      />
                    </FormControl>
                  ),
                }),
                createPasswordField("confirmPassword", "Confirm Password", {
                  type: "custom",
                  component: (
                    <FormControl variant="outlined" fullWidth size="small">
                      <InputLabel htmlFor="confirm-password">
                        Confirm Password
                      </InputLabel>
                      <OutlinedInput
                        id="confirm-password"
                        size="small"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        endAdornment={
                          <InputAdornment sx={{ mx: 1 }} position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                              onMouseDown={(e) => e.preventDefault()}
                              edge="end"
                              size="small"
                            >
                              {showConfirmPassword ? (
                                <Icon icon="tabler:eye-off" fontSize={15} />
                              ) : (
                                <Icon icon="tabler:eye" fontSize={15} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Confirm Password"
                        value={passwordFormData.confirmPassword}
                        onChange={(e) =>
                          setPasswordFormData({
                            ...passwordFormData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </FormControl>
                  ),
                }),
              ]}
            />
          </DialogContent>
        </Dialog>
      </Stack>
    </div>
  );
}
