import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import React, { useMemo, useRef } from "react";
import { useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { renderBackdrop } from "../billpayment/buydata";
import { ScreenDimensions } from "@/constants/Dimensions";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import SecondaryButton from "@/components/common/SecondaryButton";
import PrimaryButton from "@/components/common/PrimaryButton";
import { router } from "expo-router";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const permissionsModalRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%"], []);

  const showmodal = () => {
    permissionsModalRef.current?.expand();
  };
  const closeModal = () => {
    permissionsModalRef.current?.close();
  };
  const Backdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      children={
        <Image
          className="w-full h-full"
          source={require("@/assets/images/splashscreen.png")}
        />
      }
      opacity={1} // You can customize the opacity here
    />
  );

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  const handlePermissions = () => {
    closeModal();
    requestPermission();
  };

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <>
        <BottomSheet
          backdropComponent={Backdrop}
          snapPoints={snapPoints}
          //   index={-1}
          ref={permissionsModalRef}
        >
          <BottomSheetView className="min-h-[400px] p-7 bg-slate-50 ">
            <FontAwesome
              className="text-center"
              name="camera"
              size={50}
              color={Colors.primary}
            />
            <Text className="text-[25px] font-[600] text-center mt-2">
              Enable Camera Access
            </Text>
            <Text className="text-lg text-center font-Poppins mt-2">
              We need your permission to show the camera
            </Text>

            <View className="flex flex-row gap-3 items-center justify-between mt-20">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex-1"
              >
                <SecondaryButton text={"Decline"} />
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1"
                onPress={handlePermissions}
                activeOpacity={0.8}
              >
                <PrimaryButton text="Accept" loading={false} />
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View> */}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
