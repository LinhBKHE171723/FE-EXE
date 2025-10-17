import axiosClient from "./axiosClient";

const orderApi = {
  getAll: () => axiosClient.get("/orders"),
  getTotalRevenue: async () => {
    const res = await axiosClient.get("/orders");
    const total = res.data.reduce((sum, order) => sum + order.totalPrice, 0);
    return total;
  },
};

export default orderApi;
