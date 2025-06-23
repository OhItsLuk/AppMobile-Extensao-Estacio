import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useProducts } from "../../../src/context/ProductContext";

export default function AddProductScreen() {
  const router = useRouter();
  const { createProduct } = useProducts();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    quantity: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      quantity: "",
    };

    if (!name.trim()) {
      newErrors.name = "Nome do produto é obrigatório";
    }

    if (!quantity.trim()) {
      newErrors.quantity = "Quantidade é obrigatória";
    } else if (isNaN(parseInt(quantity)) || parseInt(quantity) < 0) {
      newErrors.quantity = "Digite uma quantidade válida";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.quantity;
  };

  const handleSaveProduct = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await createProduct({
        name: name.trim(),
        description: description.trim() || undefined,
        quantity: parseInt(quantity),
      });

      Alert.alert("Sucesso", "Produto cadastrado com sucesso!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar o produto");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setQuantity("");
    setErrors({ name: "", quantity: "" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Novo Produto</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nome do Produto <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Ex: Panela de pressão 5L"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) {
                    setErrors({ ...errors, name: "" });
                  }
                }}
                maxLength={100}
              />
              {errors.name ? (
                <Text style={styles.errorText}>{errors.name}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição (opcional)</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Descrição detalhada do produto..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.characterCount}>
                {description.length}/500
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Quantidade em Estoque <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.quantity && styles.inputError]}
                placeholder="Ex: 10"
                value={quantity}
                onChangeText={(text) => {
                  setQuantity(text);
                  if (errors.quantity) {
                    setErrors({ ...errors, quantity: "" });
                  }
                }}
                keyboardType="numeric"
                maxLength={6}
              />
              {errors.quantity ? (
                <Text style={styles.errorText}>{errors.quantity}</Text>
              ) : null}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetForm}
            disabled={loading}
          >
            <Text style={styles.resetButtonText}>Limpar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSaveProduct}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Salvando..." : "Salvar Produto"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1E88E5",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  placeholder: {
    width: 40, // Para balancear o layout
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#f44336",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#f44336",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 100,
  },
  characterCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  errorText: {
    color: "#f44336",
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  resetButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 12,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 2,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
