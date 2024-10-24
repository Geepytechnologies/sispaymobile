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
import { Provider } from "react-redux";
import { store } from "@/config/store";
import AuthContextProvider from "@/utils/AuthProvider";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  ininitialRouteName: "(tabs)",
};
export default function RootLayout() {
  const { expoPushToken } = usePushNotifications();

  const colorScheme = useColorScheme();
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
  });

  if (!loaded) {
    return null;
  }
  const queryClient = new QueryClient();
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        {/* <AuthContextProvider> */}
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack initialRouteName="index">
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="(onboarding)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="billpayment"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="contact" options={{ headerShown: false }} />
              <Stack.Screen
                name="helpcenter"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
              <Stack.Screen name="withdraw" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen
                name="transactionDetails"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="transfer/ToSispay"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="transfer/ToBankAccount"
                options={{ headerShown: false }}
              />

              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </QueryClientProvider>
        {/* </AuthContextProvider> */}
      </Provider>
    </GestureHandlerRootView>
  );
}
