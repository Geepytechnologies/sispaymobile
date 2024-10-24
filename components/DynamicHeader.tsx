import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalstyles } from "@/styles/common";
import Backbutton from "./buttons/Backbutton";
import { Link } from "expo-router";

type Props = {
  title: string;
};

const DynamicHeader = ({ title }: Props) => {
  return (
    <View style={[globalstyles.rowview, { justifyContent: "space-between" }]}>
      <Backbutton />
      <Text className="text-base font-[600]">{title}</Text>
      <Link href={"/(tabs)/transactions"}>History</Link>
    </View>
  );
};

export default DynamicHeader;

const styles = StyleSheet.create({});
