import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "../config/apiConfig";

const TOKEN_KEY = "@AuthToken";
const USER_KEY = "@AuthUser";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.DEFAULT_HEADERS,
  timeout: 10000, // 10 segundos timeout
});

api.interceptors.request.use(
  async (config) => {
    console.log("🔍 REQUEST:", {
      url: config.baseURL + config.url,
      method: config.method?.toUpperCase(),
      headers: config.headers,
      data: config.data,
    });

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
    console.log("✅ RESPONSE:", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    console.log("❌ RESPONSE ERROR:", {
      message: error.message,
      code: error.code,
      config: error.config,
      response: error.response,
    });
    return Promise.reject(error);
  }
);

export const authService = {
  // Função para testar diferentes endpoints
  testConnection: async () => {
    const tests = [
      { name: "Health Check", url: API_CONFIG.ENDPOINTS.HEALTH },
      { name: "Base URL", url: "/" },
      {
        name: "Login Endpoint",
        url: API_CONFIG.ENDPOINTS.LOGIN,
        method: "POST",
      },
    ];

    console.log("🔍 Iniciando testes de conexão...");

    for (const test of tests) {
      try {
        console.log(`Testing ${test.name}: ${API_CONFIG.BASE_URL}${test.url}`);

        if (test.method === "POST") {
          await api.post(test.url, {}, { timeout: 5000 });
        } else {
          await api.get(test.url, { timeout: 5000 });
        }

        console.log(`✅ ${test.name}: SUCCESS`);
        return true;
      } catch (error) {
        console.log(`❌ ${test.name}: FAILED`);
        console.log("Error details:", {
          message: error.message,
          code: error.code,
          stack: error.stack,
        });
      }
    }

    return false;
  },

  // Teste com fetch nativo (alternativa ao axios)
  testWithFetch: async () => {
    try {
      console.log("🔍 Testando com fetch nativo...");
      const url = `${API_CONFIG.BASE_URL}/health`;
      console.log("URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Fetch response:", {
        status: response.status,
        ok: response.ok,
        headers: response.headers,
      });

      return response.ok;
    } catch (error) {
      console.log("❌ Fetch error:", error);
      return false;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      console.log("🔐 Tentando fazer login...");
      console.log(
        "URL completa:",
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`
      );
      console.log("Dados enviados:", { Email: email, Senha: "***" });

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

      console.log("✅ Login realizado com sucesso!");
      return true;
    } catch (error) {
      console.error("❌ Erro ao fazer login:", error);

      if (error.response) {
        console.error("Response Error Details:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else if (error.request) {
        console.error("Request Error Details:", {
          request: error.request,
          message: error.message,
          code: error.code,
        });
      } else {
        console.error("General Error:", error.message);
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
