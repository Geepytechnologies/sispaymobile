import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { registerSchema } from "@/validation/authValidation";
import { RegisterDTO } from "@/types/RegisterDTO";
import authService from "@/services/auth.service";
import Toast from "react-native-toast-message";
import axios from "axios";
import { formatPhoneNumber } from "@/utils/formatters";

type Props = {};

const Register = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [passwordvisible, setPasswordvisible] = useState(false);
  const [passwordvisible2, setPasswordvisible2] = useState(false);

  const [formData, setFormData] = useState({ phone: "", password: "" });

  const handleChange = (name: any, value: any) => {
    setFormData({ ...formData, [name]: value });
  };
  const togglePassword = (number: number) => {
    if (number == 1) {
      setPasswordvisible(!passwordvisible);
    }
    if (number == 2) {
      setPasswordvisible2(!passwordvisible2);
    }
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    const formdetails: RegisterDTO = {
      firstname: data.firstname,
      lastname: data.lastname,
      middlename: "",
      phoneNumber: formatPhoneNumber(data.phone),
      email: data.email,
      password: data.password,
      businessName: data.businessname,
    };
    setLoading(true);
    try {
      const res = await authService.Register(formdetails);
      if (res.statusCode == 200) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Registration Successful",
        });
        const OtpRes = await authService.SendOtp({
          name: data.firstname,
          mobileNumber: formatPhoneNumber(data.phone),
        });
        if (OtpRes.message == "OTP sent successfully.") {
          router.push({
            pathname: "/(auth)/Otp",
            params: {
              phone: OtpRes.result.to,
              pinId: OtpRes.result.pinId,
              to: OtpRes.result.to,
            },
          });
        }
      }
      console.log(res);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
        if (error.response?.status == 409) {
          Toast.show({
            type: "error",
            text1: "Alert",
            text2: error.response.data.message,
          });
        }
        if (error.response?.status == 400) {
          Toast.show({
            type: "error",
            text1: "Alert",
            text2: "Try Again Later",
          });
        }
      }
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
      <View style={{ zIndex: 100 }}>
        <Toast />
      </View>
      <ScrollView
        className="pb-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 pb-14">
          <DarkLogo width={200} />
          <Text className="font-inter font-[700] text-[#000C20] text-[24px]">
            Create An Account
          </Text>
          <Text className="text-[#A1A1A1] font-[500] text-[13px] mt-[8px]">
            Please complete all input fields to create your account
          </Text>
          {/* form */}
          <View className="flex flex-col mt-[18px]">
            {/*first Name */}
            <View className="flex flex-col mb-[21px]">
              <Text className="font-inter font-[600] text-[#000C20] text-[18px] mb-[14px]">
                Firstname
              </Text>
              <View
                style={[
                  styles.inputboxcon,
                  { borderColor: errors.firstname ? "#ef4444" : "#E2EFFF" },
                ]}
              >
                <Controller
                  control={control}
                  name="firstname"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Lizzie"
                      placeholderTextColor={"#A1A1A1"}
                      keyboardType="default"
                    />
                  )}
                />
              </View>
              {errors.firstname?.message &&
                typeof errors.firstname.message === "string" && (
                  <Text
                    style={{ color: "#ef4444", fontSize: 12, marginTop: 5 }}
                  >
                    {errors.firstname.message}
                  </Text>
                )}
            </View>
            {/*Last Name */}
            <View className="flex flex-col mb-[21px]">
              <Text className="font-inter font-[600] text-[#000C20] text-[18px] mb-[14px]">
                Lastname
              </Text>
              <View
                style={[
                  styles.inputboxcon,
                  { borderColor: errors.lastname ? "#ef4444" : "#E2EFFF" },
                ]}
              >
                <Controller
                  control={control}
                  name="lastname"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Ayuba"
                      placeholderTextColor={"#A1A1A1"}
                      keyboardType="default"
                    />
                  )}
                />
              </View>
              {errors.lastname?.message &&
                typeof errors.lastname.message === "string" && (
                  <Text
                    style={{ color: "#ef4444", fontSize: 12, marginTop: 5 }}
                  >
                    {errors.lastname.message}
                  </Text>
                )}
            </View>
            {/*Business Name */}
            <View className="flex flex-col mb-[21px]">
              <Text className="font-inter font-[600] text-[#000C20] text-[18px] mb-[14px]">
                Business Name
              </Text>
              <View
                style={[
                  styles.inputboxcon,
                  { borderColor: errors.businessname ? "#ef4444" : "#E2EFFF" },
                ]}
              >
                <Controller
                  control={control}
                  name="businessname"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="AyubaLimited"
                      placeholderTextColor={"#A1A1A1"}
                      keyboardType="default"
                    />
                  )}
                />
              </View>
              {errors.businessname?.message &&
                typeof errors.businessname.message === "string" && (
                  <Text
                    style={{ color: "#ef4444", fontSize: 12, marginTop: 5 }}
                  >
                    {errors.businessname.message}
                  </Text>
                )}
            </View>
            {/* Email */}
            <View className="flex flex-col mb-[21px]">
              <Text className="font-inter font-[600] text-[#000C20] text-[18px] mb-[14px]">
                Email Address
              </Text>
              <View
                style={[
                  styles.inputboxcon,
                  { borderColor: errors.email ? "red" : "#E2EFFF" },
                ]}
              >
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="name@email.com"
                      placeholderTextColor={"#A1A1A1"}
                      keyboardType="email-address"
                    />
                  )}
                />
              </View>
              {errors.email?.message &&
                typeof errors.email.message === "string" && (
                  <Text
                    style={{ color: "#ef4444", fontSize: 12, marginTop: 5 }}
                  >
                    {errors.email.message}
                  </Text>
                )}
            </View>
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
                  onPress={() => togglePassword(1)}
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
            {/* confirm password */}
            <View className="flex flex-col mb-[21px]">
              <Text className="font-inter font-[600] text-[#000C20] text-[18px] mb-[14px]">
                Confirm Password
              </Text>
              <View
                className="flex flex-row items-center"
                style={[
                  styles.inputboxcon,
                  { borderColor: errors.confirmpassword ? "red" : "#E2EFFF" },
                ]}
              >
                <Controller
                  control={control}
                  name="confirmpassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="flex-1"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="112233"
                      placeholderTextColor={"#A1A1A1"}
                      keyboardType="numeric"
                      secureTextEntry={!passwordvisible2}
                    />
                  )}
                />

                <Feather
                  suppressHighlighting
                  onPress={() => togglePassword(2)}
                  name={passwordvisible2 ? "eye" : "eye-off"}
                  size={17}
                  color="black"
                />
              </View>

              {errors.confirmpassword?.message &&
                typeof errors.confirmpassword.message === "string" && (
                  <Text
                    style={{ color: "#ef4444", fontSize: 12, marginTop: 5 }}
                  >
                    {errors.confirmpassword.message}
                  </Text>
                )}
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="mt-[28px] mb-[22px] w-full"
              activeOpacity={0.8}
            >
              <PrimaryButton text="Next" loading={loading} />
            </TouchableOpacity>
            <Text className="text-[#A1A1A1]font-inter text-[13px] font-[500] text-center">
              Already have an account?
              <Link
                suppressHighlighting
                href={"/(auth)/Login"}
                className="text-appblue"
              >
                &nbsp;Login
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  inputbox: {},
  inputboxcon: {
    borderRadius: 8,
    backgroundColor: "#F6FAFF",
    borderWidth: 1.5,
    padding: 15,
  },
});
