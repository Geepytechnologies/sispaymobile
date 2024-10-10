import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

type Props = {
  width: number;
};

const DarkLogo = ({ width }: Props) => {
  return (
    <View className="w-full flex items-center justify-center">
      <Image
        source={require("@/assets/images/sispaylogo.png")}
        style={[styles.logoimage, { width: width }]}
        resizeMode="contain"
      />
    </View>
  );
};

export default DarkLogo;

const styles = StyleSheet.create({
  logoimage: {
    height: undefined,
    aspectRatio: 1,
  },
});
