import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

type Props = {};

const BackDrop = (props: any) => {
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.3}
    />
  );
};

export default BackDrop;

const styles = StyleSheet.create({});
