import {
  Box,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import useCURD from "src/hooks/useCURD";
import { Form, useForm } from "ochom-react-components";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { createField, formData, setFormData } = useForm({
    email: "",
    password: "",
  });

  const { post, processing } = useCURD();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    post("/auth/login", {
      email: formData.email,
      password: formData.password,
    })
      .then(() => navigate("/"))
      .catch((err) => toast.error(err.message));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* Header */}
            <Box sx={{ textAlign: "center" }}>
              <Icon
                icon="mdi:email-fast"
                width={50}
                color="#1976d2"
                style={{ marginBottom: 8 }}
              />
              <Typography variant="h5" fontWeight={600}>
                Campaign Platform
              </Typography>
              <Typography variant="body2" color="GrayText">
                Sign in to your account
              </Typography>
            </Box>

            {/* Login Form */}
            <Form
              onSubmit={handleSubmit}
              submitText="Submit"
              submitButtonProps={{ loading: processing }}
              fields={[
                createField("email", "Email", {
                  type: "email",
                  placeholder: "admin@example.com",
                }),
                createField("password", "Password", {
                  type: "custom",
                  component: (
                    <FormControl variant="outlined" fullWidth size="small">
                      <InputLabel htmlFor="outlined-adornment-password">
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        size="small"
                        type={showPassword ? "text" : "password"}
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
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    </FormControl>
                  ),
                }),
              ]}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
