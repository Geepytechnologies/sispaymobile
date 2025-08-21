import { useUserStore } from "@/config/store";
import {
  Redirect,
  router,
  Slot,
  Stack,
  useRootNavigationState,
} from "expo-router";
import React, { useEffect } from "react";

const Layout = () => {
  const { isUserOnboarded } = useUserStore();
  if (isUserOnboarded) {
    return <Redirect href={"/(tabs)"} />;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="screen2" options={{ headerShown: false }} />
      <Stack.Screen name="screen3" options={{ headerShown: false }} />
    </Stack>
  );
};
export default Layout;
