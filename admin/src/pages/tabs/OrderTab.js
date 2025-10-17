import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Avatar,
  Chip,
  Paper,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import orderApi from "../../api/orderApi";

const statusColor = {
  pending: "warning",
  waiting_payment: "secondary",
  paid: "info",
  shipped: "primary",
  completed: "success",
};

const OrderTab = () => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi
      .getAll()
      .then((res) => {
        setOrders(res.data);
        const total = res.data.reduce((sum, o) => sum + o.totalPrice, 0);
        setTotalRevenue(total);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: "#fafafa",
          boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          📦 Danh sách đơn hàng
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 3,
            color: "gray",
          }}
        >
          Tổng doanh thu:{" "}
          <strong style={{ color: "#1976d2" }}>
            {totalRevenue.toLocaleString()} ₫
          </strong>
        </Typography>

        <Table>
          <TableHead
            sx={{
              backgroundColor: "#e3f2fd",
            }}
          >
            <TableRow>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Phương thức</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Tổng khối lượng</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Ngày đặt</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((o) => {
              const totalWeight = o.products?.reduce(
                (sum, p) => sum + (p.weight || 2) * p.quantity,
                0
              );

              return (
                <motion.tr
                  key={o._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundColor: "#fff",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {/* 🧍 Khách hàng */}
                  <TableCell>
                    <Typography variant="subtitle2">{o.user?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {o.user?.email}
                    </Typography>
                  </TableCell>

                  {/* 📦 Sản phẩm */}
                  <TableCell>
                    {o.products.map((p) => (
                      <Box
                        key={p.id}
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                        mb={0.5}
                        sx={{
                          background: "#f9f9f9",
                          borderRadius: 2,
                          p: 1,
                        }}
                      >
                        {p.image && (
                          <Avatar
                            src={p.image}
                            alt={p.name}
                            sx={{
                              width: 32,
                              height: 32,
                              border: "1px solid #ddd",
                            }}
                          />
                        )}
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {p.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {p.weight || 2} kg × {p.quantity}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </TableCell>

                  {/* 💳 Thanh toán */}
                  <TableCell>
                    <Chip
                      label={
                        o.paymentMethod === "cod"
                          ? "COD (Khi nhận)"
                          : "Chuyển khoản"
                      }
                      color={o.paymentMethod === "cod" ? "default" : "info"}
                      size="small"
                    />
                  </TableCell>

                  {/* 🚚 Trạng thái */}
                  <TableCell>
                    <Chip
                      label={
                        {
                          pending: "Chờ xác nhận",
                          waiting_payment: "Chờ thanh toán",
                          paid: "Đã thanh toán",
                          shipped: "Đang giao",
                          completed: "Hoàn tất",
                        }[o.status] || o.status
                      }
                      color={statusColor[o.status] || "default"}
                      size="small"
                    />
                  </TableCell>

                  {/* ⚖️ Tổng khối lượng */}
                  <TableCell>
                    <Typography fontWeight="bold" color="text.primary">
                      {totalWeight} kg
                    </Typography>
                  </TableCell>

                  {/* 💰 Tổng tiền */}
                  <TableCell sx={{ fontWeight: "bold", color: "#2e7d32" }}>
                    {o.totalPrice.toLocaleString()} ₫
                  </TableCell>

                  {/* 🕓 Ngày đặt */}
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(o.createdAt).toLocaleTimeString("vi-VN")}
                    </Typography>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </motion.div>
  );
};

export default OrderTab;
