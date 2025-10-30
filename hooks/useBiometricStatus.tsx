import { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";

export function useBiometricStatus() {
  const [hasHardware, setHasHardware] = useState<boolean | null>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const hardware = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setHasHardware(hardware);
        setIsEnrolled(enrolled);
      } catch (err) {
        setHasHardware(false);
        setIsEnrolled(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  return { hasHardware, isEnrolled, loading };
}
