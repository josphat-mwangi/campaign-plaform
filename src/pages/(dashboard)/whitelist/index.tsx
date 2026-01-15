import { useState } from "react";
import {
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Icon } from "@iconify/react";
import moment from "moment";
import { CircularLoader, Table } from "ochom-react-components";
import useAPI from "src/hooks/useAPI";

interface WhitelistEntry {
  id: number;
  email: string;
  name: string;
  status: string;
  created_at: string;
}

const StatusChip = ({ status }: { status: string }) => {
  const getColor = () => {
    switch (status) {
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
  const { data: whitelist, loading, error } = useAPI<WhitelistEntry[]>("/whitelist");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<WhitelistEntry | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
  });
  const [editStatus, setEditStatus] = useState("");

  const handleOpenAdd = () => {
    setFormData({ email: "", name: "" });
    setOpenAddDialog(true);
  };

  const handleOpenEdit = (entry: WhitelistEntry) => {
    setSelectedEntry(entry);
    setEditStatus(entry.status);
    setOpenEditDialog(true);
  };

  const handleCloseAdd = () => {
    setOpenAddDialog(false);
    setFormData({ email: "", name: "" });
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedEntry(null);
  };

  const handleAddSubmit = () => {
    // TODO: Implement API call to add whitelisted email
    console.log("Add whitelist:", formData);
    handleCloseAdd();
  };

  const handleEditSubmit = () => {
    // TODO: Implement API call to update status
    console.log("Update status:", { email: selectedEntry?.email, status: editStatus });
    handleCloseEdit();
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
            data={whitelist || []}
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
                selector: (row: WhitelistEntry) => <StatusChip status={row.status} />,
              },
              {
                name: "Added",
                selector: (row: WhitelistEntry) => moment(row.created_at).format("ll"),
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
        <Dialog open={openAddDialog} onClose={handleCloseAdd} maxWidth="sm" fullWidth>
          <DialogTitle>Add Whitelisted Email</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAdd}>Cancel</Button>
            <Button variant="contained" onClick={handleAddSubmit}>
              Add Email
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Status Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
          <DialogTitle>Update Email Status</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Email"
                fullWidth
                value={selectedEntry?.email || ""}
                disabled
              />
              <TextField
                label="Name"
                fullWidth
                value={selectedEntry?.name || ""}
                disabled
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editStatus}
                  label="Status"
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button variant="contained" onClick={handleEditSubmit}>
              Update Status
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </div>
  );
}
