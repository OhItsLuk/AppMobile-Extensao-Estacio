import React from "react";
import { Stack } from "expo-router";

export default function ViewsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Início",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Home/index"
        options={{
          title: "PSIT - Controle de Estoque",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Login/index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ProductList/index"
        options={{
          title: "Produtos",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddProduct/index"
        options={{
          title: "Novo Produto",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
