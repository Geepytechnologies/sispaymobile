import { CONSTANTS } from "@/constants";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: CONSTANTS.APIURL,
  headers: {
    "Content-Type": "application/json",
  },
});
