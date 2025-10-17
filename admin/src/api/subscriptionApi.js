import axiosClient from "./axiosClient";

const subscriptionApi = {
  getAll: () => axiosClient.get("/subscriptions"),
};

export default subscriptionApi;
