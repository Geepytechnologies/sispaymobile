import { StyleSheet, Text, View } from "react-native";
import React from "react";

type Props = {
  text: string;
};

const PrimaryButton = ({ text }: Props) => {
  return (
    <View className="rounded-[20px] bg-black py-[15px] flex items-center justify-center">
      <Text className="text-white font-popp font-[600] tracking-[0.24px]">
        {text}
      </Text>
    </View>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({});
