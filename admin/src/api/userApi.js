import axiosClient from "./axiosClient";

const userApi = {
  getAll: () => axiosClient.get("/users"),
};

export default userApi;
