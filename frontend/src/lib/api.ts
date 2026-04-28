import axios from "axios";
import { API_BASE } from "@/config/constants";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Enable cookies
});

export default api;
