import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useUi } from "../context/UiContext";

export default function Header({ onNavigate }) {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { setCurrentSection, setShowAuth } = useUi();
  const [open, setOpen] = useState(false);

  // Điều hướng đến các trang khác
  const go = (section) => {
    setOpen(false);
    setCurrentSection(section);
    if (section === "products") {
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    onNavigate(section); // Gọi hàm điều hướng từ App.jsx
  };

  // Hàm điều hướng khi bấm vào giỏ hàng
  const goToCart = () => {
    onNavigate("cart"); // Chuyển trang giỏ hàng khi bấm vào biểu tượng giỏ hàng
  };

  return (
    <header className="header">
      <nav className="nav">
        <a
          href="#"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            go("home");
          }}
        >
          <img src="/images/logo.jpg" alt="Supper Rice" className="logo-img" />
          <span className="logo-text">Super Rice</span>
        </a>

        <ul className={`nav-menu ${open ? "open" : ""}`}>
          <li>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                go("home");
              }}
            >
              Trang chủ
            </a>
          </li>
          <li>
            <a
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                go("products");
              }}
            >
              Sản phẩm
            </a>
          </li>
          <li>
            <a
              href="#blog"
              onClick={(e) => {
                e.preventDefault();
                go("blog");
              }}
            >
              Blog
            </a>
          </li>
          <li>
            <a
              href="#policy"
              onClick={(e) => {
                e.preventDefault();
                go("policy");
              }}
            >
              Chính sách
            </a>
          </li>
          <li>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go("contact");
              }}
            >
              Liên hệ
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          {user ? (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span>
                Xin chào, <strong>{user.name || user.email}</strong>
              </span>
              <button className="login-btn" onClick={logout}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={() => setShowAuth(true)}>
              <i className="fas fa-user" /> Đăng nhập
            </button>
          )}

          {/* Giỏ hàng - Điều hướng đến trang giỏ hàng */}
          <button
            className="cart-icon"
            aria-label="Giỏ hàng"
            onClick={goToCart} // Điều hướng đến giỏ hàng
          >
            <i className="fas fa-shopping-cart" />
            <span className="cart-count">{items.length}</span>
          </button>

          <button
            className="hamburger"
            aria-label="Mở menu"
            onClick={() => setOpen((v) => !v)}
          >
            <i className="fas fa-bars" />
          </button>
        </div>
      </nav>
    </header>
  );
}
