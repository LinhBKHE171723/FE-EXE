// src/pages/OrderSuccess.jsx
import { useEffect } from "react";
import { useCart } from "../context/CartContext";
export default function OrderSuccess() {
  const { clear } = useCart();

  useEffect(() => {
    clear(); // ✅ chỉ clear khi đã thành công
  }, []);
  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">🎉</div>
        <h2>Đặt hàng thành công. Chờ xác nhận của chúng tôi!</h2>
        <p>Cảm ơn bạn đã mua hàng</p>
        <button
          className="success-btn"
          onClick={() => (window.location.href = "/")}
        >
          🏠 Quay về Trang chủ
        </button>
      </div>
    </div>
  );
}
