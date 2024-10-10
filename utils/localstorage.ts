import * as SecureStore from "expo-secure-store";

async function addToStore(key: string, data: any) {
  await SecureStore.setItemAsync(key, JSON.stringify(data));
}

async function getFromStore(Key: string) {
  const value = await SecureStore.getItemAsync(Key);
  return value ? JSON.parse(value) : null;
}

async function deleteFromStore(Key: string) {
  await SecureStore.deleteItemAsync(Key);
}

export { addToStore, getFromStore, deleteFromStore };
