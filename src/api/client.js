import axios from "axios";
import { API_URL } from "../config";

const client = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

const isPublicRead = (config) =>
  (config.method ?? "get").toLowerCase() === "get" &&
  /^\/(products|categories)/.test(config.url ?? "");

// Attach the JWT, except on public storefront reads (a stale token must not break browsing).
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !isPublicRead(config)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
