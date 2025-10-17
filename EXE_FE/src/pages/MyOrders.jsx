import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrdersByUser } from "../api/orders";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrdersByUser(user._id);
        setOrders(data);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) loadOrders();
  }, [user]);

  if (loading)
    return (
      <div className="orders-page loading">
        <div className="spinner" />
        <p>Đang tải đơn hàng...</p>
      </div>
    );

  if (!orders.length)
    return (
      <div className="orders-page empty">
        <i className="fas fa-box-open empty-icon" />
        <p>Bạn chưa có đơn hàng nào</p>
      </div>
    );

  return (
    <div className="orders-page">
      <h2 className="orders-title">
        <i className="fas fa-clipboard-list" /> Đơn hàng của tôi
      </h2>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span className="order-id">
                <strong>Mã:</strong> {order._id.slice(-6).toUpperCase()}
              </span>
              <span
                className={`order-status ${
                  order.status === "delivered"
                    ? "status-success"
                    : order.status === "pending"
                    ? "status-pending"
                    : "status-other"
                }`}
              >
                {order.status || "Đang xử lý"}
              </span>
            </div>

            <div className="order-info">
              <p>
                <i className="far fa-calendar-alt" />{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <i className="fas fa-money-bill-wave" />{" "}
                {order.totalPrice?.toLocaleString()} ₫
              </p>
              <p>
                <i className="fas fa-truck" />{" "}
                {order.paymentMethod === "cod"
                  ? "Thanh toán khi nhận hàng"
                  : "Chuyển khoản"}
              </p>
            </div>

            <div className="order-products">
              <strong>Sản phẩm:</strong>
              <ul>
                {order.products?.map((p, i) => (
                  <li key={i}>
                    <i className="fas fa-angle-right" />{" "}
                    {p.productId?.name || "Sản phẩm"} × {p.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
