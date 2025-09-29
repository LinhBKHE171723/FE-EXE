// src/pages/Checkout.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { User, Phone, MapPin, CreditCard } from "lucide-react";
import "./../styles.css"; // import CSS chung

export default function Checkout({ onComplete }) {
  const { items } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "cod",
  });

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    onComplete(form.payment);
  };

  return (
    <div className="checkout-container">
      <h2>📝 Thông tin thanh toán</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        {/* Họ và tên */}
        <div className="form-group">
          <User className="form-icon" />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Họ và tên"
          />
        </div>

        {/* Số điện thoại */}
        <div className="form-group">
          <Phone className="form-icon" />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
          />
        </div>

        {/* Địa chỉ */}
        <div className="form-group">
          <MapPin className="form-icon" />
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Địa chỉ giao hàng"
          />
        </div>

        {/* Thanh toán */}
        <div className="form-group">
          <CreditCard className="form-icon" />
          <select name="payment" value={form.payment} onChange={handleChange}>
            <option value="cod">Thanh toán khi nhận hàng (COD)</option>
            <option value="bank">Chuyển khoản ngân hàng (QR)</option>
          </select>
        </div>

        <h3 className="checkout-total">
          Tổng cộng: <span>{total.toLocaleString()} VND</span>
        </h3>

        <button type="submit" className="checkout-btn">
          ✅ Xác nhận thanh toán
        </button>
      </form>
    </div>
  );
}
