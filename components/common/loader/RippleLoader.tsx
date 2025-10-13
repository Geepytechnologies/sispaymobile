import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, Image, StyleSheet } from "react-native";

export default function RippleLoader() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2, // zoom in
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1, // fade in
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.6, // ripple expand
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0, // fade out
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    loopAnimation.start();

    return () => loopAnimation.stop();
  }, [scaleAnim, opacityAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        className={"rounded-full"}
        source={require("@/assets/images/app_icon.png")}
        style={[
          styles.image,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
  },
});
