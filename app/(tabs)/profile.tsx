import { SIGNOUT } from "@/config/slices/userSlice";
import authService from "@/services/auth.service";
import { globalstyles } from "@/styles/common";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useRef, useState } from "react";
import { Button, Text } from "react-native";
import { View } from "react-native";
import { StyleSheet, Image, Platform } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

export default function TabTwoScreen() {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await authService.Logout();
    dispatch(SIGNOUT());
  };
  return (
    <SafeAreaView className="bg-appblue" style={{}}>
      <View style={[globalstyles.rowview, { justifyContent: "space-between" }]}>
        <Text className="text-white">profile</Text>
        <Text className="text-white">Edit Profile</Text>
      </View>
      <View
        style={{
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          borderWidth: 1,
          backgroundColor: "red",
        }}
        className="flex-1"
      >
        <Text>hello</Text>
      </View>
      <Button title="logout" onPress={handleLogout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
