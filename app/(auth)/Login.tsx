import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import DarkLogo from "@/components/common/DarkLogo";
import PrimaryButton from "@/components/common/PrimaryButton";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { loginSchema } from "@/validation/authValidation";
import { joiResolver } from "@hookform/resolvers/joi";
import { LoginDTO } from "@/types/LoginDTO";
import authService from "@/services/auth.service";
import useDeviceInfo from "@/hooks/useDeviceInfo";
import { formatPhoneNumber } from "@/utils/formatters";
import { Platform } from "react-native";
import { ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { useGlobalContext } from "@/config/slices/GlobalSlice";
import { addToStore } from "@/utils/localstorage";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useDispatch } from "react-redux";
import { SIGNIN } from "@/config/slices/userSlice";

type Props = {};

const Login = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [passwordvisible, setPasswordvisible] = useState(false);
  const deviceinfo = useDeviceInfo();
  const { expoPushToken } = usePushNotifications();
  const dispatch = useDispatch();

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
      pushtoken: expoPushToken || "",
      // deviceDetails: {
      //   deviceId: deviceinfo.deviceId,
      //   model: deviceinfo.model,
      //   manufacturer: deviceinfo.manufacturer,
      // },
      deviceDetails: {
        deviceId: "string",
        model: "string",
        manufacturer: "string",
      },
    };
    try {
      const res = await authService.signin(formdetails);
      console.log(res);
      dispatch(SIGNIN(res.result));

      await addToStore("sispayuser", res.result);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Welcome",
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      className="p-[44px] bg-white flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <Toast />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
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
                  { borderColor: errors.email ? "red" : "#E2EFFF" },
                ]}
              >
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
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
                      className="flex-1"
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
              <PrimaryButton text={loading ? "Processing..." : "Continue"} />
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  inputbox: {},
  inputboxcon: {
    borderRadius: 8,
    backgroundColor: "#F6FAFF",
    borderWidth: 1.5,
    borderColor: "#E2EFFF",
    padding: 15,
  },
});
