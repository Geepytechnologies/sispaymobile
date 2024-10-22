import { useEffect } from "react";
import useRefreshtoken from "./useRefreshToken";
import axios from "axios";
import { addToStore, getFromStore } from "@/utils/localstorage";
import { Keys } from "@/constants/Keys";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/config/store";
import { axiosInstance } from "@/config/axios";
import authService from "@/services/auth.service";
import { useSegments } from "expo-router";
import { SET_TOKENS } from "@/config/slices/authSlice";

const useAxiosPrivate = () => {
  const refresh = useRefreshtoken();
  const { currentuser } = useSelector((state: RootState) => state.user);
  const accessToken = currentuser && currentuser.accessToken;
  const segments = useSegments();
  const currentScreen = segments[segments.length - 1];
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await authService.Logout();
    await addToStore("currentScreen", currentScreen);
    dispatch(SET_TOKENS({ accessToken: "", refreshToken: "" }));
  };
  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      async (config) => {
        console.log(accessToken);
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
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
            const newAccessToken = await refresh();
            // console.log("newaccesstoken", newAccessToken);
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
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
  }, [accessToken, refresh]);

  return axiosInstance;
};

export default useAxiosPrivate;
