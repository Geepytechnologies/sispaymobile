import axios, { InternalAxiosRequestConfig } from "axios";
import { useUserStore } from "@/config/store";

const Api = axios.create({
  baseURL: "https://sispay.up.railway.app/api",
  // baseURL: "http://20.121.63.47:5034/api",
});

Api.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (config: InternalAxiosRequestConfig<any>) => {
    // Get token directly from store - no async calls needed
    const { user } = useUserStore.getState();
    if (user?.accessToken) {
      config.headers["Authorization"] = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors with token refresh (fallback mechanism)
    // Note: Proactive token refresh should prevent most 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.warn("401 error detected - attempting token refresh (fallback)");

      try {
        // Import auth service dynamically to avoid circular dependency
        const authService = (await import("@/services/auth.service")).default;
        const refreshed = await authService.refreshAccessToken();

        if (refreshed?.accessToken) {
          // Update the authorization header with new token
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${refreshed.accessToken}`;

          // Update store with new token
          const { useUserStore } = await import("@/config/store");
          const { user, setUser } = useUserStore.getState();
          if (user) {
            const updatedUser = { ...user, accessToken: refreshed.accessToken };
            if (refreshed.refreshToken) {
              updatedUser.refreshToken = refreshed.refreshToken;
            }
            setUser(updatedUser);
          }

          // Retry the original request
          return Api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.error("Token refresh failed (fallback):", refreshError);
        const { useUserStore } = await import("@/config/store");
        const { clearUser } = useUserStore.getState();
        clearUser();

        // You might want to redirect to login here
        // router.replace("/(auth)/Login");
      }
    }

    return Promise.reject(error);
  }
);

export default Api;
