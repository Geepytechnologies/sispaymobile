import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import DynamicHeader from "@/components/DynamicHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { useSession } from "@/context/SessionProvider";

type Props = {};

const settings = (props: Props) => {
  const { userSettings, setUserSettings } = useSession();
  const [biometric, setBiometric] = useState(userSettings?.biometric);

  useEffect(() => {
    setUserSettings((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        biometric: biometric ?? false,
      };
    });
  }, [biometric]);

  const handleBiometricToggle = () => {
    setBiometric(!biometric);
  };

  return (
    <SafeAreaView style={{ padding: 16, flex: 1 }}>
      <DynamicHeader title="Settings" />
      <View className="flex flex-col gap-5 mt-10">
        <TouchableOpacity
          activeOpacity={0.9}
          className="flex flex-row items-center p-5 rounded-[20px] bg-white justify-between"
        >
          <Text className="font-Poppins">Change Transaction PIN</Text>
          <FontAwesome6 name="angle-right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          className="flex flex-row items-center p-5 rounded-[20px] bg-white justify-between"
        >
          <Text className="font-Poppins">Change Password</Text>
          <FontAwesome6 name="angle-right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          className="flex flex-row items-center p-5 rounded-[20px] bg-white justify-between"
        >
          <Text className="font-Poppins">Forgot Pin</Text>
          <FontAwesome6 name="angle-right" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex flex-row items-center p-5 rounded-[20px] bg-white justify-between">
          <Text className="font-Poppins">Biometric</Text>
          {biometric ? (
            <FontAwesome5
              onPress={handleBiometricToggle}
              name="toggle-on"
              size={24}
              color="green"
            />
          ) : (
            <FontAwesome5
              onPress={handleBiometricToggle}
              name="toggle-off"
              size={24}
              color="green"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default settings;

const styles = StyleSheet.create({});
