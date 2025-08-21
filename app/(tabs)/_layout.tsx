import { router, Tabs, useRootNavigationState } from "expo-router";
import React, { useEffect } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Home from "@/assets/images/icons/home.svg";
import Transactions from "@/assets/images/icons/transactions.svg";
import Profile from "@/assets/images/icons/profile.svg";
import Auth from "@/utils/auth";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = Auth;
  const navState = useRootNavigationState();

  useEffect(() => {
    if (!navState?.key) return; // wait for root navigation to mount
    const checkAuth = async () => {
      const res = await isAuthenticated();
      if (!res) {
        router.replace("/(auth)/Login");
      }
    };

    checkAuth();
  }, [navState?.key]);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "grey",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#031D42",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          height: 100,
        },
        tabBarLabelStyle: { fontSize: 14 },
        tabBarIconStyle: { width: 24, height: 24 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarItemStyle: { height: 60, alignSelf: "center" },

          title: "Home",
          tabBarIcon: ({ color, focused }) => <Home />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          tabBarItemStyle: { height: 60, alignSelf: "center" },
          title: "Transactions",
          tabBarIcon: ({ color, focused }) => <Transactions />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarItemStyle: { height: 60, alignSelf: "center" },

          title: "Profile",
          tabBarIcon: ({ color, focused }) => <Profile />,
        }}
      />
    </Tabs>
  );
}
