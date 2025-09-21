import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { router } from "expo-router";
import authService from "@/services/auth.service";
import appStateService from "@/services/appState.service";
import { useUserStore } from "@/config/store";

interface AppInitializationState {
  isInitialized: boolean;
  isAuthenticated: boolean | null;
  user: any | null;
  error: string | null;
}

export const useAppInitialization = () => {
  const [state, setState] = useState<AppInitializationState>({
    isInitialized: false,
    isAuthenticated: null,
    user: null,
    error: null,
  });

  const { setUser, clearUser, setAuthStatus } = useUserStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Keep splash screen visible during initialization
      await SplashScreen.preventAutoHideAsync();

      // Initialize app state monitoring
      const cleanupAppState = appStateService.initialize();

      // Check authentication status
      await checkAuthenticationStatus();

      // Mark as initialized
      setState((prev) => ({ ...prev, isInitialized: true }));

      // Hide splash screen
      await SplashScreen.hideAsync();

      return cleanupAppState;
    } catch (error) {
      console.error("App initialization error:", error);
      setState((prev) => ({
        ...prev,
        isInitialized: true,
        error: error instanceof Error ? error.message : "Initialization failed",
      }));
      await SplashScreen.hideAsync();
    }
  };

  const checkAuthenticationStatus = async () => {
    try {
      // Load user with automatic token refresh and store loading
      const user = await authService.loadUserIntoStore();

      if (user) {
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          user,
        }));

        // Set up proactive token refresh timer
        // This is already handled in authService.setUser() but we ensure it's set
        console.log("Authentication successful, token refresh timer active");

        // Navigate to main app
        router.replace("/(tabs)");
      } else {
        // No valid user or refresh failed, clear user state
        await handleLogout();
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      await handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      await authService.clearUser();
      clearUser();
      setAuthStatus(false);
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
      }));

      // Navigate to auth screen
      router.replace("/(auth)/Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const refreshAuthStatus = async () => {
    await checkAuthenticationStatus();
  };

  return {
    ...state,
    refreshAuthStatus,
    logout: handleLogout,
  };
};

export default useAppInitialization;
