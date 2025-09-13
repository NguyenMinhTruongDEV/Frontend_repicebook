import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const API_BASE =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080/api"          // Android Emulator
    : "http://192.168.1.100:8080/api";    // Đổi sang IP LAN khi chạy máy thật


const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});


// 🔑 Interceptor: tự động gắn token
axiosInstance.interceptors.request.use(async (config) => {
  // 1️⃣ Gắn token nếu có
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.log("Token load error:", err);
  }

  // 2️⃣ Tự động set Content-Type dựa trên dữ liệu
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default axiosInstance;
