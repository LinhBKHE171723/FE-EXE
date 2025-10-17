import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { Scale } from "lucide-react";
import "./../styles.css"; // nhớ đảm bảo có file styles.css

export default function Cart({ onCheckout }) {
  const { items, removeItem, clear, updateItem } = useCart();

  const [weights, setWeights] = useState({});

  useEffect(() => {
    const initWeights = {};
    items.forEach((item) => {
      initWeights[item.id] = weights[item.id] || 2;
    });
    setWeights(initWeights);
  }, [items]);

  const handleWeightChange = (item, weight) => {
    const newWeight = Number(weight);
    setWeights({ ...weights, [item.id]: newWeight });
    updateItem({
      ...item,
      weight: newWeight,
      totalPrice: item.price * newWeight,
    });
  };

  const total = items.reduce((sum, item) => {
    const w = weights[item.id] || 2;
    return sum + item.price * w;
  }, 0);

  return (
    <div className="cart-page">
      <h2>🛒 Giỏ hàng của bạn</h2>

      {items.length === 0 ? (
        <p>Giỏ hàng của bạn hiện tại không có sản phẩm nào.</p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p className="price">
                    Giá mỗi kg: {item.price.toLocaleString()} VND
                  </p>

                  {/* ⚖️ Giao diện chọn khối lượng đẹp hơn */}
                  <div className="weight-container">
                    <div className="weight-label">
                      <Scale size={20} /> <span>Chọn khối lượng:</span>
                    </div>

                    <div className="weight-options">
                      {[2, 5, 10].map((w) => (
                        <button
                          key={w}
                          type="button"
                          className={`weight-btn ${
                            weights[item.id] === w ? "active" : ""
                          }`}
                          onClick={() => handleWeightChange(item, w)}
                        >
                          {w} kg
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="cart-item-controls">
                    <span className="subtotal">
                      Thành tiền:{" "}
                      <strong>
                        {(
                          item.price * (weights[item.id] || 2)
                        ).toLocaleString()}{" "}
                        VND
                      </strong>
                    </span>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item)}
                    >
                      ❌ Xóa
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <h3>
              Tổng cộng phải trả:{" "}
              <span className="total-price">{total.toLocaleString()} VND</span>
            </h3>
            <div className="cart-summary-actions">
              <button className="clear-btn" onClick={clear}>
                🗑️ Xóa toàn bộ
              </button>
              <button
                className="checkout-btn"
                onClick={() => onCheckout(weights)}
              >
                💳 Thanh toán
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
