import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { request } from "../api/http";
import { useUi } from "../context/UiContext";
import { useAuth } from "../context/AuthContext";
import { getProducts } from "../api/products"; // ✅ import hàm lấy sản phẩm

export default function SubscribeForm() {
  const { notify } = useUi();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    rice: "",
    weight: "5kg",
    frequency: "weekly",
    startDate: "",
    note: "",
  });

  // 🔄 Lấy danh sách sản phẩm từ DB khi component mount
  useEffect(() => {
    getProducts()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.items || [];
        setProducts(list);
        if (list.length > 0) {
          setForm((f) => ({ ...f, rice: list[0].name }));
        }
      })
      .catch((err) => {
        notify("❌ Không thể tải danh sách gạo: " + err.message);
      });
  }, []);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      notify("⚠️ Bạn cần đăng nhập để đăng ký giao gạo định kỳ!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        userId: user._id,
        email: user.email,
      };

      await request("/api/subscriptions", {
        method: "POST",
        data: payload,
      });

      notify("🎉 Đã đăng ký giao gạo định kỳ thành công!");
      setForm({
        name: "",
        phone: "",
        address: "",
        rice: products[0]?.name || "",
        weight: "5kg",
        frequency: "weekly",
        startDate: "",
        note: "",
      });
    } catch (err) {
      notify("❌ Có lỗi khi gửi đăng ký: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-content" id="subscribe">
      <h2 className="section-title text-center">Đặt giao gạo định kỳ</h2>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          padding: "2rem",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,.08)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "16px",
          }}
        >
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            required
            placeholder="Họ và tên"
            className="form-input"
            style={inputStyle}
          />
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            required
            placeholder="Số điện thoại"
            className="form-input"
            style={inputStyle}
          />
          <input
            name="address"
            value={form.address}
            onChange={onChange}
            required
            placeholder="Địa chỉ giao"
            className="form-input"
            style={{ ...inputStyle, gridColumn: "1/-1" }}
          />

          {/* 🧱 Danh sách gạo chỉ hiển thị tên */}
          <select
            name="rice"
            value={form.rice}
            onChange={onChange}
            className="form-input"
            style={inputStyle}
            required
          >
            {products.length === 0 ? (
              <option disabled>Đang tải danh sách gạo...</option>
            ) : (
              products.map((p) => (
                <option key={p._id} value={p.name}>
                  {p.name}
                </option>
              ))
            )}
          </select>

          <select
            name="weight"
            value={form.weight}
            onChange={onChange}
            className="form-input"
            style={inputStyle}
          >
            <option>2kg</option>
            <option>5kg</option>
            <option>10kg</option>
            <option>25kg</option>
          </select>

          <select
            name="frequency"
            value={form.frequency}
            onChange={onChange}
            className="form-input"
            style={inputStyle}
          >
            <option value="weekly">Hàng tuần</option>
            <option value="biweekly">2 tuần/lần</option>
            <option value="monthly">Hàng tháng</option>
          </select>

          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={onChange}
            required
            className="form-input"
            style={inputStyle}
          />

          <textarea
            name="note"
            value={form.note}
            onChange={onChange}
            placeholder="Ghi chú (tuỳ chọn)"
            className="form-input"
            style={{ ...inputStyle, gridColumn: "1/-1", minHeight: 80 }}
          />
        </div>

        <motion.button
          type="submit"
          className="auth-btn"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "0.9rem",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(90deg, #4caf50, #f9a825)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: "0 6px 16px rgba(0,0,0,.15)",
            transition: "all .3s ease",
          }}
        >
          {loading ? "Đang gửi..." : "Đăng ký ngay"}
        </motion.button>
      </motion.form>
    </section>
  );
}

const inputStyle = {
  padding: "0.75rem 1rem",
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: "0.95rem",
  outline: "none",
  transition: "all .3s ease",
};
