import axiosClient from "./axiosClient";

const orderApi = {
  getAll: () => axiosClient.get("/orders"),
  getTotalRevenue: async () => {
    const res = await axiosClient.get("/orders");
    const total = res.data.reduce((sum, order) => sum + order.totalPrice, 0);
    return total;
  },
  updateStatus: (orderId, status) =>
    axiosClient.patch(`/orders/${orderId}/status`, { status }),
  update: (orderId, payload) =>
    axiosClient.patch(`/orders/${orderId}`, payload),
  delete: (orderId) => axiosClient.delete(`/orders/${orderId}`),
};

export default orderApi;
