import { CONSTANTS } from "@/constants";
import axios from "axios";
import { getFromStore } from "./localstorage";
import { loginResponseDTO } from "@/types/common/loginResponseDTO";

const getToken = async (): Promise<loginResponseDTO | null> => {
  const user = await getFromStore("sispayuser");
  return user.accessToken;
};

export const axiosPrivate = axios.create({
  baseURL: CONSTANTS.APIURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPrivate.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    console.log(token);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
