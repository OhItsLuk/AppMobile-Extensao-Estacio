// Configurações da API
export const API_CONFIG = {
  // URL base da API
  BASE_URL: "http://10.0.2.2:5136",

  // Endpoints
  ENDPOINTS: {
    // Autenticação
    LOGIN: "/api/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",

    // Produtos (para futura integração)
    PRODUCTS: "/api/products",
    PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,

    // Health check
    HEALTH: "/health",
  },

  // Headers padrão
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },

  // Configurações de desenvolvimento
  DEV: {
    ENABLE_LOGS: true,
    MOCK_DATA: false, // Se true, usa dados locais mesmo com API
  },
};
