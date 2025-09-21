import { AppState, AppStateStatus } from "react-native";
import { useEffect, useRef, useCallback } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { useUserStore } from "@/config/store";
import { router } from "expo-router";
import authService from "@/services/auth.service";

interface AppStateConfig {
  backgroundLogoutDelay: number; // ms
  requireBiometricOnResume: boolean;
  inactivityLockThreshold: number; // ms
}

const DEFAULT_CONFIG: AppStateConfig = {
  backgroundLogoutDelay: 0,
  requireBiometricOnResume: true,
  inactivityLockThreshold: 2 * 60 * 1000, // 2 min
};

export function useAppStateMonitor(customConfig?: Partial<AppStateConfig>) {
  const config = useRef<AppStateConfig>({ ...DEFAULT_CONFIG, ...customConfig });
  const lastBackgroundAt = useRef<number | null>(null);
  const backgroundTimeout = useRef<NodeJS.Timeout | null>(null);
  const { clearUser } = useUserStore();

  const logoutUser = useCallback(async () => {
    try {
      await authService.clearUser();
      clearUser();
      router.replace("/(auth)/Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [clearUser]);

  const requireBiometricAuth = useCallback(async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supported =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (hasHardware && supported.length > 0) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Verify your identity to continue",
          cancelLabel: "Cancel",
          disableDeviceFallback: false,
        });

        if (!result.success) {
          await logoutUser();
        }
      } else {
        await logoutUser();
      }
    } catch (error) {
      console.error("Biometric authentication failed:", error);
      await logoutUser();
    }
  }, [logoutUser]);

  const refreshTokenIfNeeded = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;

      const isExpiringSoon = await authService.isTokenExpiringSoon(
        user.accessToken
      );
      if (isExpiringSoon) {
        const refreshed = await authService.refreshAccessToken();
        if (!refreshed) {
          await logoutUser();
        }
      }
    } catch (error) {
      console.error("Token refresh failed in refreshTokenIfNeeded:", error);
      await logoutUser();
    }
  }, [logoutUser]);

  const handleAppStateChange = useCallback(
    async (nextState: AppStateStatus) => {
      switch (nextState) {
        case "background":
          lastBackgroundAt.current = Date.now();
          if (config.current.backgroundLogoutDelay === 0) {
            await logoutUser();
          } else {
            backgroundTimeout.current = setTimeout(async () => {
              await logoutUser();
            }, config.current.backgroundLogoutDelay);
          }
          break;

        case "active":
          if (backgroundTimeout.current) {
            clearTimeout(backgroundTimeout.current);
            backgroundTimeout.current = null;
          }

          if (
            lastBackgroundAt.current &&
            config.current.requireBiometricOnResume
          ) {
            const wasInactiveMs = Date.now() - lastBackgroundAt.current;
            if (wasInactiveMs > config.current.inactivityLockThreshold) {
              await requireBiometricAuth();
            }
          }

          await refreshTokenIfNeeded();
          break;

        case "inactive":
          // no-op
          break;
      }
    },
    [logoutUser, requireBiometricAuth, refreshTokenIfNeeded]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [handleAppStateChange]);

  // Public API of the hook
  const updateConfig = useCallback((newConfig: Partial<AppStateConfig>) => {
    config.current = { ...config.current, ...newConfig };
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
  }, [logoutUser]);

  return { updateConfig, logout };
}
