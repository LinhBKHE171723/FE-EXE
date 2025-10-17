import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { Search } from "@mui/icons-material";
import userApi from "../../api/userApi";

const UserTab = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    userApi
      .getAll()
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, []);

  // 🔎 Lọc người dùng theo tên hoặc email
  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: "#fafafa",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="h5" fontWeight="bold">
            👥 Danh sách người dùng ({filteredUsers.length})
          </Typography>

          <TextField
            size="small"
            placeholder="Tìm theo email hoặc tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              minWidth: 280,
            }}
          />
        </Box>

        {/* Bảng người dùng */}
        <Table>
          <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Tên người dùng</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Ngày tạo</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.map((u) => (
              <motion.tr
                key={u._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  backgroundColor: "#fff",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                }}
                whileHover={{ backgroundColor: "#f1f8ff" }}
              >
                <TableCell>{u.email}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{u.username}</TableCell>
                <TableCell>
                  <Chip
                    label={u.role === "admin" ? "Admin" : "Khách hàng"}
                    color={u.role === "admin" ? "error" : "success"}
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                </TableCell>
                <TableCell>
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("vi-VN")
                    : "—"}
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </motion.div>
  );
};

export default UserTab;
