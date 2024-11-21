import React from "react";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

const index = (props: Props) => {
  return <Redirect href={"/(tabs)"} />;
};

export default index;
