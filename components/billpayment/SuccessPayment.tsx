import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

type Props = {
  amount: any;
};

const SuccessPayment = ({ amount }: Props) => {
  return (
    <View className="p-5 bg-white items-center justify-center m-6 rounded-2xl">
      <LottieView
        style={{ width: 200, height: 200 }}
        source={require("@/assets/images/lottie/successicon.json")}
        autoPlay
        loop
      />
      <Text className="text-lg">Successful</Text>
      <Text className="font-[500] text-xl">₦{amount}</Text>
    </View>
  );
};

export default SuccessPayment;

const styles = StyleSheet.create({});
