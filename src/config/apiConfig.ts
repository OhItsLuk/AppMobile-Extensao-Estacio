// Configurações da API
export const API_CONFIG = {
  // Para teste, use um endpoint público
  // BASE_URL: "https://jsonplaceholder.typicode.com",

  // Seu backend local
  BASE_URL: "http://10.0.2.2:5136",

  // Endpoints
  ENDPOINTS: {
    // Autenticação
    LOGIN: "/api/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",

    // Produtos
    PRODUCTS: "/api/produtos",
    PRODUCTS_CREATE: "/api/Produtos",
    PRODUCT_BY_ID: (id: string) => `/api/produtos/${id}`,
    PRODUCT_UPDATE: (id: string) => `/api/produtos/${id}`,
    PRODUCT_DELETE: (id: string) => `/api/produtos/${id}`,

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
    USE_API: true, // Se false, usa apenas AsyncStorage
  },

  // Configurações de paginação
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 50, // Aumentado para pegar mais produtos por padrão
    MAX_PAGE_SIZE: 100,
  },
};
