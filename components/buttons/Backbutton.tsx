import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

type Props = {};

const Backbutton = (props: Props) => {
  return (
    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
      <FontAwesome name="angle-left" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default Backbutton;

const styles = StyleSheet.create({});
