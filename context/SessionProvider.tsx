import { View, Text } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import Auth from "@/utils/auth";

type Props = {
  children: React.ReactNode;
};
interface SessionContextType {
  session: boolean;
  setSession: React.Dispatch<React.SetStateAction<boolean>>;
  userOnboarded: boolean;
  loading: boolean;
}
const SessionContext = createContext<SessionContextType | null>(null);

const SessionProvider = ({ children }: Props) => {
  const [error, setError] = useState(null);
  const [session, setSession] = useState<boolean>(false);
  const [userOnboarded, setUserOnboarded] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, checkUserOnboarded } = Auth;
  const checkAuth = async () => {
    setLoading(true);
    try {
      const result = await isAuthenticated();
      const onboardPass = await checkUserOnboarded();
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
      value={{ session, loading, userOnboarded, setSession }}
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
