import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { ToastConfigParams } from "react-native-toast-message";
import { FontAwesome } from "@expo/vector-icons";

export default function CustomToast({
  text1,
  text2,
  type,
  ...rest
}: ToastConfigParams<any>) {
  return (
    <View
      className="flex items-center justify-center"
      style={[
        styles.container,
        {
          backgroundColor: "#fff",
        },
      ]}
    >
      <View className="flex flex-row items-center">
        <Image
          className="border-[1px] border-appblue mr-3"
          source={require("@/assets/images/app_icon.png")}
          style={styles.icon}
        />

        <View style={{ flex: 1 }}>
          {text1 ? (
            <Text className="text-sm" style={styles.text1}>
              {text1}
            </Text>
          ) : null}
          {text2 ? (
            <Text className="text-xs" style={styles.text2}>
              {text2}
            </Text>
          ) : null}
        </View>
        {type == "success" ? (
          <FontAwesome name="check-square" size={24} color="#00C851" />
        ) : type == "error" ? (
          <FontAwesome name="close" size={24} color="#ff4444" />
        ) : (
          <FontAwesome name="info-circle" size={24} color="#2E86DE" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 4,
    width: "92%",
    minHeight: 60,
    // Shadows (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Elevation (Android)
    elevation: 2,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    borderRadius: 4,
  },
  text1: {
    color: "#000",
    fontWeight: "bold",
  },
  text2: {
    color: "#999",
  },
});
