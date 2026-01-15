import { useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { muiConfirm } from "ochom-react-components";
import api from "src/services/api";

const toolbarButtons = [
  { icon: "mdi:format-bold", command: "bold", title: "Bold" },
  { icon: "mdi:format-italic", command: "italic", title: "Italic" },
  { icon: "mdi:format-underline", command: "underline", title: "Underline" },
  { divider: true },
  { icon: "mdi:format-list-bulleted", command: "insertUnorderedList", title: "Bullet List" },
  { icon: "mdi:format-list-numbered", command: "insertOrderedList", title: "Numbered List" },
  { divider: true },
  { icon: "mdi:format-align-left", command: "justifyLeft", title: "Align Left" },
  { icon: "mdi:format-align-center", command: "justifyCenter", title: "Align Center" },
  { icon: "mdi:format-align-right", command: "justifyRight", title: "Align Right" },
  { divider: true },
  { icon: "mdi:link", command: "createLink", title: "Insert Link", prompt: true },
  { icon: "mdi:image", command: "insertImage", title: "Insert Image", prompt: true },
];

export default function CampaignPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleToolbarClick = (button: typeof toolbarButtons[0]) => {
    if ("divider" in button) return;

    if (button.prompt) {
      const value = prompt(`Enter ${button.title.toLowerCase()}:`);
      if (value) {
        execCommand(button.command, value);
      }
    } else {
      execCommand(button.command);
    }
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachments((prev) => [...prev, ...Array.from(files)]);
    }
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const [sending, setSending] = useState(false);

  const handleSend = () => {
    const body = editorRef.current?.innerHTML || "";

    if (!subject.trim()) {
      alert("Please enter a subject");
      return;
    }

    if (!body.trim() || body === "<br>") {
      alert("Please enter email body");
      return;
    }

    muiConfirm({
      title: "Send Campaign",
      message: "Are you sure you want to send this email campaign to all whitelisted recipients?",
      confirmButtonText: "Yes, Send",
      cancelButtonText: "Cancel",
      confirmButtonColor: "primary",
      onConfirm: async () => {
        setSending(true);
        try {
          await api.post("/campaigns/send", {
            subject,
            body,
            attachments: attachments.map((f) => f.name),
          });

          alert("Email campaign sent successfully!");
          handleClear();
        } catch (error) {
          console.error("Failed to send campaign:", error);
          alert("Failed to send campaign. Please try again.");
        } finally {
          setSending(false);
        }
      },
    });
  };

  const handleClear = () => {
    setSubject("");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    setAttachments([]);
  };

  return (
    <div className="content">
      <Stack spacing={3}>
        <Typography variant="h5" color="GrayText">
          Send Email Campaign
        </Typography>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Stack spacing={3}>
              {/* Subject Field */}
              <TextField
                label="Subject"
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
              />

              {/* Rich Text Editor */}
              <Box>
                <Typography variant="body2" color="GrayText" sx={{ mb: 1 }}>
                  Body
                </Typography>

                {/* Toolbar */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    p: 1,
                    border: "1px solid #e0e0e0",
                    borderBottom: "none",
                    borderRadius: "4px 4px 0 0",
                    backgroundColor: "#fafafa",
                  }}
                >
                  {toolbarButtons.map((button, index) =>
                    "divider" in button ? (
                      <Divider
                        key={index}
                        orientation="vertical"
                        flexItem
                        sx={{ mx: 0.5 }}
                      />
                    ) : (
                      <Tooltip key={index} title={button.title}>
                        <IconButton
                          size="small"
                          onClick={() => handleToolbarClick(button)}
                          sx={{
                            borderRadius: 1,
                            "&:hover": { backgroundColor: "#e0e0e0" },
                          }}
                        >
                          <Icon icon={button.icon} width={20} />
                        </IconButton>
                      </Tooltip>
                    )
                  )}

                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                  {/* Attachment Button */}
                  <Tooltip title="Add Attachment">
                    <IconButton
                      size="small"
                      onClick={handleAttachment}
                      sx={{
                        borderRadius: 1,
                        "&:hover": { backgroundColor: "#e0e0e0" },
                      }}
                    >
                      <Icon icon="mdi:attachment" width={20} />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Editor Area */}
                <Box
                  ref={editorRef}
                  contentEditable
                  sx={{
                    minHeight: 300,
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: "0 0 4px 4px",
                    outline: "none",
                    backgroundColor: "#ffffff",
                    "&:focus": {
                      borderColor: "primary.main",
                    },
                    "& ul, & ol": {
                      pl: 3,
                    },
                  }}
                />

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  style={{ display: "none" }}
                />
              </Box>

              {/* Attachments List */}
              {attachments.length > 0 && (
                <Box>
                  <Typography variant="body2" color="GrayText" sx={{ mb: 1 }}>
                    Attachments ({attachments.length})
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {attachments.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1,
                          pr: 0.5,
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                          backgroundColor: "#fafafa",
                        }}
                      >
                        <Icon icon="mdi:file-document" width={20} />
                        <Typography variant="caption" sx={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {file.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeAttachment(index)}
                          sx={{ p: 0.5 }}
                        >
                          <Icon icon="mdi:close" width={16} />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleClear}
                  startIcon={<Icon icon="mdi:eraser" />}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSend}
                  disabled={sending}
                  startIcon={<Icon icon={sending ? "mdi:loading" : "mdi:send"} className={sending ? "spin" : ""} />}
                >
                  {sending ? "Sending..." : "Send Campaign"}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
}
