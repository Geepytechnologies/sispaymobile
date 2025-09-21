import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Api from "@/utils/Api";
import { useUserStore } from "@/config/store";

// Example component showing how to use the new API system
const ApiUsageExample = () => {
  const { user } = useUserStore();

  const handleApiCall = async () => {
    try {
      // The API will automatically use the token from the store
      // No need to manually add authorization headers
      const response = await Api.get("/user/profile");
      console.log("User profile:", response.data);
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  const handlePostRequest = async () => {
    try {
      // POST requests also automatically include the token
      const response = await Api.post("/transactions/transfer", {
        amount: 1000,
        recipient: "1234567890",
      });
      console.log("Transfer successful:", response.data);
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Usage Example</Text>
      <Text style={styles.subtitle}>
        User: {user?.firstName} {user?.lastName}
      </Text>
      <Text style={styles.subtitle}>
        Token: {user?.accessToken ? "✅ Available" : "❌ Not available"}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleApiCall}>
        <Text style={styles.buttonText}>Get Profile (Auto Token)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handlePostRequest}>
        <Text style={styles.buttonText}>Transfer Money (Auto Token)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ApiUsageExample;
