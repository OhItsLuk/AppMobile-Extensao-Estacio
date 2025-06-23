import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useAuth } from "../../../src/context/AuthContext";
import { useRouter } from "expo-router";
import { createSampleProducts } from "../../../src/utils/sampleData";
import { authService } from "../../../src/services/authService";

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loadingSample, setLoadingSample] = useState(false);

  const handleCreateSampleData = async () => {
    setLoadingSample(true);
    try {
      await createSampleProducts();
      Alert.alert(
        "Sucesso",
        "Produtos de exemplo criados! Vá para a tela de produtos para visualizá-los."
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar os produtos de exemplo");
    } finally {
      setLoadingSample(false);
    }
  };

  const handleTestAPI = async () => {
    try {
      console.log("🔍 Iniciando teste de API...");
      const isConnected = await authService.testConnection();
      if (isConnected) {
        Alert.alert("✅ API", "Conexão com servidor estabelecida!");
      } else {
        Alert.alert(
          "❌ API",
          "Servidor não está respondendo. Verifique se o backend está rodando na porta 5136."
        );
      }
    } catch (error) {
      console.error("Erro no teste:", error);
      Alert.alert("❌ API", `Erro ao conectar: ${error.message}`);
    }
  };

  const handleTestFetch = async () => {
    try {
      console.log("🔍 Testando com fetch...");
      const isConnected = await authService.testWithFetch();
      if (isConnected) {
        Alert.alert("✅ Fetch", "Fetch nativo funcionou!");
      } else {
        Alert.alert("❌ Fetch", "Fetch nativo falhou");
      }
    } catch (error) {
      console.error("Erro no teste fetch:", error);
      Alert.alert("❌ Fetch", `Erro: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PSIT - Controle de Estoque</Text>
        <Text style={styles.welcome}>
          Bem-vindo, {user?.name || "Usuário"}!
        </Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/views/ProductList")}
        >
          <Text style={styles.menuButtonText}>📦 Produtos</Text>
          <Text style={styles.menuButtonSubtext}>Ver e gerenciar estoque</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/views/AddProduct")}
        >
          <Text style={styles.menuButtonText}>➕ Adicionar Produto</Text>
          <Text style={styles.menuButtonSubtext}>Cadastrar novo produto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sampleButton}
          onPress={handleCreateSampleData}
          disabled={loadingSample}
        >
          <Text style={styles.sampleButtonText}>
            {loadingSample ? "Criando..." : "📦 Dados de Exemplo"}
          </Text>
          <Text style={styles.sampleButtonSubtext}>
            Criar produtos para teste
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.apiButton} onPress={handleTestAPI}>
          <Text style={styles.apiButtonText}>🔗 Testar API (Axios)</Text>
          <Text style={styles.apiButtonSubtext}>
            Verificar conexão com servidor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.debugButton} onPress={handleTestFetch}>
          <Text style={styles.debugButtonText}>🧪 Testar API (Fetch)</Text>
          <Text style={styles.debugButtonSubtext}>
            Teste alternativo de conectividade
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#1E88E5",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  welcome: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  menuContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  menuButton: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  menuButtonSubtext: {
    fontSize: 14,
    color: "#666",
  },
  sampleButton: {
    backgroundColor: "#FFF8E1",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#FFD54F",
  },
  sampleButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F57C00",
    marginBottom: 4,
  },
  sampleButtonSubtext: {
    fontSize: 14,
    color: "#F57C00",
    opacity: 0.8,
  },
  apiButton: {
    backgroundColor: "#E8F5E8",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  apiButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  apiButtonSubtext: {
    fontSize: 14,
    color: "#2E7D32",
    opacity: 0.8,
  },
  logoutButton: {
    backgroundColor: "#f44336",
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  debugButton: {
    backgroundColor: "#F3E5F5",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#BA68C8",
  },
  debugButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7B1FA2",
    marginBottom: 4,
  },
  debugButtonSubtext: {
    fontSize: 14,
    color: "#7B1FA2",
    opacity: 0.8,
  },
});
