import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./authService";
import { API_CONFIG } from "../config/apiConfig";

export type Product = {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

type CreateProductData = {
  name: string;
  description?: string;
  quantity: number;
  price: number;
};

type UpdateProductData = {
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
};

// DTO que corresponde ao backend para criação
type ProdutoCreateDto = {
  Nome: string;
  Descricao?: string;
  Estoque: number;
  Preco: number;
};

// DTO que corresponde ao backend para atualização
type ProdutoUpdateDto = {
  Nome: string;
  Descricao?: string;
  Estoque: number;
  Preco: number;
};

// Tipos para paginação
type PaginationParams = {
  page?: number;
  pageSize?: number;
};

const PRODUCTS_KEY = "@Products";

export const productService = {
  // Função para decidir se usa API ou AsyncStorage
  useAPI: (): boolean => {
    return API_CONFIG.DEV.USE_API && !API_CONFIG.DEV.MOCK_DATA;
  },

  // BUSCAR PRODUTOS COM PAGINAÇÃO
  getProducts: async (params?: PaginationParams): Promise<Product[]> => {
    if (productService.useAPI()) {
      return await productService.getProductsAPI(params);
    } else {
      return await productService.getProductsLocal();
    }
  },

  // Buscar todos os produtos
  getAllProducts: async (): Promise<Product[]> => {
    if (productService.useAPI()) {
      return await productService.getProductsAPI({
        page: 1,
        pageSize: API_CONFIG.PAGINATION.MAX_PAGE_SIZE,
      });
    } else {
      return await productService.getProductsLocal();
    }
  },

  getProductsLocal: async (): Promise<Product[]> => {
    try {
      const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
      return productsJson ? JSON.parse(productsJson) : [];
    } catch (error) {
      console.error("Erro ao buscar produtos locais:", error);
      return [];
    }
  },

  getProductsAPI: async (params?: PaginationParams): Promise<Product[]> => {
    try {
      console.log("🔍 Buscando produtos da API...");

      const queryParams = new URLSearchParams();
      const page = params?.page || API_CONFIG.PAGINATION.DEFAULT_PAGE;
      const pageSize =
        params?.pageSize || API_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;

      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const url = `${API_CONFIG.ENDPOINTS.PRODUCTS}?${queryParams.toString()}`;
      const response = await api.get(url);

      let apiProducts = [];
      if (Array.isArray(response.data)) {
        apiProducts = response.data;
      } else if (response.data.items) {
        apiProducts = response.data.items;
      } else {
        console.warn("⚠️ Formato de resposta inesperado:", response.data);
        apiProducts = [];
      }

      const products = apiProducts.map((item: any) => ({
        id: item.id.toString(),
        name: item.nome,
        description: item.descricao,
        quantity: item.estoque,
        price: item.preco,
        createdAt: new Date(item.createdAt || Date.now()),
        updatedAt: new Date(item.updatedAt || Date.now()),
      }));

      console.log("✅ Produtos carregados:", products.length);
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

      return products;
    } catch (error) {
      console.error("❌ Erro ao buscar produtos da API:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }

      console.log("📱 Usando dados locais como fallback...");
      return await productService.getProductsLocal();
    }
  },

  // CRIAR PRODUTO
  createProduct: async (productData: CreateProductData): Promise<Product> => {
    if (productService.useAPI()) {
      return await productService.createProductAPI(productData);
    } else {
      return await productService.createProductLocal(productData);
    }
  },

  createProductLocal: async (
    productData: CreateProductData
  ): Promise<Product> => {
    try {
      const products = await productService.getProductsLocal();
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productData.name,
        description: productData.description,
        quantity: productData.quantity,
        price: productData.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProducts = [...products, newProduct];
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));

      return newProduct;
    } catch (error) {
      console.error("Erro ao criar produto local:", error);
      throw error;
    }
  },

  createProductAPI: async (
    productData: CreateProductData
  ): Promise<Product> => {
    try {
      console.log("🔍 Criando produto na API...");

      const dto: ProdutoCreateDto = {
        Nome: productData.name,
        Descricao: productData.description,
        Estoque: productData.quantity,
        Preco: productData.price,
      };

      console.log("📤 Dados enviados:", dto);
      const response = await api.post(
        API_CONFIG.ENDPOINTS.PRODUCTS_CREATE,
        dto
      );

      const apiProduct = response.data;
      const newProduct: Product = {
        id: apiProduct.id.toString(),
        name: apiProduct.nome,
        description: apiProduct.descricao,
        quantity: apiProduct.estoque,
        price: apiProduct.preco,
        createdAt: new Date(apiProduct.createdAt || Date.now()),
        updatedAt: new Date(apiProduct.updatedAt || Date.now()),
      };

      console.log("✅ Produto criado na API:", newProduct);

      const localProducts = await productService.getProductsLocal();
      const updatedProducts = [...localProducts, newProduct];
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));

      return newProduct;
    } catch (error) {
      console.error("❌ Erro ao criar produto na API:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }

      console.log("📱 Criando produto localmente como fallback...");
      return await productService.createProductLocal(productData);
    }
  },

  // ATUALIZAR PRODUTO
  updateProduct: async (
    id: string,
    productData: UpdateProductData
  ): Promise<Product> => {
    if (productService.useAPI()) {
      return await productService.updateProductAPI(id, productData);
    } else {
      return await productService.updateProductLocal(id, productData);
    }
  },

  updateProductLocal: async (
    id: string,
    productData: UpdateProductData
  ): Promise<Product> => {
    try {
      const products = await productService.getProductsLocal();
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
      console.error("Erro ao atualizar produto local:", error);
      throw error;
    }
  },

  updateProductAPI: async (
    id: string,
    productData: UpdateProductData
  ): Promise<Product> => {
    try {
      console.log("🔍 Atualizando produto na API...", id);

      const currentProducts = await productService.getProductsLocal();
      const currentProduct = currentProducts.find((p) => p.id === id);

      if (!currentProduct) {
        throw new Error("Produto não encontrado no cache local");
      }

      const dto: ProdutoUpdateDto = {
        Nome: productData.name || currentProduct.name,
        Descricao:
          productData.description !== undefined
            ? productData.description
            : currentProduct.description,
        Estoque:
          productData.quantity !== undefined
            ? productData.quantity
            : currentProduct.quantity,
        Preco:
          productData.price !== undefined
            ? productData.price
            : currentProduct.price,
      };

      console.log("📤 Dados enviados para atualização:", dto);
      await api.put(API_CONFIG.ENDPOINTS.PRODUCT_UPDATE(id), dto);

      const updatedProduct: Product = {
        ...currentProduct,
        name: dto.Nome,
        description: dto.Descricao,
        quantity: dto.Estoque,
        price: dto.Preco,
        updatedAt: new Date(),
      };

      console.log("✅ Produto atualizado na API:", updatedProduct);

      const products = await productService.getProductsLocal();
      const productIndex = products.findIndex((p) => p.id === id);
      if (productIndex !== -1) {
        products[productIndex] = updatedProduct;
        await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      }

      return updatedProduct;
    } catch (error) {
      console.error("❌ Erro ao atualizar produto na API:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }

      console.log("📱 Atualizando produto localmente como fallback...");
      return await productService.updateProductLocal(id, productData);
    }
  },

  // DELETAR PRODUTO
  deleteProduct: async (id: string): Promise<boolean> => {
    if (productService.useAPI()) {
      return await productService.deleteProductAPI(id);
    } else {
      return await productService.deleteProductLocal(id);
    }
  },

  deleteProductLocal: async (id: string): Promise<boolean> => {
    try {
      const products = await productService.getProductsLocal();
      const filteredProducts = products.filter((p) => p.id !== id);

      await AsyncStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(filteredProducts)
      );
      return true;
    } catch (error) {
      console.error("Erro ao deletar produto local:", error);
      return false;
    }
  },

  deleteProductAPI: async (id: string): Promise<boolean> => {
    try {
      console.log("🔍 Realizando soft delete do produto na API...", id);

      const currentProducts = await productService.getProductsLocal();
      const productToDelete = currentProducts.find((p) => p.id === id);

      if (productToDelete) {
        console.log("📦 Produto a ser removido:", {
          id: productToDelete.id,
          name: productToDelete.name,
          quantity: productToDelete.quantity,
        });
      }

      await api.delete(API_CONFIG.ENDPOINTS.PRODUCT_DELETE(id));

      console.log("✅ Soft delete realizado na API");

      const products = await productService.getProductsLocal();
      const filteredProducts = products.filter((p) => p.id !== id);
      await AsyncStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(filteredProducts)
      );

      return true;
    } catch (error) {
      console.error("❌ Erro ao deletar produto na API:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);

        if (error.response.status === 404) {
          console.log(
            "⚠️ Produto não encontrado na API (pode já ter sido deletado)"
          );

          const products = await productService.getProductsLocal();
          const filteredProducts = products.filter((p) => p.id !== id);
          await AsyncStorage.setItem(
            PRODUCTS_KEY,
            JSON.stringify(filteredProducts)
          );

          return true;
        }

        if (error.response.status === 401 || error.response.status === 403) {
          console.log("🔒 Erro de autorização - token pode ter expirado");
        }
      }

      console.log("📱 Deletando produto localmente como fallback...");
      return await productService.deleteProductLocal(id);
    }
  },

  // ATUALIZAR APENAS QUANTIDADE (conveniência)
  updateQuantity: async (id: string, quantity: number): Promise<Product> => {
    return await productService.updateProduct(id, { quantity });
  },
};
