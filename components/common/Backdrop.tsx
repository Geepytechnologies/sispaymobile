import React from "react";
import { TouchableOpacity, View } from "react-native";

export const Backdrop = ({ action }: { action: () => void }) => {
  return (
    <TouchableOpacity
      onPress={action}
      style={{ flex: 1, backgroundColor: "black" }}
    ></TouchableOpacity>
  );
};
