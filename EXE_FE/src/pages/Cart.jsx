// src/pages/Cart.jsx
import { useCart } from "../context/CartContext";

export default function Cart({ onCheckout }) {
  const { items, updateItemQuantity, removeItem, clear } = useCart();

  // Tính tổng tiền
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
                    Giá: {item.price.toLocaleString()} VND
                  </p>
                  <div className="cart-item-controls">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateItemQuantity(item, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="qty">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateItemQuantity(item, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <span className="subtotal">
                      = {(item.price * item.quantity).toLocaleString()} VND
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
                onClick={onCheckout} // 👉 chuyển sang checkout
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
