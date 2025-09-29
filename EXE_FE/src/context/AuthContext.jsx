import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, registerApi, googleLoginApi } from "../api/auth";
import { setToken } from "../api/http";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("gaosach:user");
    return raw ? JSON.parse(raw) : null;
  });

  const [points, setPoints] = useState(() => {
    const raw = localStorage.getItem("gaosach:points");
    return raw ? Number(raw) : 1250;
  });

  // lưu user + points xuống localStorage
  useEffect(() => {
    localStorage.setItem("gaosach:user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("gaosach:points", String(points));
  }, [points]);

  // login thường
  const login = async (email, password) => {
    const { user: u, token } = await loginApi({ email, password });
    if (token) setToken(token);
    setUser(u);
    setPoints((p) => p + 10);
  };

  // đăng ký
  const register = async ({ name, email, phone, password }) => {
    const { user: u, token } = await registerApi({
      name,
      email,
      phone,
      password,
    });
    if (token) setToken(token);
    setUser(u);
    setPoints((p) => p + 100);
  };

  // đăng nhập với Google
  const loginWithGoogle = async (googleToken) => {
    // googleToken: token lấy từ Google OAuth client
    const { user: u, token } = await googleLoginApi({ token: googleToken });
    if (token) setToken(token);
    setUser(u);
    setPoints((p) => p + 50); // ví dụ thưởng 50 điểm khi login Google
  };

  // logout
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        points,
        setPoints,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
