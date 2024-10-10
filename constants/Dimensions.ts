import { Dimensions } from "react-native";

export class ScreenDimensions {
  static screenHeight = Dimensions.get("window").height;
  static screenWidth = Dimensions.get("window").width;
}
