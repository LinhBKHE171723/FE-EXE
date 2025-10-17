import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/orders";
import { User, Phone, MapPin, CreditCard, Package } from "lucide-react";
import "./../styles.css";

export default function Checkout({ onComplete }) {
  const { items, clear: clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "cod",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Tổng tiền có tính theo khối lượng
  const total = items.reduce(
    (sum, item) => sum + item.price * (item.weight || 2) * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    if (!user?._id) {
      alert("⚠️ Vui lòng đăng nhập trước khi đặt hàng!");
      return;
    }

    setLoading(true);

    try {
      // 🧾 Dữ liệu đơn hàng đầy đủ
      const orderData = {
        userId: user._id,
        name: form.name,
        phone: form.phone,
        address: form.address,
        paymentMethod: form.payment,
        status: form.payment === "cod" ? "pending" : "waiting_payment",
        totalPrice: total,
        products: items.map((i) => ({
          productId: i._id,
          quantity: i.quantity,
          weight: i.weight || 2, // ✅ thêm khối lượng
          price: i.price * (i.weight || 2), // ✅ giá thực tế theo khối lượng
        })),
      };

      console.log("📤 Gửi orderData:", orderData);

      const newOrder = await createOrder(orderData);
      console.log("✅ Đơn hàng đã tạo:", newOrder);

      clearCart();

      if (form.payment === "cod") {
        alert("🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
        onComplete?.("cod");
      } else {
        onComplete?.("bank");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tạo đơn hàng:", err);
      alert("❌ Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>📝 Thông tin thanh toán</h2>

      {/* Danh sách sản phẩm trong đơn hàng */}
      {items.length > 0 && (
        <div className="checkout-products">
          <h3>📦 Sản phẩm trong giỏ hàng</h3>
          <ul>
            {items.map((item) => (
              <li key={item._id} className="checkout-product-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="checkout-product-img"
                />
                <div className="checkout-product-info">
                  <h4>{item.name}</h4>
                  <p>
                    <Package size={16} /> {item.weight || 2} kg ×{" "}
                    {item.quantity}
                  </p>
                  <p>
                    Giá:{" "}
                    <strong>
                      {(item.price * (item.weight || 2)).toLocaleString()} VND
                    </strong>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

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
            required
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
            required
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
            required
          />
        </div>

        {/* Phương thức thanh toán */}
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

        <button type="submit" className="checkout-btn" disabled={loading}>
          {loading ? "Đang xử lý..." : "✅ Xác nhận thanh toán"}
        </button>
      </form>
    </div>
  );
}
