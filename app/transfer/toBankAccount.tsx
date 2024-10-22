import { StyleSheet, Text, View } from "react-native";
import React from "react";
import DynamicHeader from "@/components/DynamicHeader";

type Props = {};

const toBankAccount = (props: Props) => {
  return (
    <View>
      <DynamicHeader title="Transfer To Bank Account" />
    </View>
  );
};

export default toBankAccount;

const styles = StyleSheet.create({});
