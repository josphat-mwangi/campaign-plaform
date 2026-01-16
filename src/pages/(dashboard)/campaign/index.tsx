import { Card, CardContent, Stack, Typography } from "@mui/material";
import { Form, muiConfirm, useForm } from "ochom-react-components";
import useCURD from "src/hooks/useCURD";
import toast from "react-hot-toast";

export default function CampaignPage() {
  const { post, processing } = useCURD();

  const { createField, formData, setFormData } = useForm({
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Please enter email body");
      return;
    }

    muiConfirm({
      title: "Send Campaign",
      message:
        "Are you sure you want to send this email campaign to all whitelisted recipients?",
      confirmButtonText: "Yes, Send",
      cancelButtonText: "Cancel",
      confirmButtonColor: "primary",
      onConfirm: async () => {
        post("/v1/api/broadcasts", {
          subject: formData.subject,
          message: formData.message,
        })
          .then(() => {
            toast.success("Email campaign sent successfully!");
            setFormData({ subject: "", message: "" });
          })
          .catch((err) => toast.error(err.message));
      },
    });
  };

  return (
    <div className="content">
      <Stack spacing={3}>
        <Typography variant="h5" color="GrayText">
          Send Email Campaign
        </Typography>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Form
              onSubmit={handleSubmit}
              submitText="Send Campaign"
              submitButtonProps={{ loading: processing }}
              fields={[
                createField("subject", "Subject", {
                  placeholder: "Enter email subject...",
                }),
                createField("message", "Body", {
                  multiline: true,
                  rows: 10,
                  placeholder: "Enter email body...",
                }),
              ]}
            />
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
}
