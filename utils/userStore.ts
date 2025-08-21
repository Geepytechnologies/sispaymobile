import { IUserResponse } from "@/interfaces/responses/user.interface";
import * as SecureStore from "expo-secure-store";

export async function saveUser(user: IUserResponse) {
  await SecureStore.setItemAsync("user", JSON.stringify(user));
}

export async function getUser() {
  const result = await SecureStore.getItemAsync("user");
  return result ? JSON.parse(result) : null;
}

export async function clearUser() {
  await SecureStore.deleteItemAsync("user");
}
