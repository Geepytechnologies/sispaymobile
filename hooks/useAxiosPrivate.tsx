import { useEffect } from "react";
import useRefreshtoken from "./useRefreshToken";
import axios from "axios";
import { addToStore } from "@/utils/localstorage";
import { useUserStore } from "@/config/store";
import { axiosInstance } from "@/config/axios";
import authService from "@/services/auth.service";
import { useSegments } from "expo-router";
import Auth from "@/utils/auth";
import { jwtDecode } from "jwt-decode";

const useAxiosPrivate = () => {
  const { user, clearUser } = useUserStore((state) => state);

  const refresh = useRefreshtoken();

  const segments = useSegments();
  const currentScreen = segments[segments.length - 1];

  const handleLogout = async () => {
    await authService.Logout();
    await addToStore("currentScreen", currentScreen);
    clearUser();
  };
  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      async (config) => {
        // Attach current access token
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${user?.accessToken}`;
        }
        // Proactive refresh if token is near expiry (<60s)
        try {
          const token = user?.accessToken;
          if (token) {
            const decoded: any = jwtDecode(token);
            if (decoded?.exp) {
              const now = Date.now() / 1000;
              if (decoded.exp - now < 60) {
                const refreshed = await refresh(user?.accessToken);
                if (refreshed?.accessToken) {
                  await Auth.setToken(refreshed.accessToken);
                  if (refreshed.refreshToken)
                    await Auth.setRefreshToken(refreshed.refreshToken);
                  config.headers[
                    "Authorization"
                  ] = `Bearer ${refreshed.accessToken}`;
                }
              }
            }
          }
        } catch {}
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (axios.isAxiosError(error)) {
          // console.error("res:", {
          //   statusCode: error.response?.status,
          //   message: error.message,
          //   data: error.response?.data,
          // });
        }
        const prevRequest = error?.config;
        if (
          error?.response?.status === 403 ||
          (error?.response?.status === 401 && !prevRequest.sent)
        ) {
          prevRequest.sent = true;
          try {
            const refreshed = await refresh(user?.accessToken);
            if (refreshed?.accessToken) {
              await Auth.setToken(refreshed.accessToken);
              if (refreshed.refreshToken)
                await Auth.setRefreshToken(refreshed.refreshToken);
              prevRequest.headers[
                "Authorization"
              ] = `Bearer ${refreshed.accessToken}`;
            }
            return axios(prevRequest);
          } catch (refreshError) {
            handleLogout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(responseIntercept);
      axiosInstance.interceptors.request.eject(requestIntercept);
    };
  }, [user?.accessToken, refresh]);

  return axiosInstance;
};

export default useAxiosPrivate;
