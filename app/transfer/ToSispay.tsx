import { StyleSheet, Text, View } from "react-native";
import React from "react";
import DynamicHeader from "@/components/DynamicHeader";

type Props = {};

const ToSispay = (props: Props) => {
  return (
    <View>
      <DynamicHeader title="Transfer To Sispay Account" />
    </View>
  );
};

export default ToSispay;

const styles = StyleSheet.create({});
