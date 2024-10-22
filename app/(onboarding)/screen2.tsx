import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider2 from "@/assets/images/slider2.svg";
import PrimaryButton from "@/components/common/PrimaryButton";
import { router } from "expo-router";

type Props = {};

const screen2 = (props: Props) => {
  return (
    <SafeAreaView className="p-6 bg-white" style={{ flex: 1 }}>
      {/* logo */}
      <View className="w-full flex items-center justify-center">
        <Image
          source={require("@/assets/images/sispaylogo.png")}
          style={styles.logoimage}
          resizeMode="contain"
        />
      </View>
      {/* content */}
      <View className="flex flex-col items-center">
        {/* <Cards /> */}
        <View className="w-full flex items-center justify-center">
          <Image
            source={require("@/assets/images/cardreader.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <Text className="font-popp text-[36px] font-[400] mt-[18px] text-appblue">
          <Text className="font-light">For Seamless{"\n"}</Text>
          <Text>online{"\n"}</Text>
          <Text className="font-[700]">Transaction</Text>
        </Text>
        <Slider2 className="mt-[50px]" />
        <Text className="text-[12px] font-[600] text-appblue tracking-[0.18px] mt-[30px]">
          Skip {">>>"}
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/(onboarding)/screen3")}
          className="mt-[28px] w-full"
          activeOpacity={0.8}
        >
          <PrimaryButton text="Continue" />
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
