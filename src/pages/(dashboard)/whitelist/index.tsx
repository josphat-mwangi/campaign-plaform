import { useState } from "react";
import {
  Button,
  Card,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { CircularLoader, Form, Table, useForm } from "ochom-react-components";
import useAPI from "src/hooks/useAPI";
import useCURD from "src/hooks/useCURD";
import toast from "react-hot-toast";

interface WhitelistEntry {
  name: string;
  email: string;
  status: string;
}

interface WhitelistResponse {
  content: WhitelistEntry[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const StatusChip = ({ status }: { status: string }) => {
  const getColor = () => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
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

export default function WhitelistPage() {
  const { data, loading, error, refetch } = useAPI<WhitelistResponse>(
    "/mail",
    false
  );
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const { post, put, processing } = useCURD();

  const {
    createField: createAddField,
    formData: addFormData,
    setFormData: setAddFormData,
  } = useForm({
    name: "",
    email: "",
  });

  const {
    createField: createEditField,
    formData: editFormData,
    setFormData: setEditFormData,
  } = useForm({
    email: "",
    name: "",
    status: "",
  });

  const handleOpenAdd = () => {
    setAddFormData({ name: "", email: "" });
    setOpenAddDialog(true);
  };

  const handleOpenEdit = (entry: WhitelistEntry) => {
    setEditFormData({
      email: entry.email,
      name: entry.name,
      status: entry.status,
    });
    setOpenEditDialog(true);
  };

  const handleCloseAdd = () => {
    setOpenAddDialog(false);
    setAddFormData({ name: "", email: "" });
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormData.email.trim() || !addFormData.name.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    post("/mail", {
      email: addFormData.email,
      name: addFormData.name,
    })
      .then(() => {
        toast.success("Email added successfully!");
        handleCloseAdd();
        refetch();
      })
      .catch((err) => toast.error(err.message));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    put("/mail", {
      email: editFormData.email,
      status: editFormData.status,
    })
      .then(() => {
        toast.success("Status updated successfully!");
        handleCloseEdit();
        refetch();
      })
      .catch((err) => toast.error(err.message));
  };

  if (loading) return <CircularLoader />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  const whitelist = data?.content || [];

  return (
    <div className="content">
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" color="GrayText">
            Whitelisted Emails
          </Typography>
          <Button
            variant="contained"
            startIcon={<Icon icon="mdi:plus" />}
            onClick={handleOpenAdd}
          >
            Add Email
          </Button>
        </Stack>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <Table
            data={whitelist}
            columns={[
              {
                name: "Name",
                selector: (row: WhitelistEntry) => row.name,
              },
              {
                name: "Email",
                selector: (row: WhitelistEntry) => row.email,
              },
              {
                name: "Status",
                selector: (row: WhitelistEntry) => (
                  <StatusChip status={row.status} />
                ),
              },
              {
                name: "Actions",
                selector: (row: WhitelistEntry) => (
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEdit(row)}
                      title="Edit Status"
                    >
                      <Icon icon="mdi:pencil" />
                    </IconButton>
                  </Stack>
                ),
              },
            ]}
            loading={loading}
            error={error}
          />
        </Card>

        {/* Add Email Dialog */}
        <Dialog
          open={openAddDialog}
          onClose={handleCloseAdd}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Whitelisted Email</DialogTitle>
          <DialogContent>
            <Form
              onSubmit={handleAddSubmit}
              submitText="Add Email"
              submitButtonProps={{ loading: processing }}
              fields={[
                createAddField("name", "Name", {
                  placeholder: "John Doe",
                }),
                createAddField("email", "Email", {
                  type: "email",
                  placeholder: "john@example.com",
                }),
              ]}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Status Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={handleCloseEdit}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Update Email Status</DialogTitle>
          <DialogContent>
            <Form
              onSubmit={handleEditSubmit}
              submitText="Update Status"
              submitButtonProps={{ loading: processing }}
              fields={[
                createEditField("email", "Email", {
                  disabled: true,
                }),
                createEditField("name", "Name", {
                  disabled: true,
                }),
                createEditField("status", "Status", {
                  type: "custom",
                  component: (
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={editFormData.status}
                        label="Status"
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            status: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="ACTIVE">Active</MenuItem>
                        <MenuItem value="INACTIVE">Inactive</MenuItem>
                      </Select>
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
