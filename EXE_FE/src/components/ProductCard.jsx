import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useUi } from "../context/UiContext";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const { user, setPoints } = useAuth();
  const { notify } = useUi();

  const addToCart = () => {
    add(product);
    if (user) {
      const points = Math.floor(Math.random() * 20) + 10;
      setPoints((p) => p + points);
      notify(`Đã thêm ${product.name} vào giỏ! +${points} Hạt Vàng`);
    } else {
      notify(`Đã thêm ${product.name} vào giỏ hàng!`);
    }
  };
  console.log("🧱 ProductCard:", product);

  return (
    <div
      className="product-card"
      style={{
        borderRadius: "16px",
        padding: "1rem",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "transform .3s ease, box-shadow .3s ease",
        textAlign: "center",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
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
              transition: "transform .4s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.08)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        ) : (
          "🌾"
        )}
      </div>

      <h3
        className="product-name"
        style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "#333",
          marginBottom: "0.5rem",
        }}
      >
        {product.name}
      </h3>
      <div
        className="product-price"
        style={{
          color: "#e67e22",
          fontWeight: 700,
          marginBottom: "1rem",
          fontSize: "1rem",
        }}
      >
        {product.price}₫/KG
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
          transition: "background .3s ease, transform .2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#d35400";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#e67e22";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <i className="fas fa-shopping-cart" style={{ marginRight: "6px" }} />{" "}
        Thêm vào giỏ
      </button>
    </div>
  );
}
