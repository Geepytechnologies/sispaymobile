import { router, SplashScreen, useSegments } from "expo-router";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { getFromStore } from "./localstorage";
import authService from "@/services/auth.service";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => null,
});

const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, setAccessToken] = useState<string | null>("");
  const [useronboarded, setUserOnboarded] = useState<boolean>();
  console.log("isUserOnboarded:", useronboarded);
  const segments = useSegments();
  const isAuthGroup = segments[0] === "(auth)";
  const isOnboardingGroup = segments[0] === "(onboarding)";

  const checkIfUserIsOnboarded = async () => {
    const userOnboarded = await getFromStore("useronboarded");
    setUserOnboarded(userOnboarded);
  };

  useEffect(() => {
    checkIfUserIsOnboarded();
    if (!isAuthGroup && !accessToken) {
      if (!useronboarded && !isOnboardingGroup && useronboarded !== undefined) {
        SplashScreen.hideAsync();
        router.replace("/(onboarding)");
        return;
      }
      SplashScreen.hideAsync();

      router.replace("/(auth)/Login");
    }
    if (isAuthGroup && accessToken) {
      SplashScreen.hideAsync();

      router.replace("/(tabs)");
    }
  }, [segments, accessToken]);
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuth = () => useContext(AuthContext);
