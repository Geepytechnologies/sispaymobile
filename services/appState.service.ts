import { AppState, AppStateStatus } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import authService from "./auth.service";
import { useUserStore } from "@/config/store";
import { router } from "expo-router";
import Auth from "@/utils/auth";
import { restoreUserStore } from "@/config/useStoreHelpers";

interface AppStateConfig {
  backgroundLogoutDelay: number; // ms
  requireBiometricOnResume: boolean;
  inactivityLockThreshold: number; // ms
}

const DEFAULT_CONFIG: AppStateConfig = {
  backgroundLogoutDelay: 0, // logout immediately when backgrounded
  requireBiometricOnResume: true,
  inactivityLockThreshold: 2 * 60 * 1000, // 2 min
};

class AppStateService {
  private lastBackgroundAt: number | null = null;
  private backgroundTimeout: NodeJS.Timeout | null = null;
  private config: AppStateConfig = DEFAULT_CONFIG;
  private initialized = false;

  constructor(config?: Partial<AppStateConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  initialize() {
    if (this.initialized) return;
    this.initialized = true;

    const subscription = AppState.addEventListener("change", async (state) => {
      await this.handleAppStateChange(state);
    });

    return () => {
      subscription.remove();
      this.initialized = false;
    };
  }

  private async handleAppStateChange(nextState: AppStateStatus) {
    switch (nextState) {
      case "background":
        await this.handleBackground();
        break;
      case "active":
        await this.handleForeground();
        break;
      default:
        break;
    }
  }

  private async handleBackground() {
    this.lastBackgroundAt = Date.now();

    // fintech: logout immediately (secure)
    if (this.config.backgroundLogoutDelay === 0) {
      await this.logoutUser();
    } else {
      this.backgroundTimeout = setTimeout(async () => {
        await this.logoutUser();
      }, this.config.backgroundLogoutDelay);
    }
  }

  private async handleForeground() {
    if (this.backgroundTimeout) {
      clearTimeout(this.backgroundTimeout);
      this.backgroundTimeout = null;
    }

    // if user was away too long, re-authenticate
    if (this.lastBackgroundAt && this.config.requireBiometricOnResume) {
      const inactiveFor = Date.now() - this.lastBackgroundAt;
      if (inactiveFor > this.config.inactivityLockThreshold) {
        await this.requireBiometricAuth();
      }
    }

    // refresh token only when app is active
    await this.refreshTokenIfNeeded();
  }

  private async requireBiometricAuth() {
    const { getUserProfileSettings } = Auth;
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supported =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      const userSettings = await getUserProfileSettings();
      console.log(userSettings);
      // if (!userSettings?.biometricEnabled) {
      //   router.push("/(auth)/Login");
      // }
      if (hasHardware && supported.length > 0) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Verify to continue",
          cancelLabel: "Cancel",
          disableDeviceFallback: false,
        });

        if (!result.success) {
          await this.logoutUser();
        }
        await restoreUserStore();
      }
    } catch (err) {
      console.error("Biometric auth failed:", err);
      await this.logoutUser();
    }
  }

  private async refreshTokenIfNeeded() {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;

      const isExpiringSoon = await authService.isTokenExpiringSoon(
        user.accessToken,
        120 // 2 minutes threshold
      );

      if (isExpiringSoon) {
        const refreshed = await authService.refreshAccessToken();
        if (!refreshed) {
          await this.logoutUser();
        }
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
      await this.logoutUser();
    }
  }

  private async logoutUser() {
    try {
      await authService.clearUser();
      const { clearUser } = useUserStore.getState();
      clearUser();
      router.replace("/(auth)/Login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  updateConfig(config: Partial<AppStateConfig>) {
    this.config = { ...this.config, ...config };
  }
}

export default new AppStateService();
