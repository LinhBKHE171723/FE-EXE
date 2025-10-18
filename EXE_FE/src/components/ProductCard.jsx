import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useUi } from "../context/UiContext";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const { user, setPoints } = useAuth();
  const { notify } = useUi();

  const addToCart = () => {
    if (!user) {
      notify("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    add(product);
    const points = Math.floor(Math.random() * 20) + 10;
    setPoints((p) => p + points);
    notify(`Đã thêm ${product.name} vào giỏ! +${points} Hạt Vàng`);
  };

  return (
    <div
      className="product-card"
      style={{
        borderRadius: "16px",
        padding: "1rem",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      <div
        className="product-image"
        style={{
          height: "180px",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "0.75rem",
        }}
      >
        {product.imageUrl || product.image ? (
          <img
            src={product.imageUrl || product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          "🌾"
        )}
      </div>

      <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>{product.name}</h3>
      <div
        style={{
          color: "#e67e22",
          fontWeight: 700,
          marginBottom: "1rem",
          fontSize: "1rem",
        }}
      >
        {product.price.toLocaleString()}₫/KG
      </div>

      <button
        className="add-to-cart"
        onClick={addToCart}
        style={{
          padding: "0.6rem 1.2rem",
          borderRadius: "8px",
          border: "none",
          background: "#e67e22",
          color: "#fff",
          fontWeight: 600,
          fontSize: "0.95rem",
          cursor: "pointer",
        }}
      >
        🛒 Thêm vào giỏ
      </button>
    </div>
  );
}
