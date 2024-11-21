import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { LoadingIndicator } from "./LoadingIndicator";

type Props = {
  text: string;
  loading: boolean;
};

const PrimaryButton = ({ text, loading }: Props) => {
  return (
    <View className="rounded-[20px] bg-black py-[15px] flex items-center justify-center">
      {loading ? (
        <LoadingIndicator />
      ) : (
        <Text className="text-white font-popp font-[600] tracking-[0.24px]">
          {text}
        </Text>
      )}
    </View>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({});
