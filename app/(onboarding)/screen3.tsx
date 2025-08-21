import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { use } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "@/components/common/PrimaryButton";
import { addToStore } from "@/utils/localstorage";
import { router } from "expo-router";
import { useUserStore } from "@/config/store";

type Props = {};

const screen3 = (props: Props) => {
  const { setUserOnboarded } = useUserStore();
  const handleCompleteOnboarding = async () => {
    setUserOnboarded(true);
    requestAnimationFrame(() => router.push("/(auth)/Register"));
  };
  return (
    <View className="bg-black flex-1">
      <ImageBackground
        className="flex-1"
        source={require("@/assets/images/onboardbg.jpeg")}
        resizeMode="contain"
      >
        <View className="p-3 mt-auto">
          <View className="flex flex-col justify-center items-center bg-white min-h-[350px] rounded-[50px] p-[22px] ">
            <Text className="font-[700] text-[32px] leading-10 font-popp max-w-[221px] text-center">
              All Accounts In One App
            </Text>
            <Text className="opacity-50 mt-[8px] max-w-[203px] text-center">
              Making transaction easy with amazing experience{" "}
            </Text>
            <TouchableOpacity
              onPress={handleCompleteOnboarding}
              className="mt-[28px] w-full"
              activeOpacity={0.8}
            >
              <PrimaryButton text="Continue" loading={false} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default screen3;

const styles = StyleSheet.create({});
