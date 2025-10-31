import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrdersByUser } from "../api/orders";

/** ----- Status mapping ----- */
const STATUS_LABEL = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipped: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

const STATUS_CLASS = {
  pending: "chip chip-warning",
  confirmed: "chip chip-info",
  shipped: "chip chip-primary",
  completed: "chip chip-success",
  cancelled: "chip chip-muted",
};

/** Tiến trình 4 bước cho đơn thường (cancelled xử lý riêng) */
const STEPS = ["pending", "confirmed", "shipped", "completed"];
const stepIndex = (status) => {
  const idx = STEPS.indexOf(status);
  return idx === -1 ? 0 : idx;
};

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrdersByUser(user._id);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) loadOrders();
  }, [user]);

  const empty = useMemo(
    () => !loading && orders.length === 0,
    [loading, orders]
  );

  if (loading) {
    return (
      <div className="orders-page loading">
        <div className="spinner" />
        <p>Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="orders-page empty">
        <i className="fas fa-box-open empty-icon" />
        <p>Bạn chưa có đơn hàng nào</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2 className="orders-title">
        <i className="fas fa-clipboard-list" /> Đơn hàng của tôi
      </h2>

      <div className="orders-list">
        {orders.map((order) => {
          const code = order._id?.slice(-6)?.toUpperCase();
          const s = order.status || "pending";
          const products = order.products || [];
          const totalWeight = products.reduce(
            (sum, p) => sum + (p.weight || 0) * (p.quantity || 0),
            0
          );

          return (
            <div key={order._id} className="order-card">
              {/* Header */}
              <div className="order-header">
                <div className="order-id">
                  <strong>Mã:</strong> {code}
                </div>
                <div className={STATUS_CLASS[s] || "chip"}>
                  <i
                    className={
                      s === "completed"
                        ? "fas fa-check-circle"
                        : s === "shipped"
                        ? "fas fa-truck"
                        : s === "confirmed"
                        ? "fas fa-badge-check"
                        : s === "cancelled"
                        ? "fas fa-ban"
                        : "far fa-clock"
                    }
                  />
                  <span>{STATUS_LABEL[s] || s}</span>
                </div>
              </div>

              {/* Info grid */}
              <div className="order-info-grid">
                <div className="order-info-item">
                  <i className="far fa-calendar-alt" />
                  <div>
                    <div className="muted">Ngày đặt</div>
                    <div className="strong">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      {" • "}
                      <span className="muted">
                        {new Date(order.createdAt).toLocaleTimeString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-info-item">
                  <i className="fas fa-money-bill-wave" />
                  <div>
                    <div className="muted">Tổng tiền</div>
                    <div className="strong price">
                      {order.totalPrice?.toLocaleString()} ₫
                    </div>
                  </div>
                </div>

                <div className="order-info-item">
                  <i className="fas fa-wallet" />
                  <div>
                    <div className="muted">Thanh toán</div>
                    <div className="strong">
                      {order.paymentMethod === "bank"
                        ? "Chuyển khoản"
                        : "Thanh toán khi nhận hàng"}
                    </div>
                  </div>
                </div>

                <div className="order-info-item">
                  <i className="fas fa-weight-hanging" />
                  <div>
                    <div className="muted">Khối lượng</div>
                    <div className="strong">{totalWeight} kg</div>
                  </div>
                </div>

                {order.address && (
                  <div className="order-info-item address">
                    <i className="fas fa-map-marker-alt" />
                    <div>
                      <div className="muted">Địa chỉ giao hàng</div>
                      <div className="strong clamp-2">{order.address}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress (cancelled hiển thị riêng) */}
              <div className="order-progress">
                {s === "cancelled" ? (
                  <div className="cancelled-line">
                    <i className="fas fa-ban" /> Đơn hàng đã hủy
                  </div>
                ) : (
                  <ul className="stepper">
                    {STEPS.map((st, idx) => {
                      const active = idx <= stepIndex(s);
                      return (
                        <li
                          key={st}
                          className={`step ${active ? "active" : ""}`}
                        >
                          <div className="dot" />
                          <span className="label">{STATUS_LABEL[st]}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Products */}
              <div className="order-products">
                <div className="section-title">
                  <i className="fas fa-cubes" /> Sản phẩm
                </div>
                <ul className="product-list">
                  {products.map((p, i) => (
                    <li key={p.id || i} className="product-item">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name || "Sản phẩm"}
                          className="product-thumb"
                        />
                      ) : (
                        <div className="product-thumb placeholder">
                          <i className="far fa-image" />
                        </div>
                      )}
                      <div className="product-meta">
                        <div className="product-name clamp-1">
                          {p.name || "Sản phẩm"}
                        </div>
                        <div className="muted small">
                          {(p.weight || 0) + " kg"} × {p.quantity || 0}
                          {p.price != null && (
                            <>
                              {" • "}
                              {(p.price || 0).toLocaleString()} ₫
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
