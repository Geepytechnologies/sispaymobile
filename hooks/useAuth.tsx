import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { getFromStore } from "@/utils/localstorage";
import { loginResponseDTO } from "@/types/common/loginResponseDTO";
import { useDispatch, useSelector } from "react-redux";
import { SIGNIN } from "@/config/slices/userSlice";
import { RootState } from "@/config/store";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authloading, setAuthloading] = useState(true);
  const [userOnboarded, setUserOnboarded] = useState();
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("i called checkauth");
        const user = await getFromStore("sispayuser");
        if (user && user.accessToken) {
          dispatch(SIGNIN(user));
          setIsAuthenticated(true);
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

  return { isAuthenticated, authloading, userOnboarded };
};

export default useAuth;
