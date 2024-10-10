import { RootState } from "@/config/store";
import { router, Slot, SplashScreen, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFromStore } from "./localstorage";
import { SIGNIN } from "@/config/slices/userSlice";

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const { currentuser } = useSelector((state: RootState) => state.user);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authloading, setAuthloading] = useState(true);
  const [userOnboarded, setUserOnboarded] = useState();
  const dispatch = useDispatch();

  const segments = useSegments();
  const authGroup = segments[0] === "(auth)";

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("i called checkauth");
        const user = await getFromStore("sispayuser");
        if (user && user.accessToken) {
          dispatch(SIGNIN(user));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth status", error);
        setIsAuthenticated(false);
      } finally {
        setAuthloading(false);
      }
    };
    const checkOnboarding = async () => {
      const res = (await getFromStore("useronboarded")) || false;
      setUserOnboarded(res);
    };

    checkAuthStatus();
    checkOnboarding();
  }, [currentuser]);

  useEffect(() => {
    if (!authloading) {
      SplashScreen.hideAsync();
      if (!userOnboarded) {
        router.push("/onboarding");
      } else {
        if (!isAuthenticated && !authGroup) {
          router.push("/(auth)/Login");
        }
        if (isAuthenticated) {
          router.push("/(tabs)");
        }
      }
    }
  }, [isAuthenticated]);
  return <>{children}</>;
};
