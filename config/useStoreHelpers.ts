import * as SecureStore from "expo-secure-store";
import { useUserStore } from "./store";

export const restoreUserStore = async () => {
  try {
    const persistedData = await SecureStore.getItemAsync("auth-secure-store");
    if (!persistedData) return;

    const parsed = JSON.parse(persistedData);
    const state = parsed.state;
    if (!state) return;

    const {
      setUser,
      setUserAccount,
      setAuthStatus,
      setUserOnboarded,
      setHasPin,
      setIsPinLocked,
      setPinAttemptsRemaining,
    } = useUserStore.getState();

    setUser(state.user);
    setUserAccount(state.userAccount);
    setAuthStatus(state.isAuthenticated);
    setUserOnboarded(state.isUserOnboarded);

    // Restore PIN info
    setHasPin(state.hasPin);
    setIsPinLocked(state.isPinLocked);
    setPinAttemptsRemaining(state.pinAttemptsRemaining);
  } catch (error) {
    console.error("Failed to restore user store:", error);
  }
};
