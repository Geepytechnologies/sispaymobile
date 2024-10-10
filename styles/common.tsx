import { ScreenDimensions } from "@/constants/Dimensions";
import { StyleSheet } from "react-native";

export const globalstyles = StyleSheet.create({
  rowview: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  hr: {
    backgroundColor: "#E0E0E0",
    height: 0.5,
    width: "100%",
  },
  colview: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  fullscreencenterview: {
    display: "flex",
    width: ScreenDimensions.screenWidth,
    height: ScreenDimensions.screenHeight,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  centerview: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
