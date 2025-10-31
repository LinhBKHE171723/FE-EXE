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
  Select,
  MenuItem,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Divider,
  Stack,
  TableContainer,
  ButtonGroup,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  ArrowForward as ArrowForwardIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TaskAlt as ConfirmedIcon,
  PendingActions as PendingIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import orderApi from "../../api/orderApi";

/* ===== STATUS CONFIG ===== */
const STATUS_COLOR = {
  pending: "warning",
  confirmed: "info",
  shipped: "primary",
  completed: "success",
  cancelled: "default",
};
const STATUS_LABEL = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipped: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};
const STATUS_ICON = {
  pending: <PendingIcon fontSize="small" />,
  confirmed: <ConfirmedIcon fontSize="small" />,
  shipped: <LocalShippingIcon fontSize="small" />,
  completed: <CheckCircleIcon fontSize="small" />,
  cancelled: <CancelIcon fontSize="small" />,
};
const NEXT_STEPS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["completed"],
  completed: [],
  cancelled: [],
};

/* ===== STYLE UTILS ===== */
const ellipsisSx = {
  maxWidth: 220,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "block",
};
const addressEllipsisSx = {
  maxWidth: 320,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "block",
};
const productCellScrollSx = {
  maxWidth: 420,
  overflowY: "auto",
  maxHeight: 120,
  pr: 1,
};
/* Zebra + hover */
const ZebraRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:hover": { backgroundColor: theme.palette.action.selected },
}));

