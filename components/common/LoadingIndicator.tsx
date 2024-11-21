import React from "react";
import { ActivityIndicator } from "react-native";

export const LoadingIndicator = ({ size }: { size: number }) => {
  return <ActivityIndicator size={size || "large"} color={"white"} />;
};
