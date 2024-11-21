import { SIGNOUT } from "@/config/slices/userSlice";
import authService from "@/services/auth.service";
import { globalstyles } from "@/styles/common";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Button,
  Dimensions,
  StatusBar,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import { StyleSheet, Image, Platform } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@/assets/images/avatar.svg";
import { RootState } from "@/config/store";
import { ScreenDimensions } from "@/constants/Dimensions";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { SET_TOKENS } from "@/config/slices/authSlice";
import { useAuth } from "@/utils/AuthProvider";

export default function TabTwoScreen() {
  const { currentuser } = useSelector((state: RootState) => state.user);
  const { setAccessToken } = useAuth();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await authService.Logout();
    setAccessToken("");
    // router.re("/(auth)/Login");
    dispatch(SET_TOKENS({ accessToken: "", refreshToken: "" }));
  };
  const menuData = [
    {
      label: "My Account",
      icon: <FontAwesome5 name="user-alt" size={24} color={Colors.primary} />,
      navigate: "(tabs)/",
    },
    {
      label: "Settings",
      icon: <MaterialIcons name="settings" size={24} color={Colors.primary} />,
      navigate: "settings",
    },
    {
      label: "Help Center",
      icon: <Ionicons name="help-circle" size={24} color={Colors.primary} />,
      navigate: "helpcenter",
    },
    {
      label: "Contact",
      icon: <FontAwesome name="phone" size={24} color={Colors.primary} />,
      navigate: "contact",
    },
    {
      label: "Logout",
      icon: <Entypo name="log-out" size={24} color={Colors.primary} />,
      navigate: "",
      action: handleLogout,
    },
  ];
  const handleMenuPress = (menu: any) => {
    menu.label == "Logout" ? menu.action() : router.push(menu.navigate);
  };
  return (
    <SafeAreaView
      className="bg-appblue"
      style={{ minHeight: ScreenDimensions.screenHeight }}
    >
      <StatusBar barStyle={"light-content"} />
      <View className="p-[28px]">
        <View
          style={[
            globalstyles.rowview,
            { justifyContent: "space-between", marginBottom: 50 },
          ]}
        >
          <Text className="text-white">Profile</Text>
          <Text className="text-white">Edit Profile</Text>
        </View>
        <View style={[globalstyles.rowview, { gap: 22 }]}>
          <Avatar height={80} width={80} />
          <View style={[globalstyles.colview]}>
            <Text className="text-white font-inter font-[600] leading-[26px]">
              {currentuser?.firstName + " " + currentuser?.lastName}
            </Text>
            <Text className="text-white text-[12px]">{currentuser?.email}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          borderWidth: 1,
          backgroundColor: "#fff",
        }}
        className="flex-1 px-[30px] py-[40px] gap-5"
      >
        {menuData.map((menu, index) => (
          <TouchableOpacity
            onPress={() => handleMenuPress(menu)}
            activeOpacity={0.8}
            key={index}
            style={[globalstyles.rowview, { gap: 16 }]}
            className="justify-between"
          >
            <View style={[globalstyles.rowview, { gap: 16 }]}>
              <View className="w-[48px] h-[48px] bg-[#DBEAFE] rounded-[16px] flex items-center justify-center">
                {menu.icon}
              </View>
              <Text className="text-[14px] font-inter font-[500] text-[#121826] leading-6">
                {menu.label}
              </Text>
            </View>
            <FontAwesome name="angle-right" size={24} color="#D3D5DA" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
