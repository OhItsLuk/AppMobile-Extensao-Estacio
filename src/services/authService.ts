import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "../config/apiConfig";

const TOKEN_KEY = "@AuthToken";
const USER_KEY = "@AuthUser";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  // Função para testar conexão com a API
  testConnection: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.HEALTH);
      console.log("✅ Conexão com API estabelecida:", response.status);
      return true;
    } catch (error) {
      console.log("❌ Erro de conexão com API:", error);
      return false;
    }
  },
  signIn: async (email: string, password: string) => {
    try {
      // Endpoint: /api/auth/login
      // Body: { Email, Senha } conforme UsuarioLoginDto
      const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, {
        Email: email,
        Senha: password,
      });

      const { token } = response.data;

      await AsyncStorage.setItem(TOKEN_KEY, token);

      // Como não retorna dados do usuário, vamos criar um objeto básico
      const userData = {
        id: "user_id", // Será obtido do token ou outra chamada futuramente
        name: "Usuário", // Nome padrão por enquanto
        email: email,
      };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
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
