import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { jwtDecode } from "jwt-decode";
import useRefreshToken from "./useRefreshToken";
import Auth from "@/utils/auth";
import { useUserStore } from "@/config/store";
import { router } from "expo-router";

// Configure inactivity threshold and biometric requirement here
const INACTIVITY_LOCK_MS = 2 * 60 * 1000; // 2 minutes
const REQUIRE_BIOMETRIC_ON_RESUME = true;

export default function useAppResumeAuth() {
  const lastBackgroundAtRef = useRef<number | null>(null);
  const refresh = useRefreshToken();
  const { user, clearUser } = useUserStore();

  useEffect(() => {
    const sub = AppState.addEventListener(
      "change",
      async (nextState: AppStateStatus) => {
        if (nextState === "background") {
          lastBackgroundAtRef.current = Date.now();
          return;
        }

        if (nextState === "active") {
          // Optional biometric lock after inactivity
          if (REQUIRE_BIOMETRIC_ON_RESUME && lastBackgroundAtRef.current) {
            const wasInactiveMs = Date.now() - lastBackgroundAtRef.current;
            if (wasInactiveMs > INACTIVITY_LOCK_MS) {
              try {
                const hasHardware =
                  await LocalAuthentication.hasHardwareAsync();
                const supported =
                  await LocalAuthentication.supportedAuthenticationTypesAsync();
                if (hasHardware && supported.length > 0) {
                  const res = await LocalAuthentication.authenticateAsync({
                    promptMessage: "Unlock",
                    cancelLabel: "Cancel",
                    disableDeviceFallback: false,
                  });
                  if (!res.success) {
                    await Auth.removeToken();
                    clearUser();
                    router.replace("/(auth)/Login");
                    return;
                  }
                }
              } catch {}
            }
          }

          // Proactive refresh on resume if token is close to expiry
          try {
            const token = user?.accessToken || (await Auth.getToken());
            if (token) {
              const decoded: any = jwtDecode(token);
              if (decoded?.exp) {
                const now = Date.now() / 1000;
                if (decoded.exp - now < 90) {
                  const refreshed = await refresh(token);
                  if (refreshed?.accessToken) {
                    await Auth.setToken(refreshed.accessToken);
                    if (refreshed.refreshToken)
                      await Auth.setRefreshToken(refreshed.refreshToken);
                  }
                }
              }
            }
          } catch {}
        }
      }
    );
    return () => sub.remove();
  }, [user?.accessToken, refresh, clearUser]);
}
