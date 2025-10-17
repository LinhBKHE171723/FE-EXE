import { request } from "./http";
export const getProducts = () => request("/api/products");
