import { request, setToken } from "./http";
export async function loginApi({ email, password }) {
  const res = await request("/auth/login", {
    method: "POST",
    data: { email, password },
  });
  if (res?.token) setToken(res.token);
  return res;
}
export async function registerApi({ name, email, phone, password }) {
  const res = await request("/auth/register", {
    method: "POST",
    data: { name, email, phone, password },
  });
  if (res?.token) setToken(res.token);
  return res;
}
// hàm đăng nhập với Google OAuth
export async function googleLoginApi({ token }) {
  const res = await request("/auth/google-login", {
    method: "POST",
    data: { token }, // token Google gửi lên từ frontend
  });
  if (res?.token) setToken(res.token);
  return res;
}
