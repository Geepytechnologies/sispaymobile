import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { Image } from "react-native";

type Props = {
  amount: any;
};

const SuccessPayment = ({ amount }: Props) => {
  return (
    <View className="p-5 bg-white items-center justify-center m-6 rounded-2xl">
      <View className="flex w-full h-full absolute top-0 left-0">
        <Image
          source={require("@/assets/images/sispaylogo2.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
          className="opacity-10"
        />
      </View>
      <LottieView
        style={{ width: 200, height: 200 }}
        source={require("@/assets/images/lottie/successicon.json")}
        autoPlay
        loop
      />
      <Text className="text-2xl font-[500]">Successful</Text>
      {/* <Text className="font-[500] text-xl">₦{amount}</Text> */}
    </View>
  );
};

export default SuccessPayment;

const styles = StyleSheet.create({});
