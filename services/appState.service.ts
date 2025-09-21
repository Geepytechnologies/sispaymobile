import { AppState, AppStateStatus } from "react-native";
import { useEffect, useRef } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import authService from "./auth.service";
import { useUserStore } from "@/config/store";
import { router } from "expo-router";

interface AppStateConfig {
  backgroundLogoutDelay: number; // milliseconds
  requireBiometricOnResume: boolean;
  inactivityLockThreshold: number; // milliseconds
}

const DEFAULT_CONFIG: AppStateConfig = {
  backgroundLogoutDelay: 0, // Immediate logout for fintech
  requireBiometricOnResume: true,
  inactivityLockThreshold: 2 * 60 * 1000, // 2 minutes
};

class AppStateService {
  private lastBackgroundAt: number | null = null;
  private backgroundTimeout: NodeJS.Timeout | null = null;
  private config: AppStateConfig = DEFAULT_CONFIG;

  constructor(config?: Partial<AppStateConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Initialize app state monitoring
  initialize() {
    const subscription = AppState.addEventListener(
      "change",
      this.handleAppStateChange.bind(this)
    );
    return () => subscription.remove();
  }

  private async handleAppStateChange(nextState: AppStateStatus) {
    switch (nextState) {
      case "background":
        await this.handleBackground();
        break;
      case "active":
        await this.handleForeground();
        break;
      case "inactive":
        // App is transitioning between foreground and background
        break;
    }
  }

  private async handleBackground() {
    this.lastBackgroundAt = Date.now();

    // For fintech apps, logout immediately when going to background
    if (this.config.backgroundLogoutDelay === 0) {
      await this.logoutUser();
    } else {
      // Set timeout for delayed logout
      this.backgroundTimeout = setTimeout(async () => {
        await this.logoutUser();
      }, this.config.backgroundLogoutDelay);
    }
  }

  private async handleForeground() {
    // Clear any pending logout
    if (this.backgroundTimeout) {
      clearTimeout(this.backgroundTimeout);
      this.backgroundTimeout = null;
    }

    // Check if user was inactive for too long
    if (this.lastBackgroundAt && this.config.requireBiometricOnResume) {
      const wasInactiveMs = Date.now() - this.lastBackgroundAt;

      if (wasInactiveMs > this.config.inactivityLockThreshold) {
        await this.requireBiometricAuth();
      }
    }

    // Proactive token refresh on resume
    await this.refreshTokenIfNeeded();
  }

  private async requireBiometricAuth() {
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
          await this.logoutUser();
        }
      } else {
        // No biometric available, logout for security
        await this.logoutUser();
      }
    } catch (error) {
      console.error("Biometric authentication failed:", error);
      await this.logoutUser();
    }
  }

  private async refreshTokenIfNeeded() {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;

      const isExpiringSoon = await authService.isTokenExpiringSoon(
        user.accessToken
      );
      if (isExpiringSoon) {
        const refreshed = await authService.refreshAccessToken();
        if (!refreshed) {
          await this.logoutUser();
        }
      }
    } catch (error) {
      console.error("Token refresh failed in refreshTokenIfNeeded:", error);
      await this.logoutUser();
    }
  }

  private async logoutUser() {
    try {
      await authService.clearUser();
      const { clearUser } = useUserStore.getState();
      clearUser();
      router.replace("/(auth)/Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<AppStateConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Manual logout
  async logout() {
    await this.logoutUser();
  }
}

export default new AppStateService();
