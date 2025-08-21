import authService from "@/services/auth.service";
import { addToStore, getFromStore } from "@/utils/localstorage";
import { useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { AppState } from "react-native";
import { useUserStore } from "@/config/store";

const useScreenState = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [savedScreen, setSavedScreen] = useState(null);
  const segments = useSegments();
  const currentScreen = segments[segments.length - 1];
  const { clearUser } = useUserStore();

  // Do not force logout on background anymore; just remember the last screen
  const handleLogout = async () => {};

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          // App has come to the foreground, restore state
          const savedScreenData = await getFromStore("currentScreen");
          setSavedScreen(savedScreenData);
        } else if (nextAppState === "background") {
          await addToStore("currentScreen", currentScreen);
        }
        setAppState(nextAppState);
      }
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return { savedScreen };
};

export default useScreenState;
