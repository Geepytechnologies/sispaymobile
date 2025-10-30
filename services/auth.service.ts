import { IUserResponse } from "@/interfaces/responses/user.interface";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import authEndpoints from "@/api/auth";
import axios from "axios";
import {
  BiometricLoginDTO,
  LoginDTO,
  RegisterBiometricDTO,
  SendOtpDTO,
  TwoFactorAuthLoginDTO,
  VerifyOtpDTO,
} from "@/types/LoginDTO";
import { CONSTANTS } from "@/constants";
import { RegisterDTO } from "@/types/RegisterDTO";
import { deleteFromStore } from "@/utils/localstorage";
import { postRequest } from "@/utils/apiCaller";
import { IRegisterBiometricResponse } from "@/interfaces/responses/auth.interface";

interface TokenRefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

class AuthService {
  async signin(credentials: LoginDTO) {
    try {
      const response = await axios.post(`${authEndpoints.login}`, credentials);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        // Log detailed error information
        console.error("Login error:", {
          statusCode: error.response?.status, // The status code
          message: error.message, // The error message
          data: error.response?.data, // The response data
        });
      } else {
        // Handle unexpected errors
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  }
  async biometricLogin(credentials: BiometricLoginDTO) {
    try {
      const response = await axios.post(
        `${authEndpoints.biometriclogin}`,
        credentials
      );
      return response.data;
    } catch (error) {
      console.error("Biometric Login error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Login error:", {
          statusCode: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  }
  async registerBiometric(credentials: RegisterBiometricDTO) {
    try {
      const response = await postRequest<
        RegisterBiometricDTO,
        IRegisterBiometricResponse
      >({
        url: authEndpoints.registerBiometric,
        payload: credentials,
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Register Biometric error:", {
          statusCode: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  }
  async refreshToken() {
    try {
      const accessToken = await this.getAccessToken();
      const refreshToken = await this.getRefreshToken();

      if (!accessToken || !refreshToken) {
        return null;
      }

      const response = await axios.post(authEndpoints.refreshtoken, {
        accessToken,
        refreshToken,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Token refresh failed in _performTokenRefresh:", error);
      return null;
    }
  }
  async TwoFactorAuthLogin(details: TwoFactorAuthLoginDTO) {
    try {
      const response = await axios.post(
        `${authEndpoints.twoFactorAuth}`,
        details
      );
      return response.data;
    } catch (error) {
      console.error("Two-Factor Auth Login error:", error);
      throw error;
    }
  }
  async VerifyOtp(details: VerifyOtpDTO) {
    try {
      const response = await axios.post(`${authEndpoints.verifyotp}`, details);
      return response.data;
    } catch (error) {
      console.error("Two-Factor Auth Login error:", error);
      throw error;
    }
  }
  async SendOtp(details: SendOtpDTO) {
    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/auth/sendOtp`,
        details
      );
      return response.data;
    } catch (error) {
      console.error("Send Otp error:", error);
      throw error;
    }
  }
  async Register(userDetails: RegisterDTO) {
    const response = await axios.post(`${authEndpoints.register}`, {
      firstname: userDetails.firstname,
      lastname: userDetails.lastname,
      middlename: userDetails.middlename,
      phoneNumber: userDetails.phoneNumber,
      email: userDetails.email,
      password: userDetails.password,
      businessName: userDetails.businessName,
    });
    return response.data;
  }
  async Logout() {
    await deleteFromStore("sispayuser");
  }
  private refreshPromise: Promise<TokenRefreshResponse | null> | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  // Token Management
  async setTokens(accessToken: string, refreshToken?: string) {
    await SecureStore.setItemAsync("accessToken", accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync("refreshToken", refreshToken);
    }
  }

  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync("accessToken");
  }

  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync("refreshToken");
  }

  async clearTokens() {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  }

  // JWT Token Validation and Refresh
  async isTokenValid(token?: string): Promise<boolean> {
    try {
      const accessToken = token || (await this.getAccessToken());
      if (!accessToken) return false;

      const decoded = jwtDecode<IUserResponse>(accessToken);
      const currentTime = Date.now() / 1000;

      return decoded.exp ? decoded.exp > currentTime : false;
    } catch (error) {
      return false;
    }
  }

  async isTokenExpiringSoon(
    token?: string,
    thresholdSeconds: number = 90
  ): Promise<boolean> {
    try {
      const accessToken = token || (await this.getAccessToken());
      if (!accessToken) return true;

      const decoded = jwtDecode<IUserResponse>(accessToken);
      const currentTime = Date.now() / 1000;

      return decoded.exp ? decoded.exp - currentTime < thresholdSeconds : true;
    } catch (error) {
      return true;
    }
  }

  async refreshAccessToken(): Promise<TokenRefreshResponse | null> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._performTokenRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async _performTokenRefresh(): Promise<TokenRefreshResponse | null> {
    try {
      const accessToken = await this.getAccessToken();
      const refreshToken = await this.getRefreshToken();

      if (!accessToken || !refreshToken) {
        return null;
      }

      const response = await axios.post(authEndpoints.refreshtoken, {
        accessToken,
        refreshToken,
      });

      const result = response.data.result as TokenRefreshResponse;

      if (result.accessToken) {
        await this.setTokens(result.accessToken, result.refreshToken);
        return result;
      }

      return null;
    } catch (error) {
      console.error("Token refresh failed in _performTokenRefresh:", error);
      return null;
    }
  }

  // User Management
  async setUser(user: IUserResponse) {
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    await this.setTokens(user.accessToken, user.refreshToken);

    // Set up proactive token refresh timer
    this.setupTokenRefreshTimer(user.accessToken);
  }

  async getUser(): Promise<IUserResponse | null> {
    try {
      const userStr = await SecureStore.getItemAsync("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  async clearUser() {
    await SecureStore.deleteItemAsync("user");
    await this.clearTokens();

    // Clear refresh timer
    this.clearTokenRefreshTimer();
  }

  // Authentication Check
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser();
    if (!user) return false;

    const isValid = await this.isTokenValid(user.accessToken);
    if (!isValid) {
      // Try to refresh token
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Update user with new token
        const updatedUser = { ...user, accessToken: refreshed.accessToken };
        if (refreshed.refreshToken) {
          updatedUser.refreshToken = refreshed.refreshToken;
        }
        await this.setUser(updatedUser);
        return true;
      }
      return false;
    }

    return true;
  }

  // Get current user with automatic token refresh
  async getCurrentUser(): Promise<IUserResponse | null> {
    const user = await this.getUser();
    if (!user) return null;

    const isValid = await this.isTokenValid(user.accessToken);
    if (!isValid) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        const updatedUser = { ...user, accessToken: refreshed.accessToken };
        if (refreshed.refreshToken) {
          updatedUser.refreshToken = refreshed.refreshToken;
        }
        await this.setUser(updatedUser);
        return updatedUser;
      }
      return null;
    }

    return user;
  }

  // Load user into store (for initialization)
  async loadUserIntoStore(): Promise<IUserResponse | null> {
    const user = await this.getCurrentUser();
    if (user) {
      // Import here to avoid circular dependency
      const { useUserStore } = await import("@/config/store");
      const { setUser, setAuthStatus } = useUserStore.getState();
      setUser(user);
      setAuthStatus(true);
    }
    return user;
  }

  // Decode JWT without validation
  decodeToken(token?: string): IUserResponse | null {
    try {
      const accessToken = token;
      if (!accessToken) return null;
      return jwtDecode<IUserResponse>(accessToken);
    } catch (error) {
      return null;
    }
  }

  // Proactive Token Refresh Timer
  private setupTokenRefreshTimer(accessToken: string) {
    // Clear existing timer
    this.clearTokenRefreshTimer();

    try {
      const decoded = jwtDecode<IUserResponse>(accessToken);
      if (!decoded.exp) return;

      const currentTime = Date.now() / 1000;
      const expiryTime = decoded.exp;
      const timeUntilExpiry = expiryTime - currentTime;

      // Refresh token 5 minutes before expiry (300 seconds)
      const refreshTime = Math.max(0, timeUntilExpiry - 300) * 1000;

      if (refreshTime > 0) {
        this.refreshTimer = setTimeout(async () => {
          console.log("Proactive token refresh triggered");
          try {
            const refreshed = await this.refreshAccessToken();
            if (refreshed?.accessToken) {
              // Update user in store with new token
              const { useUserStore } = await import("@/config/store");
              const { user, setUser } = useUserStore.getState();
              if (user) {
                const updatedUser = {
                  ...user,
                  accessToken: refreshed.accessToken,
                };
                if (refreshed.refreshToken) {
                  updatedUser.refreshToken = refreshed.refreshToken;
                }
                await this.setUser(updatedUser);
                console.log("Token refreshed successfully");
              }
            }
          } catch (error) {
            console.error("Proactive token refresh failed:", error);
          }
        }, refreshTime);

        console.log(
          `Token refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`
        );
      }
    } catch (error) {
      console.error("Failed to setup token refresh timer:", error);
    }
  }

  private clearTokenRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Manual token refresh (for testing or manual triggers)
  async refreshTokenIfNeeded(): Promise<boolean> {
    try {
      const user = await this.getUser();
      if (!user) return false;

      const isExpiringSoon = await this.isTokenExpiringSoon(
        user.accessToken,
        300
      ); // 5 minutes
      if (isExpiringSoon) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed?.accessToken) {
          const updatedUser = { ...user, accessToken: refreshed.accessToken };
          if (refreshed.refreshToken) {
            updatedUser.refreshToken = refreshed.refreshToken;
          }
          await this.setUser(updatedUser);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Manual token refresh failed:", error);
      return false;
    }
  }
}

export default new AuthService();
