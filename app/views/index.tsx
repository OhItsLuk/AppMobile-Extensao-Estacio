import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function ViewsIndex() {
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isLoggedIn) {
        router.replace("/views/Home");
      } else {
        router.replace("/views/Login");
      }
    }
  }, [isLoggedIn, loading]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#1E88E5" />
    </View>
  );
}
