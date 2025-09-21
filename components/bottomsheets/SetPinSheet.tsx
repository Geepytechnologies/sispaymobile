import { StyleSheet, Text, View } from "react-native";
import React, { forwardRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import BackDrop from "./BackDrop";
import SecureKeypad from "../dialogs/SecureKeypad";
import { useCreateAccountPin } from "@/queries/account";

type Props = {
  paymentAction: any;
  processing: boolean;
};

const SetPinSheet = forwardRef<BottomSheet, Props>(
  ({ paymentAction, processing }, ref) => {
    const { createPin, creatingPin } = useCreateAccountPin({
      onSuccess: (data) => {
        console.log("Pin set successfully", data);
      },
      onError: (error) => {
        console.log("Error setting pin", error);
      },
    });
    const [pin, setPin] = React.useState("");
    const [confirmPin, setConfirmPin] = React.useState(false);
    const [secondPinInput, setSecondPinInput] = React.useState("");
    const [isError, setIsError] = React.useState(false);
    const storePin = (pin: string) => {
      setPin(pin);
      setConfirmPin(true);
      console.log("storing pin", pin);
    };
    const storeSecondPin = (value: string) => {
      setSecondPinInput(value);
      if (value === pin) {
        createPin(pin);
      } else {
        setIsError(true);
        setConfirmPin(false);
        setPin("");
        setSecondPinInput("");
      }
      console.log("storing second pin", pin);
    };
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
            {!confirmPin ? "Set Payment PIN" : "Confirm Payment PIN"}
          </Text>
          {!confirmPin ? (
            <SecureKeypad
              isError={false}
              setIsError={() => {}}
              pinAction={storePin}
              loading={false}
            />
          ) : (
            confirmPin && (
              <SecureKeypad
                isError={isError}
                setIsError={() => {}}
                pinAction={storeSecondPin}
                loading={creatingPin}
              />
            )
          )}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default SetPinSheet;

const styles = StyleSheet.create({});
