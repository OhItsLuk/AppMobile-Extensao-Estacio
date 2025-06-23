import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { productService, Product } from "../services/productService";

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

type ProductContextData = {
  products: Product[];
  loading: boolean;
  createProduct: (productData: CreateProductData) => Promise<Product>;
  updateProduct: (
    id: string,
    productData: UpdateProductData
  ) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateQuantity: (id: string, quantity: number) => Promise<Product>;
  refreshProducts: () => Promise<void>;
};

const ProductContext = createContext<ProductContextData>(
  {} as ProductContextData
);

type ProductProviderProps = {
  children: ReactNode;
};

export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshProducts = async () => {
    setLoading(true);
    try {
      const fetchedProducts = await productService.getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const createProduct = async (
    productData: CreateProductData
  ): Promise<Product> => {
    try {
      const newProduct = await productService.createProduct(productData);
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  };

  const updateProduct = async (
    id: string,
    productData: UpdateProductData
  ): Promise<Product> => {
    try {
      const updatedProduct = await productService.updateProduct(
        id,
        productData
      );
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? updatedProduct : product))
      );
      return updatedProduct;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const success = await productService.deleteProduct(id);
      if (success) {
        setProducts((prev) => prev.filter((product) => product.id !== id));
      }
      return success;
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      return false;
    }
  };

  const updateQuantity = async (
    id: string,
    quantity: number
  ): Promise<Product> => {
    try {
      const updatedProduct = await productService.updateQuantity(id, quantity);
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? updatedProduct : product))
      );
      return updatedProduct;
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        createProduct,
        updateProduct,
        deleteProduct,
        updateQuantity,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts deve ser usado dentro de um ProductProvider");
  }

  return context;
}
