import { AppState, AppStateStatus, View, Text } from "react-native";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

import Auth from "@/utils/auth";
import * as LocalAuthentication from "expo-local-authentication";
import { getFromStore } from "@/utils/localstorage";
import Toast from "react-native-toast-message";
import EnableBiometricsSheet from "@/components/bottomsheets/EnableBiometricsSheet";
import {
  SessionContext,
  useSession,
  IUserSettings,
  SessionContextType,
} from "./SessionContext";
import { useBiometricStatus } from "@/hooks/useBiometricStatus";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import appStateService from "@/services/appState.service";

type Props = {
  children: React.ReactNode;
};

const SessionProvider = ({ children }: Props) => {
  const [session, setSession] = useState<boolean>(false);
  const [userOnboarded, setUserOnboarded] = useState<boolean>(false);
  const [userSettings, setUserSettings] = useState<IUserSettings>();
  const [loading, setLoading] = useState(false);
  const [showBiometricsSheet, setShowBiometricsSheet] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );
  const { hasHardware, isEnrolled } = useBiometricStatus();
  const { isConnected, isInternetReachable } = useNetworkStatus();

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastBackgroundTime = useRef<number | null>(null);

  const { isAuthenticated, checkUserOnboarded, getUserProfileSettings } = Auth;
  useEffect(() => {
    if (isConnected === false || isInternetReachable === false) {
      Toast.show({
        type: "error",
        text1: "No Internet Connection",
        text2: "Please check your network and try again.",
        position: "top",
      });
    }
  }, [isConnected, isInternetReachable]);
  // =========================
  // 🧩 Core Auth Logic
  // =========================
  const checkAuth = async () => {
    setLoading(true);
    try {
      const onboardPass = await checkUserOnboarded();
      const settings = await getUserProfileSettings();
      setUserSettings(settings);
      const result = await isAuthenticated();
      setSession(result);
      setUserOnboarded(onboardPass);
    } catch (error) {
      console.warn("Auth error:", error);
      setSession(false);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🪄 Initial Auth Check
  // =========================
  useEffect(() => {
    checkAuth();
    const unsubscribe = appStateService.initialize?.();

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        loading,
        userOnboarded,
        userSettings,
        setUserSettings,
        setSession,
      }}
    >
      {children}
      <EnableBiometricsSheet
        visible={showBiometricsSheet}
        onClose={() => setShowBiometricsSheet(false)}
      />
    </SessionContext.Provider>
  );
};

export default SessionProvider;
