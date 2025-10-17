import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Email, Lock } from "@mui/icons-material";
import authApi from "../api/authApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authApi.login({ email, password });
      const { user, token } = res.data;

      if (user.role !== "admin") {
        toast.warning("Bạn không có quyền truy cập admin!");
        return;
      }

      localStorage.setItem("adminToken", token);
      toast.success("Đăng nhập thành công!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi đăng nhập!");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #2196f3, #21cbf3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Animation wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 4,
            width: 400,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="bold"
            color="primary"
            mb={3}
          >
            👨‍💻 Đăng nhập Quản trị
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Mật khẩu"
              variant="outlined"
              fullWidth
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
                transition: "0.3s",
                "&:hover": {
                  background: "linear-gradient(90deg, #1565c0, #1e88e5)",
                  transform: "translateY(-2px)",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                },
              }}
            >
              Đăng nhập
            </Button>
          </form>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mt={3}
          >
            © {new Date().getFullYear()} SupperRice Admin
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Login;
