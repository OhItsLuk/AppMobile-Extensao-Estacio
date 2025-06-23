import { productService } from "../services/productService";

export const sampleProducts = [
  {
    name: "Panela de Pressão 5L",
    description:
      "Panela de pressão antiaderente com capacidade para 5 litros, ideal para cozinhar para toda família.",
    quantity: 15,
  },
  {
    name: "Conjunto de Talheres",
    description:
      "Conjunto com 24 peças em aço inox, incluindo facas, garfos e colheres.",
    quantity: 8,
  },
  {
    name: "Frigideira Antiaderente",
    description:
      "Frigideira de 26cm com revestimento antiaderente e cabo ergonômico.",
    quantity: 3,
  },
  {
    name: "Jogo de Pratos",
    description: "Conjunto de 6 pratos rasos em porcelana branca.",
    quantity: 12,
  },
  {
    name: "Espátula de Silicone",
    description: undefined, // Produto sem descrição
    quantity: 25,
  },
];

export const createSampleProducts = async () => {
  try {
    // Verifica se já existem produtos
    const existingProducts = await productService.getProducts();

    if (existingProducts.length === 0) {
      console.log("Criando produtos de exemplo...");

      for (const product of sampleProducts) {
        await productService.createProduct(product);
      }

      console.log("Produtos de exemplo criados com sucesso!");
    }
  } catch (error) {
    console.error("Erro ao criar produtos de exemplo:", error);
  }
};
