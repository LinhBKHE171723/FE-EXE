import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useUi } from "../context/UiContext";

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login");
  const { login, register, loginWithGoogle } = useAuth(); // thêm hàm loginWithGoogle
  const { notify } = useUi();
  const [loading, setLoading] = useState(false);

  const close = () => onClose?.();

  const onGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      notify("Đăng nhập Google thành công!");
      close();
    } catch (err) {
      notify(`Đăng nhập Google thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay active" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>
          &times;
        </button>

        {mode === "login" ? (
          <div className="auth-form" id="loginForm">
            <h2>Đăng Nhập</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                const email = e.target.elements.email.value;
                const password = e.target.elements.password.value;
                try {
                  await login(email, password);
                  notify("Đăng nhập thành công!");
                  close();
                } catch (err) {
                  notify(`Đăng nhập thất bại: ${err.message}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div className="form-group">
                <input name="email" type="email" placeholder="Email" required />
                <i className="fas fa-envelope" />
              </div>
              <div className="form-group">
                <input
                  name="password"
                  type="password"
                  placeholder="Mật khẩu"
                  required
                />
                <i className="fas fa-lock" />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đăng Nhập"}
              </button>
            </form>

            {/* nút Google */}
            <button
              type="button"
              className="auth-btn google-btn"
              onClick={onGoogleLogin}
              disabled={loading}
            >
              <i className="fab fa-google" /> Đăng nhập với Google
            </button>

            <p className="auth-switch">
              Chưa có tài khoản?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("register");
                }}
              >
                Đăng ký ngay
              </a>
            </p>
          </div>
        ) : (
          // form register giữ nguyên
          <div className="auth-form" id="registerForm">
            <h2>Đăng Ký</h2>
            {/* ... */}
          </div>
        )}
      </div>
    </div>
  );
}
