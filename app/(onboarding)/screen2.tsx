import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider2 from "@/assets/images/slider2.svg";
import PrimaryButton from "@/components/common/PrimaryButton";
import { router } from "expo-router";

type Props = {};

const screen2 = (props: Props) => {
  const handleSkip = () => {
    requestAnimationFrame(() => router.replace("/(auth)/Register"));
  };
  return (
    <SafeAreaView className="p-[35px] bg-white" style={{ flex: 1 }}>
      {/* logo */}
      <View className="w-full flex items-center justify-center">
        <Image
          source={require("@/assets/images/sispaylogo.png")}
          style={styles.logoimage}
          resizeMode="contain"
        />
      </View>
      {/* content */}
      <View className="flex flex-col items-center mt-3 flex-1">
        {/* <Cards /> */}
        <View className="w-full flex items-center justify-center h-[300px]">
          <Image
            source={require("@/assets/images/cardreader.png")}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View className="flex items-center mt-[28px] mb-[51px]">
          <Text className="font-popp text-[36px] font-[400] text-center w-[291px] text-appblue">
            <Text className="font-light">For Seamless{"\n"}</Text>
            <Text>online{"\n"}</Text>
            <Text className="font-[700]">Transaction.</Text>
          </Text>
        </View>
        <Slider2 className="mt-[50px]" />
        <Text
          onPress={handleSkip}
          className="text-[12px] font-[600] text-appblue tracking-[0.18px] mt-[30px]"
        >
          Skip {">>>"}
        </Text>
        <TouchableOpacity
          onPress={() =>
            requestAnimationFrame(() => router.replace("/(onboarding)/screen3"))
          }
          className="mt-auto w-full"
          activeOpacity={0.8}
        >
          <PrimaryButton text="Continue" loading={false} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default screen2;

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: undefined,
    aspectRatio: 1,
  },
  logoimage: {
    width: 100,
    height: undefined,
    aspectRatio: 1,
  },
});
