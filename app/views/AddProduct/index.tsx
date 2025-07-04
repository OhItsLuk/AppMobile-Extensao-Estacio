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
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useProducts } from "../../../src/context/ProductContext";

export default function AddProductScreen() {
  const router = useRouter();
  const { createProduct } = useProducts();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      quantity: "",
      price: "",
    };

    if (!name.trim()) {
      newErrors.name = "Nome do produto é obrigatório";
    }

    if (!quantity.trim()) {
      newErrors.quantity = "Quantidade é obrigatória";
    } else if (isNaN(parseInt(quantity)) || parseInt(quantity) < 0) {
      newErrors.quantity = "Digite uma quantidade válida";
    }

    if (!price.trim()) {
      newErrors.price = "Preço é obrigatório";
    } else {
      const numericPrice = parseFloat(price.replace(",", "."));
      if (isNaN(numericPrice) || numericPrice < 0) {
        newErrors.price = "Digite um preço válido";
      }
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.quantity && !newErrors.price;
  };

  const formatPrice = (text: string) => {
    let cleanText = text.replace(/[^0-9,]/g, "");

    const parts = cleanText.split(",");
    if (parts.length > 2) {
      cleanText = parts[0] + "," + parts.slice(1).join("");
    }

    if (parts.length === 2 && parts[1].length > 2) {
      cleanText = parts[0] + "," + parts[1].substring(0, 2);
    }

    return cleanText;
  };

  const handleSaveProduct = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const numericPrice = parseFloat(price.replace(",", "."));

      await createProduct({
        name: name.trim(),
        description: description.trim() || undefined,
        quantity: parseInt(quantity),
        price: numericPrice,
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
    setPrice("");
    setErrors({ name: "", quantity: "", price: "" });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1565C0" />

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
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.characterCount}>
                {description.length}/500
              </Text>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>
                  Quantidade <Text style={styles.required}>*</Text>
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

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>
                  Preço (R$) <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  placeholder="Ex: 29,90"
                  value={price}
                  onChangeText={(text) => {
                    const formattedPrice = formatPrice(text);
                    setPrice(formattedPrice);
                    if (errors.price) {
                      setErrors({ ...errors, price: "" });
                    }
                  }}
                  keyboardType="decimal-pad"
                  maxLength={12}
                />
                {errors.price ? (
                  <Text style={styles.errorText}>{errors.price}</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 <Text style={styles.infoBold}>Dica:</Text> Os campos marcados
                com * são obrigatórios. O produto será cadastrado no estoque e
                você poderá editá-lo posteriormente.
              </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  halfWidth: {
    width: "48%",
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
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  inputError: {
    borderColor: "#f44336",
  },
  textArea: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    height: 80,
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
  infoBox: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#1976D2",
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginRight: 10,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 2,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#A5D6A7",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
