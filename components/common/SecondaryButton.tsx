import { StyleSheet, Text, View } from "react-native";
import React from "react";

type Props = {
  text: string;
};

const SecondaryButton = ({ text }: Props) => {
  return (
    <View className="rounded-[20px] border border-appblue py-[15px] flex items-center justify-center">
      <Text className="text-appblue font-popp font-[600] tracking-[0.24px]">
        {text}
      </Text>
    </View>
  );
};

export default SecondaryButton;

const styles = StyleSheet.create({});
