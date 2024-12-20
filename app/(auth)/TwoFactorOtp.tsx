import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import PrimaryButton from "@/components/common/PrimaryButton";
import SecondaryButton from "@/components/common/SecondaryButton";
import { Link, router, useLocalSearchParams } from "expo-router";
import OTPTextView from "react-native-otp-textinput";
import OTPTextInput from "react-native-otp-textinput";
import * as Clipboard from "expo-clipboard";
import UseCountdownTimer from "@/hooks/useCountdownTimer";
import axios from "axios";
import authService from "@/services/auth.service";
import { TwoFactorAuthLoginDTO } from "@/types/LoginDTO";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import useDeviceInfo from "@/hooks/useDeviceInfo";
import accountService from "@/services/account.service";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useDispatch } from "react-redux";
import { SIGNIN } from "@/config/slices/userSlice";
import { SET_ACCOUNT } from "@/config/slices/accountSlice";
import { SET_TOKENS } from "@/config/slices/authSlice";
import { Colors } from "@/constants/Colors";
import { globalstyles } from "@/styles/common";
import DarkLogo from "@/components/common/DarkLogo";
import { useAuth } from "@/utils/AuthProvider";

type Props = {};

const TwoFactorOtp = (props: Props) => {
  const { setAccessToken } = useAuth();
  const otp = useRef<OTPTextView>(null);
  const { phone, pinId, to } = useLocalSearchParams();
  const deviceinfo = useDeviceInfo();
  const [isLoading, setIsLoading] = useState(false);

  const [otpInput, setOtpInput] = useState<string>("");
  const { padZero, minutes, seconds, setIsRunning, isRunning } =
    UseCountdownTimer();
  const { expoPushToken } = usePushNotifications();
  const axiosInstance = useAxiosPrivate();

  const last4Digits = phone.slice(-4);

  const dispatch = useDispatch();

  const handleCellTextChange = async (text: string, i: number) => {
    if (i === 0) {
      const clippedText = await Clipboard.getStringAsync();
      if (clippedText.slice(0, 1) === text) {
        otp.current?.setValue(clippedText, true);
      }
    }
  };
  const handleSubmit = async () => {
    const data: TwoFactorAuthLoginDTO = {
      //@ts-ignore
      mobileNumber: to,
      otp: otpInput,
      //@ts-ignore
      pinId: pinId,
      pushtoken: expoPushToken || "string",
      deviceDetails: {
        deviceId: deviceinfo.deviceId,
        model: deviceinfo.model,
        manufacturer: deviceinfo.manufacturer,
      },
    };
    setIsLoading(true);
    try {
      const res = await authService.TwoFactorAuthLogin(data);
      dispatch(SIGNIN(res.result));
      setAccessToken(res.result.accessToken);
      const userAccount = await accountService.getUserAccount(axiosInstance);
      dispatch(SET_ACCOUNT(userAccount.result));
      dispatch(
        SET_TOKENS({
          accessToken: res.result.accessToken,
          refreshToken: res.result.refreshToken,
        })
      );

      // router.push("/(tabs)");

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Welcome",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == 400) {
          Toast.show({
            type: "error",
            text1: "Alert",
            text2: error.response.data.message,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={[globalstyles.centerview, { flex: 1, padding: 16 }]}
        >
          <Toast />
          <DarkLogo width={200} />
          <Text className="font-inter font-[700] text-[#000C20] text-[22px]">
            Let&apos;s Complete Your Verification
          </Text>
          <Text className="text-[#A1A1A1] font-[500] text-[13px] mt-[8px]">
            We&apos;ve sent a code to *******{last4Digits}
          </Text>
          <OTPTextInput
            containerStyle={{ marginTop: 30 }}
            textInputStyle={styles.roundedTextInput}
            inputCount={6}
            tintColor={Colors.offset}
            offTintColor={"#00000080"}
            handleTextChange={setOtpInput}
            handleCellTextChange={handleCellTextChange}
            ref={otp}
          />
          <Text className="text-[#A1A1A1]font-inter text-[13px] font-[500] text-center mt-5">
            Didn&apos;t get any code?
            <Text
              disabled={isRunning}
              onPress={() => {}}
              className="text-appblue"
            >
              &nbsp;Resend code
            </Text>
            <Text>&nbsp;In&nbsp;</Text>
            <Text>
              {padZero(minutes)}:{padZero(seconds)}
            </Text>
          </Text>
          <View className="w-full mt-6" style={[{ gap: 10 }]}>
            <TouchableOpacity
              onPress={handleSubmit}
              className="w-full"
              activeOpacity={0.8}
            >
              <PrimaryButton loading={isLoading} text={"Verify"} />
            </TouchableOpacity>
            <TouchableOpacity className="w-full" activeOpacity={0.8}>
              <SecondaryButton text={"Cancel"} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default TwoFactorOtp;

const styles = StyleSheet.create({
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 1,
    shadowRadius: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
  },
});
