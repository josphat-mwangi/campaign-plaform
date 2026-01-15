import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import api from "src/services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!formData.password.trim()) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", formData);
      const { token } = response.data;

      sessionStorage.setItem("authToken", token);
      navigate("/");
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
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

            {/* Error Message */}
            {error && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: "#ffebee",
                  border: "1px solid #ffcdd2",
                }}
              >
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Box>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon icon="mdi:email-outline" width={20} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon icon="mdi:lock-outline" width={20} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          <Icon
                            icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                            width={20}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ mt: 1 }}
                >
                  {loading ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Icon icon="mdi:loading" className="spin" width={20} />
                      <span>Signing in...</span>
                    </Stack>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
