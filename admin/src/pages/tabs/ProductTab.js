import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Paper,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { motion } from "framer-motion";
import productApi from "../../api/productApi";
import { toast } from "react-toastify";

const ProductTab = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    stock: 0,
  });

  // 🧩 Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const res = await productApi.getAll();
      setProducts(res.data);
    } catch (err) {
      toast.error("Lỗi khi tải sản phẩm!");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🧩 Lọc sản phẩm theo từ khóa
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  // 🧩 Mở popup thêm mới
  const handleOpenAdd = () => {
    setEditId(null);
    setForm({
      name: "",
      price: "",
      description: "",
      image: "",
      category: "",
      stock: 0,
    });
    setOpen(true);
  };

  // 🧩 Mở popup sửa
  const handleOpenEdit = (product) => {
    setEditId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
      stock: product.stock,
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // 🧩 Submit form (Thêm hoặc Sửa)
  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      toast.warning("Tên và giá sản phẩm là bắt buộc!");
      return;
    }

    try {
      if (editId) {
        await productApi.update(editId, form);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await productApi.create(form);
        toast.success("Thêm sản phẩm thành công!");
      }
      setOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error("Lỗi khi lưu sản phẩm!");
    }
  };

  // 🧩 Xóa sản phẩm
  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa sản phẩm này?")) return;
    try {
      await productApi.delete(id);
      toast.success("Xóa sản phẩm thành công!");
      fetchProducts();
    } catch (err) {
      toast.error("Lỗi khi xóa sản phẩm!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
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
          <Typography variant="h5" fontWeight="bold">
            🛒 Quản lý sản phẩm ({filteredProducts.length})
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              size="small"
              placeholder="Tìm theo tên hoặc danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: "white", borderRadius: 2 }}
            />

            <Button
              variant="contained"
              onClick={handleOpenAdd}
              sx={{
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(90deg, #1565c0, #1e88e5)",
                },
              }}
            >
              + Thêm sản phẩm
            </Button>
          </Box>
        </Box>

        {/* 🔹 Bảng sản phẩm */}
        <Table>
          <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
            <TableRow>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Giá (₫)</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Tồn kho</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((p) => (
              <motion.tr
                key={p._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  backgroundColor: "#fff",
                  borderBottom: "1px solid #eee",
                }}
              >
                <TableCell>
                  {p.image ? (
                    <Avatar
                      src={p.image}
                      alt={p.name}
                      sx={{ width: 40, height: 40 }}
                    />
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.price.toLocaleString()}</TableCell>
                <TableCell>{p.category || "—"}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell sx={{ maxWidth: 250 }}>
                  {p.description || "—"}
                </TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => handleOpenEdit(p)}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Sửa
                  </Button>
                  <Button
                    color="error"
                    variant="outlined"
                    size="small"
                    onClick={() => handleDelete(p._id)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* 🔹 Popup thêm / sửa sản phẩm */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.3 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editId ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên sản phẩm"
            fullWidth
            margin="dense"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Giá"
            type="number"
            fullWidth
            margin="dense"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <TextField
            label="Danh mục"
            fullWidth
            margin="dense"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <TextField
            label="Tồn kho"
            type="number"
            fullWidth
            margin="dense"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <TextField
            label="Mô tả"
            multiline
            rows={3}
            fullWidth
            margin="dense"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            label="Link ảnh sản phẩm"
            fullWidth
            margin="dense"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />

          {/* Preview ảnh */}
          {form.image && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Avatar
                src={form.image}
                alt="preview"
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: 2,
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editId ? "Lưu thay đổi" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default ProductTab;
