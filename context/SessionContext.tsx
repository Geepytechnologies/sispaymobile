import React, { createContext, useContext } from "react";

export interface IUserSettings {
  biometric: boolean;
}

export interface SessionContextType {
  session: boolean;
  setSession: React.Dispatch<React.SetStateAction<boolean>>;
  userOnboarded: boolean;
  userSettings: IUserSettings | undefined;
  setUserSettings: React.Dispatch<
    React.SetStateAction<IUserSettings | undefined>
  >;
  loading: boolean;
}

export const SessionContext = createContext<SessionContextType | null>(null);

export function useSession() {
  const context = useContext(SessionContext);
  if (context === null) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
