import { SET_TOKENS } from "@/config/slices/authSlice";
import authService from "@/services/auth.service";
import { addToStore, getFromStore } from "@/utils/localstorage";
import { useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { AppState } from "react-native";
import { useDispatch } from "react-redux";

const useScreenState = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [savedScreen, setSavedScreen] = useState(null);
  const segments = useSegments();
  const currentScreen = segments[segments.length - 1];
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await authService.Logout();
    dispatch(SET_TOKENS({ accessToken: "", refreshToken: "" }));
  };

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
          // App has gone to the background, save state

          handleLogout();
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
