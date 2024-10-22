import { StyleSheet, Text, View } from "react-native";
import React from "react";
import DynamicHeader from "@/components/DynamicHeader";

type Props = {};

const settings = (props: Props) => {
  return (
    <View>
      <DynamicHeader title="Settings" />
      <Text>settings</Text>
    </View>
  );
};

export default settings;

const styles = StyleSheet.create({});
