import { request } from "./http";

// 🧾 Lấy danh sách đơn hàng của người dùng
export const getOrdersByUser = (userId) =>
  request(`/api/orders/user/${userId}`);

// 🛒 Tạo đơn hàng mới
export const createOrder = (orderData) =>
  request("/api/orders", {
    method: "POST",
    data: orderData,
  });
