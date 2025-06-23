import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useProducts } from "../../../src/context/ProductContext";
import { Product } from "../../../src/services/productService";

export default function ProductListScreen() {
  const router = useRouter();
  const { products, loading, updateQuantity, deleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );

  const handleUpdateQuantity = async () => {
    if (!editingProduct) return;

    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 0) {
      Alert.alert("Erro", "Digite uma quantidade válida");
      return;
    }

    try {
      await updateQuantity(editingProduct.id, quantity);
      setIsModalVisible(false);
      setEditingProduct(null);
      setNewQuantity("");
      Alert.alert("Sucesso", "Quantidade atualizada com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a quantidade");
    }
  };

  const handleDeleteProduct = (product: Product) => {
    const totalValue = (product.price * product.quantity)
      .toFixed(2)
      .replace(".", ",");

    Alert.alert(
      "⚠️ Confirmar Exclusão",
      `Tem certeza que deseja excluir o produto?\n\n` +
        `📦 Produto: ${product.name}\n` +
        `💰 Valor unitário: R$ ${product.price
          .toFixed(2)
          .replace(".", ",")}\n` +
        `📊 Quantidade: ${product.quantity}\n` +
        `💵 Valor total: R$ ${totalValue}\n\n` +
        `⚠️ Esta ação não pode ser desfeita!`,
      [
        {
          text: "❌ Cancelar",
          style: "cancel",
        },
        {
          text: "🗑️ Excluir",
          style: "destructive",
          onPress: async () => {
            setDeletingProductId(product.id);
            try {
              console.log("🔍 Iniciando exclusão do produto:", product.name);

              const success = await deleteProduct(product.id);

              if (success) {
                Alert.alert(
                  "✅ Sucesso",
                  `Produto "${product.name}" foi excluído com sucesso!`
                );
                console.log("✅ Produto excluído com sucesso");
              } else {
                Alert.alert(
                  "❌ Erro",
                  `Não foi possível excluir o produto "${product.name}". Tente novamente.`
                );
                console.log("❌ Falha na exclusão do produto");
              }
            } catch (error) {
              console.error("❌ Erro na exclusão:", error);
              Alert.alert(
                "❌ Erro",
                `Erro inesperado ao excluir "${product.name}". Verifique sua conexão.`
              );
            } finally {
              setDeletingProductId(null);
            }
          },
        },
      ]
    );
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setNewQuantity(product.quantity.toString());
    setIsModalVisible(true);
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const isDeleting = deletingProductId === item.id;

    return (
      <View
        style={[styles.productCard, isDeleting && styles.productCardDeleting]}
      >
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>
              R$ {item.price.toFixed(2).replace(".", ",")}
            </Text>
          </View>
          {item.description && (
            <Text style={styles.productDescription}>{item.description}</Text>
          )}
          <View style={styles.productFooter}>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Estoque: </Text>
              <Text
                style={[
                  styles.quantityValue,
                  item.quantity <= 5 ? styles.lowStock : styles.normalStock,
                ]}
              >
                {item.quantity}
              </Text>
              {item.quantity <= 5 && (
                <Text style={styles.lowStockWarning}>⚠️ Baixo</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.editButton, isDeleting && styles.buttonDisabled]}
            onPress={() => router.push(`/views/EditProduct?id=${item.id}`)}
            disabled={isDeleting}
          >
            <Text style={styles.editButtonText}>✏️ Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.quickEditButton,
              isDeleting && styles.buttonDisabled,
            ]}
            onPress={() => openEditModal(item)}
            disabled={isDeleting}
          >
            <Text style={styles.quickEditButtonText}>📦 Qtd</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.deleteButton,
              isDeleting && styles.deleteButtonDeleting,
            ]}
            onPress={() => handleDeleteProduct(item)}
            disabled={isDeleting}
          >
            <Text style={styles.deleteButtonText}>
              {isDeleting ? "⏳" : "🗑️"}
            </Text>
          </TouchableOpacity>
        </View>

        {isDeleting && (
          <View style={styles.deletingOverlay}>
            <Text style={styles.deletingText}>Excluindo...</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={styles.loadingText}>Carregando produtos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Produtos em Estoque</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/views/AddProduct")}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
          <TouchableOpacity
            style={styles.addFirstProductButton}
            onPress={() => router.push("/views/AddProduct")}
          >
            <Text style={styles.addFirstProductButtonText}>
              Cadastrar primeiro produto
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Quantidade</Text>
            <Text style={styles.modalProductName}>{editingProduct?.name}</Text>

            <TextInput
              style={styles.modalInput}
              value={newQuantity}
              onChangeText={setNewQuantity}
              placeholder="Nova quantidade"
              keyboardType="numeric"
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleUpdateQuantity}
              >
                <Text style={styles.modalSaveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#1E88E5",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  addFirstProductButton: {
    backgroundColor: "#1E88E5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstProductButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    paddingVertical: 8,
  },
  productCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    minHeight: 120,
  },
  productCardDeleting: {
    opacity: 0.6,
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 14,
    color: "#666",
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  normalStock: {
    color: "#4CAF50",
  },
  lowStock: {
    color: "#f44336",
  },
  lowStockWarning: {
    fontSize: 12,
    color: "#f44336",
    backgroundColor: "#ffebee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "column",
    alignItems: "center",
    width: 80,
  },
  editButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 6,
    width: "100%",
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  quickEditButton: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 6,
    width: "100%",
    alignItems: "center",
  },
  quickEditButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  deleteButtonDeleting: {
    backgroundColor: "#FFA726",
  },
  deletingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  deletingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF9800",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  modalProductName: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  modalSaveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
