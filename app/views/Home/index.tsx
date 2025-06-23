import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  Platform,
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1565C0" />

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

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#1E88E5",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },
  welcome: {
    fontSize: 15,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  menuButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  menuButtonSubtext: {
    fontSize: 13,
    color: "#666",
  },
  sampleButton: {
    backgroundColor: "#FFF8E1",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#FFD54F",
  },
  sampleButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#F57C00",
    marginBottom: 3,
  },
  sampleButtonSubtext: {
    fontSize: 12,
    color: "#F57C00",
    opacity: 0.8,
  },
  apiButton: {
    backgroundColor: "#E8F5E8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  apiButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 3,
  },
  apiButtonSubtext: {
    fontSize: 12,
    color: "#2E7D32",
    opacity: 0.8,
  },
  debugButton: {
    backgroundColor: "#F3E5F5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#BA68C8",
  },
  debugButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#7B1FA2",
    marginBottom: 3,
  },
  debugButtonSubtext: {
    fontSize: 12,
    color: "#7B1FA2",
    opacity: 0.8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#f44336",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
