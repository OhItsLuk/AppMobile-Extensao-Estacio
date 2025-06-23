import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./authService";

export type Product = {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

type CreateProductData = {
  name: string;
  description?: string;
  quantity: number;
};

type UpdateProductData = {
  name?: string;
  description?: string;
  quantity?: number;
};

const PRODUCTS_KEY = "@Products";

export const productService = {
  // CONFIGURAÇÃO ATUAL: AsyncStorage (dados locais)
  // FUTURA: API calls para http://localhost:5136
  // Para ativar API, descomente as funções com sufixo API e comente as atuais
  getProducts: async (): Promise<Product[]> => {
    try {
      const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
      return productsJson ? JSON.parse(productsJson) : [];
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  },

  createProduct: async (productData: CreateProductData): Promise<Product> => {
    try {
      const products = await productService.getProducts();
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productData.name,
        description: productData.description,
        quantity: productData.quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProducts = [...products, newProduct];
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));

      return newProduct;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  },

  updateProduct: async (
    id: string,
    productData: UpdateProductData
  ): Promise<Product> => {
    try {
      const products = await productService.getProducts();
      const productIndex = products.findIndex((p) => p.id === id);

      if (productIndex === -1) {
        throw new Error("Produto não encontrado");
      }

      const updatedProduct: Product = {
        ...products[productIndex],
        ...productData,
        updatedAt: new Date(),
      };

      products[productIndex] = updatedProduct;
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

      return updatedProduct;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      const products = await productService.getProducts();
      const filteredProducts = products.filter((p) => p.id !== id);

      await AsyncStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(filteredProducts)
      );
      return true;
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      return false;
    }
  },

  updateQuantity: async (id: string, quantity: number): Promise<Product> => {
    return await productService.updateProduct(id, { quantity });
  },

  // ==================== VERSÕES PARA API ====================
  // Descomente quando migrar para API do servidor

  /*
  getProductsAPI: async (): Promise<Product[]> => {
    try {
      const response = await api.get("/api/products");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produtos da API:", error);
      return [];
    }
  },

  createProductAPI: async (productData: CreateProductData): Promise<Product> => {
    try {
      const response = await api.post("/api/products", productData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar produto na API:", error);
      throw error;
    }
  },

  updateProductAPI: async (id: string, productData: UpdateProductData): Promise<Product> => {
    try {
      const response = await api.put(`/api/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar produto na API:", error);
      throw error;
    }
  },

  deleteProductAPI: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/api/products/${id}`);
      return true;
    } catch (error) {
      console.error("Erro ao deletar produto na API:", error);
      return false;
    }
  },
  */
};