/* ===== COMPONENT ===== */
const OrderTab = () => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const [snack, setSnack] = useState({ open: false, type: "success", msg: "" });
  const [updatingId, setUpdatingId] = useState(null);

  // Dialog xem đơn
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  // Dialog chỉnh sửa
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    name: "",
    phone: "",
    address: "",
    paymentMethod: "cod",
  });
  const [saving, setSaving] = useState(false);

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

  const handleChangeStatus = async (orderId, nextStatus) => {
    if (!nextStatus) return;
    const prev = [...orders];
    setUpdatingId(orderId);

    // optimistic update
    setOrders((list) =>
      list.map((o) => (o._id === orderId ? { ...o, status: nextStatus } : o))
    );

    try {
      await orderApi.updateStatus(orderId, nextStatus);
      setSnack({
        open: true,
        type: "success",
        msg: "Cập nhật trạng thái thành công.",
      });
    } catch (e) {
      setOrders(prev); // rollback
      setSnack({
        open: true,
        type: "error",
        msg: e?.response?.data?.message || "Cập nhật thất bại. Thử lại.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const canEdit = (status) => ["pending", "confirmed"].includes(status);

  const openView = (o) => {
    setViewData(o);
    setViewOpen(true);
  };
  const openEdit = (o) => {
    setEditData({
      _id: o._id,
      name: o.name || "",
      phone: o.phone || "",
      address: o.address || "",
      paymentMethod: o.paymentMethod || "cod",
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const payload = {
        name: editData.name?.trim(),
        phone: editData.phone?.trim(),
        address: editData.address?.trim(),
        paymentMethod: editData.paymentMethod,
      };

      // optimistic update
      setOrders((list) =>
        list.map((o) => (o._id === editData._id ? { ...o, ...payload } : o))
      );

      await orderApi.update(editData._id, payload);

      setSnack({
        open: true,
        type: "success",
        msg: "Cập nhật đơn hàng thành công.",
      });
      setEditOpen(false);
    } catch (e) {
      setSnack({
        open: true,
        type: "error",
        msg: e?.response?.data?.message || "Cập nhật thất bại.",
      });
    } finally {
      setSaving(false);
    }
  };

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
        {/* Header với stat pill lớn */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          gap={2}
          sx={{ mb: 1.5 }}
        >
          <Typography variant="h5" fontWeight="bold">
            📦 Danh sách đơn hàng
          </Typography>

          <Box
            sx={{
              px: 2.5,
              py: 1.25,
              borderRadius: 999,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              boxShadow: "0 4px 14px rgba(171,71,188,0.35)",
              background:
                "linear-gradient(90deg, rgba(123,31,162,1) 0%, rgba(171,71,188,1) 100%)",
            }}
          >
            <Typography sx={{ opacity: 0.9 }}>Tổng doanh thu</Typography>
            <Typography variant="h5" fontWeight={800}>
              {totalRevenue.toLocaleString()} ₫
            </Typography>
          </Box>
        </Stack>

        <TableContainer sx={{ mt: 1, borderRadius: 2, overflow: "hidden" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 700 } }}>
                <TableCell sx={{ width: 220 }}>Khách hàng</TableCell>
                <TableCell sx={{ width: 420 }}>Sản phẩm</TableCell>
                <TableCell sx={{ width: 120 }}>Phương thức</TableCell>
                <TableCell sx={{ width: 140 }}>Trạng thái</TableCell>
                <TableCell sx={{ width: 320 }}>Địa chỉ giao hàng</TableCell>
                <TableCell sx={{ width: 120 }}>Khối lượng</TableCell>
                <TableCell sx={{ width: 140 }}>Tổng tiền</TableCell>
                <TableCell sx={{ width: 150 }}>Ngày đặt</TableCell>
                <TableCell sx={{ width: 320, pr: 2 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((o) => {
                const totalWeight = o.products?.reduce(
                  (sum, p) => sum + (p.weight || 2) * p.quantity,
                  0
                );
                const nexts = NEXT_STEPS[o.status];

                return (
                  <ZebraRow key={o._id}>
                    {/* 🧍 Khách hàng */}
                    <TableCell>
                      <Tooltip
                        title={
                          (o.user?.name || "") +
                          (o.user?.email ? ` • ${o.user?.email}` : "")
                        }
                        arrow
                      >
                        <Box>
                          <Typography variant="subtitle2" sx={ellipsisSx}>
                            {o.user?.name || "—"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={ellipsisSx}
                          >
                            {o.user?.email || "—"}
                          </Typography>
                          {(o.name || o.phone) && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={ellipsisSx}
                            >
                              {o.name} {o.phone ? `• ${o.phone}` : ""}
                            </Typography>
                          )}
                        </Box>
                      </Tooltip>
                    </TableCell>

                    {/* 📦 Sản phẩm */}
                    <TableCell sx={productCellScrollSx}>
                      {o.products.map((p) => (
                        <Box
                          key={p.id}
                          display="flex"
                          alignItems="center"
                          gap={1.2}
                          mb={0.5}
                          sx={{ background: "#f9f9f9", borderRadius: 2, p: 1 }}
                        >
                          {p.image && (
                            <Avatar
                              src={p.image}
                              alt={p.name}
                              sx={{
                                width: 28,
                                height: 28,
                                border: "1px solid #ddd",
                                flex: "0 0 auto",
                              }}
                            />
                          )}
                          <Box sx={{ minWidth: 0 }}>
                            <Tooltip
                              title={`${p.name} • ${p.weight || 2} kg × ${
                                p.quantity
                              }`}
                              arrow
                            >
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={ellipsisSx}
                              >
                                {p.name}
                              </Typography>
                            </Tooltip>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {p.weight || 2} kg × {p.quantity}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </TableCell>

                    {/* 💳 Phương thức */}
                    <TableCell>
                      <Chip
                        label={
                          o.paymentMethod === "cod" ? "COD" : "Chuyển khoản"
                        }
                        size="small"
                        color={o.paymentMethod === "cod" ? "default" : "info"}
                      />
                    </TableCell>

                    {/* 🚚 Trạng thái hiện tại */}
                    <TableCell>
                      <Chip
                        icon={STATUS_ICON[o.status]}
                        label={STATUS_LABEL[o.status] || o.status}
                        color={STATUS_COLOR[o.status] || "default"}
                        size="small"
                        variant="filled"
                      />
                    </TableCell>

                    {/* 🏠 Địa chỉ */}
                    <TableCell>
                      <Tooltip title={o.address || ""} arrow>
                        <Typography variant="body2" sx={addressEllipsisSx}>
                          {o.address || "—"}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {/* ⚖️ Khối lượng */}
                    <TableCell>
                      <Typography fontWeight="bold">
                        {totalWeight} kg
                      </Typography>
                    </TableCell>

                    {/* 💰 Tổng tiền */}
                    <TableCell
                      sx={{ fontWeight: "bold", color: "success.main" }}
                    >
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

                    {/* 🛠 Hành động (đẹp & thẳng hàng) */}
                    <TableCell
                      sx={{
                        pr: 2,
                        verticalAlign: "middle",
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.25}
                        justifyContent="flex-start"
                        flexWrap="wrap"
                        sx={{
                          "& .MuiFormControl-root": { minWidth: 210 },
                          "& .MuiSelect-select": { py: 0.75 }, // nén padding Select
                          "& .MuiButtonGroup-root button": { height: 36 },
                          "& .MuiButton-root": { textTransform: "none" },
                        }}
                      >
                        {/* Select trạng thái render Chip + icon */}
                        <FormControl size="small">
                          <InputLabel id={`status-${o._id}`}>
                            Trạng thái
                          </InputLabel>
                          <Select
                            labelId={`status-${o._id}`}
                            label="Trạng thái"
                            value={o.status}
                            onChange={(e) =>
                              handleChangeStatus(o._id, e.target.value)
                            }
                            disabled={
                              updatingId === o._id || nexts.length === 0
                            }
                            renderValue={(val) => (
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                sx={{ minHeight: 24 }}
                              >
                                <Chip
                                  icon={STATUS_ICON[val]}
                                  label={STATUS_LABEL[val]}
                                  color={STATUS_COLOR[val]}
                                  size="small"
                                />
                              </Box>
                            )}
                            MenuProps={{ PaperProps: { sx: { mt: 1 } } }}
                          >
                            <MenuItem value={o.status} disabled>
                              <Chip
                                icon={STATUS_ICON[o.status]}
                                label={`Hiện tại: ${STATUS_LABEL[o.status]}`}
                                size="small"
                              />
                            </MenuItem>
                            {nexts.map((s) => (
                              <MenuItem key={s} value={s}>
                                <Chip
                                  icon={STATUS_ICON[s]}
                                  label={STATUS_LABEL[s]}
                                  color={STATUS_COLOR[s]}
                                  size="small"
                                  variant="outlined"
                                />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        {/* Button group: Xem + Sửa */}
                        <ButtonGroup variant="outlined" size="small">
                          <Button
                            startIcon={<VisibilityIcon />}
                            onClick={() => openView(o)}
                          >
                            Xem đơn
                          </Button>
                          <Button
                            startIcon={<EditIcon />}
                            onClick={() => openEdit(o)}
                            disabled={!canEdit(o.status)}
                          >
                            Chỉnh sửa
                          </Button>
                        </ButtonGroup>

                        {/* Gợi ý tiến bước nhanh (nếu chỉ có 1 next) */}
                        {nexts.length === 1 && (
                          <Button
                            size="small"
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => handleChangeStatus(o._id, nexts[0])}
                            disabled={updatingId === o._id}
                          >
                            Chuyển {STATUS_LABEL[nexts[0]]}
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </ZebraRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog xem đơn */}
      <Dialog
        open={!!viewOpen}
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        <DialogContent dividers>
          {viewData && (
            <Box>
              <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={2}>
                <Box flex={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Khách hàng
                  </Typography>
                  <Typography variant="body1">
                    {viewData.user?.name || "—"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {viewData.user?.email || "—"}
                  </Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Người nhận
                  </Typography>
                  <Typography variant="body1">
                    {viewData.name || "—"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {viewData.phone || "—"}
                  </Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Địa chỉ giao hàng
                  </Typography>
                  <Typography variant="body1">
                    {viewData.address || "—"}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.2} mb={2} flexWrap="wrap">
                <Chip
                  icon={STATUS_ICON[viewData.status]}
                  label={STATUS_LABEL[viewData.status]}
                  color={STATUS_COLOR[viewData.status]}
                />
                <Chip
                  label={
                    viewData.paymentMethod === "cod"
                      ? "COD (Khi nhận)"
                      : "Chuyển khoản"
                  }
                />
                <Chip
                  label={`Tổng tiền: ${viewData.totalPrice?.toLocaleString()} ₫`}
                />
                <Chip
                  label={`Khối lượng: ${viewData.products?.reduce(
                    (s, p) => s + (p.weight || 2) * p.quantity,
                    0
                  )} kg`}
                />
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Danh sách sản phẩm
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Khối lượng</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Đơn giá</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewData.products?.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.2}
                          alignItems="center"
                        >
                          {p.image && (
                            <Avatar
                              src={p.image}
                              alt={p.name}
                              sx={{ width: 28, height: 28 }}
                            />
                          )}
                          <Typography variant="body2">{p.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{p.weight || 2} kg</TableCell>
                      <TableCell>{p.quantity}</TableCell>
                      <TableCell>{(p.price ?? 0).toLocaleString()} ₫</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chỉnh sửa */}
      <Dialog
        open={editOpen}
        onClose={() => !saving && setEditOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Chỉnh sửa đơn hàng</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box display="grid" gap={2} mt={0.5}>
            <TextField
              label="Tên người nhận"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              size="small"
              fullWidth
            />
            <TextField
              label="Số điện thoại"
              value={editData.phone}
              onChange={(e) =>
                setEditData({ ...editData, phone: e.target.value })
              }
              size="small"
              fullWidth
              inputProps={{ pattern: "^[0-9+()\\-\\s]{6,20}$" }}
            />
            <TextField
              label="Địa chỉ giao hàng"
              value={editData.address}
              onChange={(e) =>
                setEditData({ ...editData, address: e.target.value })
              }
              size="small"
              fullWidth
              multiline
              minRows={2}
            />
            <FormControl size="small" fullWidth>
              <InputLabel id="pm-label">Phương thức thanh toán</InputLabel>
              <Select
                labelId="pm-label"
                label="Phương thức thanh toán"
                value={editData.paymentMethod}
                onChange={(e) =>
                  setEditData({ ...editData, paymentMethod: e.target.value })
                }
              >
                <MenuItem value="cod">COD (Khi nhận)</MenuItem>
                <MenuItem value="bank">Chuyển khoản</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={saving}>
            Hủy
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={saving}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default OrderTab;
