import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useUi } from "../context/UiContext";

export default function Header({ onNavigate }) {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { setCurrentSection, setShowAuth } = useUi();

  const [menuOpen, setMenuOpen] = useState(false); // menu chính
  const [userOpen, setUserOpen] = useState(false); // menu user

  // Điều hướng
  const go = (section) => {
    setMenuOpen(false);
    setCurrentSection(section);
    if (section === "products") {
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    onNavigate(section);
  };

  const goToCart = () => onNavigate("cart");
  const goToOrders = () => {
    setUserOpen(false);
    onNavigate("orders"); // 👈 link đến trang đơn hàng
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

        {/* menu chính */}
        <ul className={`nav-menu ${menuOpen ? "open" : ""}`}>
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
          {/* user */}
          {user ? (
            <div className="user-menu-container">
              <div
                className="user-info"
                onClick={() => setUserOpen((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <i
                  className="fas fa-user-circle"
                  style={{ fontSize: "1.6rem", color: "#555" }}
                />
                <span className="user-name">
                  Xin chào, {user.name || user.email}
                </span>
              </div>

              {userOpen && (
                <div
                  className="user-dropdown"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    background: "#fff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    borderRadius: "8px",
                    padding: "8px 0",
                    zIndex: 10,
                  }}
                >
                  <button
                    onClick={goToOrders}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      color: "#333",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <i
                      className="fas fa-box"
                      style={{ marginRight: "6px", color: "#ff8008" }}
                    />{" "}
                    Đơn hàng của tôi
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setUserOpen(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      color: "#333",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <i
                      className="fas fa-sign-out-alt"
                      style={{ marginRight: "6px", color: "#d33" }}
                    />{" "}
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={() => setShowAuth(true)}>
              <i className="fas fa-user" /> Đăng nhập
            </button>
          )}

          {/* giỏ hàng */}
          <button
            className="cart-icon"
            aria-label="Giỏ hàng"
            onClick={goToCart}
          >
            <i className="fas fa-shopping-cart" />
            <span className="cart-count">{items.length}</span>
          </button>

          {/* hamburger */}
          <button
            className="hamburger"
            aria-label="Mở menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <i className="fas fa-bars" />
          </button>
        </div>
      </nav>
    </header>
  );
}
