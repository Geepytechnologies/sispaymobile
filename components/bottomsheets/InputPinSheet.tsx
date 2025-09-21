import { StyleSheet, Text, View } from "react-native";
import React, { forwardRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import BackDrop from "./BackDrop";
import SecureKeypad from "../dialogs/SecureKeypad";

type Props = {
  validatePin: (pin: string) => void;
  validatingPin: boolean;
  isError?: boolean;
  setIsError: (val: boolean) => void;
};

const InputPinSheet = forwardRef<BottomSheet, Props>(
  ({ validatePin, validatingPin, isError, setIsError }, ref) => {
    return (
      <BottomSheet
        backdropComponent={BackDrop}
        index={-1}
        ref={ref}
        snapPoints={["60%"]}
      >
        <BottomSheetView style={{ paddingTop: 20 }}>
          <View className="flex items-center justify-center my-2">
            <Text className="text-appblue text-xs font-Poppins font-[700]">
              🛡️ Sispay Secure Numeric Keypad
            </Text>
          </View>
          <Text className="self-center text-lg font-Poppins">
            Enter Payment PIN
          </Text>

          <SecureKeypad
            isError={isError ?? false}
            setIsError={setIsError}
            pinAction={validatePin}
            loading={validatingPin}
          />
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default InputPinSheet;

const styles = StyleSheet.create({});
