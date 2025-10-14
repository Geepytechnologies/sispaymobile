import { View, Text } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import Auth from "@/utils/auth";

type Props = {
  children: React.ReactNode;
};
interface IUserSettings {
  biometric: boolean;
}
interface SessionContextType {
  session: boolean;
  setSession: React.Dispatch<React.SetStateAction<boolean>>;
  userOnboarded: boolean;
  userSettings: IUserSettings | undefined;
  setUserSettings: React.Dispatch<
    React.SetStateAction<IUserSettings | undefined>
  >;
  loading: boolean;
}
const SessionContext = createContext<SessionContextType | null>(null);

const SessionProvider = ({ children }: Props) => {
  const [error, setError] = useState(null);
  const [session, setSession] = useState<boolean>(false);
  const [userOnboarded, setUserOnboarded] = useState<boolean>(false);
  const [userSettings, setUserSettings] = useState<IUserSettings>();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, checkUserOnboarded, getUserProfileSettings } = Auth;
  const checkAuth = async () => {
    setLoading(true);
    try {
      const result = await isAuthenticated();
      const onboardPass = await checkUserOnboarded();
      const settings = await getUserProfileSettings();
      setUserSettings(settings);
      setSession(result);
      setUserOnboarded(onboardPass);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
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
    </SessionContext.Provider>
  );
};

export function useSession() {
  const context = useContext(SessionContext);
  if (context === null) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export default SessionProvider;
