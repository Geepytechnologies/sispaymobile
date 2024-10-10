import { useEffect } from "react";
import useRefreshtoken from "./useRefreshToken";
import axios from "axios";
import { getFromStore } from "@/utils/localstorage";
import { Keys } from "@/constants/Keys";

const useAxiosPrivate = () => {
  const refresh = useRefreshtoken();
  const accessToken = getFromStore(Keys.userAccessToken);

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refresh();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axios(prevRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        if (error.response?.status === 401) {
          // Handle 401 Unauthorized errors silently
          return;
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseIntercept);
      axios.interceptors.request.eject(requestIntercept);
    };
  }, [accessToken, refresh]);

  return axios;
};

export default useAxiosPrivate;
