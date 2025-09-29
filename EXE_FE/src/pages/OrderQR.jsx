import { useCart } from "../context/CartContext";

export default function OrderQR({ onPaid }) {
  const { items, clear } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePaid = () => {
    clear(); // ✅ clear giỏ hàng
    onPaid(); // ✅ báo về App.jsx đổi sang màn OrderSuccess
  };

  return (
    <div className="qr-page">
      <div className="qr-card">
        <div className="qr-icon">💳</div>
        <h2>Thanh toán bằng QR Code</h2>
        <p>Vui lòng quét mã QR dưới đây để hoàn tất thanh toán:</p>

        <img
          src="/images/qrbank.jpg"
          alt="QR chuyển khoản"
          className="qr-image"
        />

        <div className="qr-info">
          <p>
            <b>Nội dung chuyển khoản:</b> Thanh toán đơn hàng #123
          </p>
          <p>
            <b>Số tiền:</b>{" "}
            <span className="total-price">{total.toLocaleString()} VND</span>
          </p>
        </div>

        <button className="success-btn" onClick={handlePaid}>
          ✅ Tôi đã thanh toán
        </button>
      </div>
    </div>
  );
}
