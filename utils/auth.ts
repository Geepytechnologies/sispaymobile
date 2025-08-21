import { IUserResponse } from "@/interfaces/responses/user.interface";
import { Router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { isEmpty } from "lodash";
import * as SecureStore from "expo-secure-store";
import { getFromStore } from "./localstorage";

async function setToken(token: string) {
  await SecureStore.setItemAsync("accessToken", token);
}

async function setRefreshToken(token: string) {
  await SecureStore.setItemAsync("refreshToken", token);
}

async function getToken() {
  return await SecureStore.getItemAsync("accessToken");
}

async function getRefreshToken() {
  return await SecureStore.getItemAsync("refreshToken");
}
async function getDecodedJwt(tkn = ""): Promise<IUserResponse> {
  try {
    const token = await getToken();
    const t = token || tkn;
    const decoded = jwtDecode<IUserResponse>(t);
    return decoded;
  } catch (error) {
    return {} as IUserResponse;
  }
}

async function checkUserOnboarded() {
  const userOnboarded = await getFromStore("useronboarded");
  return userOnboarded ? JSON.parse(userOnboarded) : false;
}

async function isAuthenticated() {
  try {
    const decodedToken = await getDecodedJwt();
    if (!isEmpty(decodedToken)) {
      const { exp } = decodedToken;
      const currentTime = Date.now() / 1000;

      if (exp) {
        return exp > currentTime;
      }

      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

async function removeToken(router?: Router) {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");

  if (router) {
    router.push("/(auth)/Login");
  }
}

const Auth = {
  getDecodedJwt,
  getRefreshToken,
  getToken,
  isAuthenticated,
  checkUserOnboarded,
  setRefreshToken,
  setToken,
  removeToken,
};

export default Auth;
