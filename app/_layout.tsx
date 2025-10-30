import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

import { useColorScheme } from "@/hooks/useColorScheme";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAppInitialization } from "@/hooks/useAppInitialization";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast, { BaseToast } from "react-native-toast-message";
import { Image, StatusBar, View } from "react-native";
import CustomToast from "@/components/common/CustomToast";
import { ToastConfigParams } from "react-native-toast-message";
import Auth from "@/utils/auth";
import SessionProvider from "@/context/SessionProvider";
import { useSession } from "@/context/SessionContext";
import { Jura_600SemiBold, Jura_700Bold } from "@expo-google-fonts/jura";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  ininitialRouteName: "(tabs)",
};
export const toastConfig = {
  success: (props: ToastConfigParams<any>) => <CustomToast {...props} />,
  error: (props: ToastConfigParams<any>) => <CustomToast {...props} />,
  info: (props: ToastConfigParams<any>) => <CustomToast {...props} />,
};
export default function RootLayout() {
  const { expoPushToken } = usePushNotifications();

  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  return (
    <>
      <SessionProvider>
        <GestureHandlerRootView>
          <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <StatusBar barStyle={"dark-content"} />
                <RootNavigator />
              </ThemeProvider>
            </QueryClientProvider>
            <Toast position="top" config={toastConfig} />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </SessionProvider>
    </>
  );
}

function RootNavigator() {
  const { session, loading, userOnboarded } = useSession();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Jura_700Bold,
    Jura_600SemiBold,
  });
  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loading]);

  if (!loaded && loading) {
    return null;
  }
  return (
    <Stack>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!session && !userOnboarded}>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="billpayment" options={{ headerShown: false }} />
        <Stack.Screen name="contact" options={{ headerShown: false }} />
        <Stack.Screen name="helpcenter" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="withdraw" options={{ headerShown: false }} />
        <Stack.Screen name="personalinfo" options={{ headerShown: false }} />

        <Stack.Screen
          name="transactionDetail"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="transactionDetails"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="transfer/ToSispay"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="transfer/toBankAccount"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="transfer/qrCodePage"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="transfer/cameraScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="+not-found" />
      </Stack.Protected>
    </Stack>
  );
}
