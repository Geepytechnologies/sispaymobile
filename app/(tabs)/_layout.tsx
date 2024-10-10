import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Home from "@/assets/images/icons/home.svg";
import Transactions from "@/assets/images/icons/transactions.svg";
import Profile from "@/assets/images/icons/profile.svg";

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
          title: "Home",
          tabBarIcon: ({ color, focused }) => <Home />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color, focused }) => <Transactions />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => <Profile />,
        }}
      />
    </Tabs>
  );
}
