import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "../config/apiConfig";

const TOKEN_KEY = "@AuthToken";
const USER_KEY = "@AuthUser";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.DEFAULT_HEADERS,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    if (API_CONFIG.DEV.ENABLE_LOGS) {
      console.log("🔍 REQUEST:", {
        url: config.baseURL + config.url,
        method: config.method?.toUpperCase(),
        data: config.data,
      });
    }

    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (API_CONFIG.DEV.ENABLE_LOGS) {
      console.log("✅ RESPONSE:", {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    console.log("❌ RESPONSE ERROR:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export const authService = {
  signIn: async (email: string, password: string) => {
    try {
      console.log("🔐 Realizando login...");

      const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, {
        Email: email,
        Senha: password,
      });

      const { token } = response.data;

      await AsyncStorage.setItem(TOKEN_KEY, token);

      const userData = {
        id: "user_id",
        name: "Usuário",
        email: email,
      };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

      console.log("✅ Login realizado com sucesso!");
      return true;
    } catch (error) {
      console.error("❌ Erro ao fazer login:", error);

      if (error.response) {
        console.error("Response Error Details:", {
          status: error.response.status,
          data: error.response.data,
        });
      }

      return false;
    }
  },

  signOut: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      return true;
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      return false;
    }
  },

  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  getCurrentUser: async () => {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  getToken: async () => {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },
};

export default api;
