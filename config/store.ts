import { create } from "zustand";
import { IUserResponse } from "@/interfaces/responses/user.interface";
import { persist } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { IAccountDTO } from "@/interfaces/responses/account.interface";

const secureStorage: import("zustand/middleware").PersistStorage<UserStore> = {
  getItem: async (key: string) => {
    const value = await SecureStore.getItemAsync(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (key: string, value: any) => {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};
export type UserStore = {
  user: IUserResponse | null;
  userAccount: IAccountDTO | null;
  setUser: (user: IUserResponse) => void;
  clearUser: () => void;
  setUserAccount: (account: any) => void;
  // backward compatible alias
  setAccount: (account: any) => void;
  isUserOnboarded: boolean;
  setUserOnboarded: (status: boolean) => void;
  isAuthenticated: boolean | null;
  setAuthStatus: (status: boolean | null) => void;
  // PIN Management
  inputtedPin: string;
  setInputtedPin: (pin: string) => void;
  hasPin: boolean;
  setHasPin: (hasPin: boolean) => void;
  isPinLocked: boolean;
  setIsPinLocked: (isLocked: boolean) => void;
  pinAttemptsRemaining: number;
  setPinAttemptsRemaining: (attempts: number) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      userAccount: null,
      isAuthenticated: null,
      isUserOnboarded: false,
      // PIN Management
      inputtedPin: "",
      hasPin: false,
      isPinLocked: false,
      pinAttemptsRemaining: 3,

      setUserOnboarded: (status) => set({ isUserOnboarded: status }),
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () =>
        set({
          user: null,
          userAccount: null,
          isAuthenticated: false,
          hasPin: false,
          isPinLocked: false,
          pinAttemptsRemaining: 3,
        }),
      setUserAccount: (account: any) => set({ userAccount: account }),
      setAccount: (account: any) => set({ userAccount: account }),
      setAuthStatus: (status) => set({ isAuthenticated: status }),

      // PIN Management Actions
      setInputtedPin: (pin: string) => set({ inputtedPin: pin }),

      setHasPin: (hasPin) => set({ hasPin }),
      setIsPinLocked: (isLocked) => set({ isPinLocked: isLocked }),
      setPinAttemptsRemaining: (attempts) =>
        set({ pinAttemptsRemaining: attempts }),
    }),
    {
      name: "auth-secure-store",
      storage: secureStorage,
    }
  )
);
