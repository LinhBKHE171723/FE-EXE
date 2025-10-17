import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Paper,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import { Search, AccessTime, CheckCircle } from "@mui/icons-material";
import { motion } from "framer-motion";
import subscriptionApi from "../../api/subscriptionApi";

const SubscriptionTab = () => {
  const [subs, setSubs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    subscriptionApi.getAll().then((res) => setSubs(res.data));
  }, []);

  // ✅ Lọc dữ liệu theo tên / loại gạo
  const filteredSubs = subs.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rice.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
        {/* 🔹 Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="h5" fontWeight="bold" display="flex" alignItems="center" gap={1}>
            💌 Danh sách đăng ký giao gạo ({filteredSubs.length})
          </Typography>

          <TextField
            size="small"
            placeholder="Tìm theo tên hoặc loại gạo..."
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

        {/* 🔹 Bảng hiển thị */}
        <Table>
          <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Loại gạo</TableCell>
              <TableCell>Khối lượng</TableCell>
              <TableCell>Tần suất</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell>Ngày tạo</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredSubs.map((s) => (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  backgroundColor: "#fff",
                  borderBottom: "1px solid #eee",
                }}
              >
                <TableCell sx={{ fontWeight: "bold" }}>{s.name}</TableCell>
                <TableCell>{s.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={s.rice}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                </TableCell>
                <TableCell>{s.weight}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      s.frequency === "weekly"
                        ? "Hàng tuần"
                        : s.frequency === "biweekly"
                        ? "2 tuần/lần"
                        : "Hàng tháng"
                    }
                    color={
                      s.frequency === "weekly"
                        ? "info"
                        : s.frequency === "biweekly"
                        ? "warning"
                        : "success"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTime fontSize="small" color="action" />
                    {s.startDate}
                  </Box>
                </TableCell>
                <TableCell sx={{ maxWidth: 220 }}>{s.address}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  {s.note || "—"}
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle color="success" fontSize="small" />
                    {new Date(s.createdAt).toLocaleDateString("vi-VN")}
                  </Box>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </motion.div>
  );
};

export default SubscriptionTab;
