import { CONSTANTS } from "@/constants";
import axios from "axios";
import { getFromStore } from "./localstorage";

const getAccessToken = async (): Promise<string> => {
  const user = await getFromStore("sispayuser");
  return user.accessToken;
};
const getRefreshToken = async (): Promise<string> => {
  const user = await getFromStore("sispayuser");
  return user.refreshToken;
};

export const Api = axios.create({
  baseURL: CONSTANTS.APIURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// axiosPrivate.interceptors.request.use(
//   async (config) => {
//     const token = await getToken();
//     console.log(token);
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
