import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import DarkLogo from "@/components/common/DarkLogo";
import PrimaryButton from "@/components/common/PrimaryButton";
import { Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { loginSchema } from "@/validation/authValidation";
import { joiResolver } from "@hookform/resolvers/joi";
import { LoginDTO, SendOtpDTO } from "@/types/LoginDTO";
import authService from "@/services/auth.service";
import useDeviceInfo from "@/hooks/useDeviceInfo";
import { formatPhoneNumber } from "@/utils/formatters";
import { Platform } from "react-native";
import { ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { addToStore } from "@/utils/localstorage";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import axios from "axios";
import { useAuth } from "@/utils/AuthProvider";
import accountService from "@/services/account.service";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import { saveUser } from "@/utils/userStore";
import Auth from "@/utils/auth";
import { useUserStore } from "@/config/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Props = {};

const Login = (props: Props) => {
  const { setAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordvisible, setPasswordvisible] = useState(false);
  const deviceinfo = useDeviceInfo();
  const { expoPushToken } = usePushNotifications();
  const axiosPrivate = useAxiosPrivate();
  const { setToken, setRefreshToken } = Auth;
  const { setUser } = useUserStore();

  const [formData, setFormData] = useState({ phone: "", password: "" });

  const handleChange = (name: any, value: any) => {
    setFormData({ ...formData, [name]: value });
  };
  const togglePassword = () => {
    setPasswordvisible(!passwordvisible);
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(loginSchema),
  });
  const onSubmit = async (data: any) => {
    setLoading(true);
    const formattedNumber = formatPhoneNumber(data.phone);
    const formdetails: LoginDTO = {
      phone: formattedNumber,
      password: data.password,
      pushtoken: expoPushToken || "none",
      deviceDetails: {
        deviceId: deviceinfo.deviceId,
        model: deviceinfo.model,
        manufacturer: deviceinfo.manufacturer,
      },
      // deviceDetails: {
      //   deviceId: "string",
      //   model: "string",
      //   manufacturer: "string",
      // },
    };
    try {
      const res = await authService.signin(formdetails);
      await setToken(res.result.accessToken);
      await setRefreshToken(res.result.refreshToken);
      setUser(res.result);
      setAccessToken(res.result.accessToken);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Welcome",
      });
      router.push("/(tabs)");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == 400) {
          Toast.show({
            type: "error",
            text1: "Login Failure",
            text2: error.response?.data.message,
          });
        }
        if (
          error.response?.status == 401 &&
          error.response.data.message ==
            "Detected a login from a new device and OTP was sent"
        ) {
          Toast.show({
            type: "info",
            text1: "Alert",
            text2: "Detected a login from a new device",
          });
          router.push({
            pathname: "/(auth)/TwoFactorOtp",
            params: {
              phone: formattedNumber,
              password: data.password,
              pinId: error.response.data.result.pinId,
              to: error.response.data.result.to,
            },
          });
        }
        if (
          error.response?.status == 401 &&
          error.response.data.message ==
            "Detected a login from a new device but OTP was unsuccessful"
        ) {
          Toast.show({
            type: "info",
            text1: "Alert",
            text2: "Error sending OTP",
          });
        }
        if (error.response?.status == 404) {
          Toast.show({
            type: "error",
            text1: "Login Failure",
            text2: error.response?.data.message,
          });
        }

        if (
          error.response?.data.message ==
          "detected a login from a new device but otp was unsuccessful"
        ) {
          Toast.show({
            type: "error",
            text1: "Login Failed",
            text2: "Try Again Later",
          });
        }
        if (error.response?.data.message == "User is not verified") {
          const data: SendOtpDTO = {
            name: error.response?.data.result.Firstname,
            mobileNumber: error.response?.data.result.PhoneNumber,
          };
          const res = await authService.SendOtp(data);
          if (res.statusCode == 200) {
            router.push({
              pathname: "/(auth)/Otp",
              params: {
                pinId: error.response.data.result.pinId,
                to: error.response.data.result.to,
              },
            });
          }
          Toast.show({
            type: "error",
            text1: "Alert",
            text2: "User not verified",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1, padding: 44 }}
      enableOnAndroid={true}
      extraScrollHeight={60}
    >
      <View className="flex-1 justify-center">
        <Toast />
        <View className="flex-1">
          <DarkLogo width={200} />
          <Text className="font-inter font-[700] text-[#000C20] text-[24px]">
            Login
          </Text>
          <Text className="text-[#A1A1A1] font-[500] text-[13px] mt-[8px]">
            Please enter your email address or phone number and password to log
            in to your account
          </Text>
          {/* form */}
          <View className="flex flex-col mt-[18px]">
            {/* Phone */}
            <View className="flex flex-col mb-[21px]">
              <Text className="font-inter font-[600] text-[#000C20] text-[18px] mb-[14px]">
                Phone Number
              </Text>
              <View
                style={[
                  styles.inputboxcon,
                  { borderColor: errors.phone ? "red" : "#E2EFFF" },
                ]}
              >
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[
                        styles.inputbox,
                        { borderColor: errors.phone ? "red" : "#E2EFFF" },
                      ]}
                      className="p-[15px]"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="08012355312"
                      placeholderTextColor={"#A1A1A1"}
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>
              {errors.phone?.message &&
                typeof errors.phone.message === "string" && (
                  <Text
                    style={{ color: "#ef4444", fontSize: 12, marginTop: 5 }}
                  >
                    {errors.phone.message}
                  </Text>
                )}
            </View>
            {/* password */}
            <View className="flex flex-col mb-[21px]">
              <Text className="font-inter font-[600] text-[#000C20] text-[18px] mb-[14px]">
                Password
              </Text>
              <View
                className="flex flex-row items-center"
                style={[
                  styles.inputboxcon,
                  { borderColor: errors.password ? "red" : "#E2EFFF" },
                ]}
              >
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[
                        styles.inputbox,
                        {
                          borderColor: errors.password ? "red" : "#E2EFFF",
                        },
                      ]}
                      className="flex-1 border-r-0 p-[15px]"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="112233"
                      placeholderTextColor={"#A1A1A1"}
                      keyboardType="numeric"
                      secureTextEntry={!passwordvisible}
                    />
                  )}
                />

                <Feather
                  style={{ marginRight: 15 }}
                  suppressHighlighting
                  onPress={() => togglePassword()}
                  name={passwordvisible ? "eye" : "eye-off"}
                  size={17}
                  color="black"
                />
              </View>

              {errors.password?.message &&
                typeof errors.password.message === "string" && (
                  <Text
                    style={{ color: "#ef4444", fontSize: 12, marginTop: 5 }}
                  >
                    {errors.password.message}
                  </Text>
                )}
            </View>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              className="mt-[28px] mb-[22px] w-full"
              activeOpacity={0.8}
            >
              <PrimaryButton
                loaderSize={20}
                loading={loading}
                text={"Continue"}
              />
            </TouchableOpacity>
            <Text className="text-[#A1A1A1]font-inter text-[13px] font-[500] text-center">
              Don&apos;t have an account?
              <Link
                suppressHighlighting
                href={"/(auth)/Register"}
                className="text-appblue"
              >
                &nbsp;Sign Up
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  inputbox: {
    borderRadius: 8,
    borderColor: "#E2EFFF",
    backgroundColor: "#F6FAFF",
  },
  inputboxcon: {
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#E2EFFF",
    backgroundColor: "#F6FAFF",
  },
});
