import { useEffect, useState } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? false);
      setConnectionType(state.type);
      setIsInternetReachable(state.isInternetReachable ?? false);
    });

    // initial fetch (for first render)
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected ?? false);
      setConnectionType(state.type);
      setIsInternetReachable(state.isInternetReachable ?? false);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, isInternetReachable, connectionType };
}
