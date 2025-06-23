import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { useAuth } from "../../../src/context/AuthContext";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

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
    paddingVertical: 24,
    backgroundColor: "#1E88E5",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  welcome: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: "center",
  },
  menuButton: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  menuButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  menuButtonSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#f44336",
    padding: 16,
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
    fontSize: 16,
    fontWeight: "bold",
  },
});
