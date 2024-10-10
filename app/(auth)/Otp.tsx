import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import PrimaryButton from "@/components/common/PrimaryButton";
import SecondaryButton from "@/components/common/SecondaryButton";
import { Link } from "expo-router";
import OTPTextView from "react-native-otp-textinput";
import OTPTextInput from "react-native-otp-textinput";
import * as Clipboard from "expo-clipboard";

type Props = {};

const Otp = (props: Props) => {
  const otp = useRef<OTPTextView>(null);
  const [otpInput, setOtpInput] = useState<string>("");

  const handleCellTextChange = async (text: string, i: number) => {
    if (i === 0) {
      const clippedText = await Clipboard.getStringAsync();
      if (clippedText.slice(0, 1) === text) {
        otp.current?.setValue(clippedText, true);
      }
    }
  };
  return (
    <View>
      <Text className="font-inter font-[700] text-[#000C20] text-[24px]">
        Please check Your Phone
      </Text>
      <Text className="text-[#A1A1A1] font-[500] text-[13px] mt-[8px]">
        We&apos;ve sent a code to *******42314
      </Text>
      <OTPTextInput
        textInputStyle={styles.roundedTextInput}
        inputCount={6}
        tintColor={"red"}
        offTintColor={"#00000080"}
        handleTextChange={setOtpInput}
        handleCellTextChange={handleCellTextChange}
        ref={otp}
      />
      <Text className="text-[#A1A1A1]font-inter text-[13px] font-[500] text-center">
        Didn&apos;t get any code?
        <Link
          suppressHighlighting
          href={"/(auth)/Register"}
          className="text-appblue"
        >
          &nbsp;Resend code
        </Link>
      </Text>
      <Text>4:58</Text>
      <TouchableOpacity className="w-full" activeOpacity={0.8}>
        <PrimaryButton text={"Verify"} />
      </TouchableOpacity>
      <TouchableOpacity className="w-full" activeOpacity={0.8}>
        <SecondaryButton text={"Cancel"} />
      </TouchableOpacity>
    </View>
  );
};

export default Otp;

const styles = StyleSheet.create({
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 1,
    shadowRadius: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
  },
});
