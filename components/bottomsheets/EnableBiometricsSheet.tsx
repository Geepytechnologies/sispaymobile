import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { useSession, IUserSettings } from "@/context/SessionContext";
import { addToStore } from "@/utils/localstorage";
import Toast from "react-native-toast-message";
import BackDrop from "./BackDrop";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const EnableBiometricsSheet = ({ visible, onClose }: Props) => {
  const { userSettings, setUserSettings } = useSession();

  const handleEnableBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        // If device doesn't support biometrics or not enrolled, just close and do nothing
        onClose();
        return;
      }

      // Test biometric authentication before enabling
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Verify your identity to enable biometric login",
        fallbackLabel: "Use password instead",
      });

      if (result.success) {
        // Update user settings
        const newSettings = { ...userSettings, biometric: true };
        setUserSettings(newSettings);

        // Store the updated settings
        await addToStore("userSettings", newSettings);

        Toast.show({
          type: "success",
          text1: "Biometrics Enabled",
          text2: "You can now use fingerprint or face ID to login",
        });
      }
      onClose();
    } catch (error) {
      console.error("Biometric setup error:", error);
      Toast.show({
        type: "error",
        text1: "Setup Failed",
        text2: "Could not enable biometric login",
      });
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <BackDrop visible={visible} onClose={onClose}>
      <View className="bg-white rounded-t-[32px] p-6">
        <View className="items-center mb-6">
          <View className="w-12 h-1 bg-gray-300 rounded-full mb-4" />
          <Ionicons name="finger-print-outline" size={60} color="#007AFF" />
          <Text className="text-xl font-bold mt-4 mb-2">
            Enable Biometric Login
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Use your fingerprint or face ID for quick and secure access to your
            account
          </Text>
        </View>

        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 p-4 rounded-xl border border-gray-300"
          >
            <Text className="text-center text-gray-600 font-semibold">
              Not Now
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEnableBiometrics}
            className="flex-1 p-4 rounded-xl bg-appblue"
          >
            <Text className="text-center text-white font-semibold">Enable</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BackDrop>
  );
};

export default EnableBiometricsSheet;
