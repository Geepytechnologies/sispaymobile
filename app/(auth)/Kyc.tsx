import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import DarkLogo from "@/components/common/DarkLogo";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import PrimaryButton from "@/components/common/PrimaryButton";
import { Keyboard } from "react-native";
import accountService, { VerificationType } from "@/services/account.service";
import { globalstyles } from "@/styles/common";
import { router } from "expo-router";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";

type Props = {};

const Kyc = (props: Props) => {
  const [identityNumber, setIdentityNumber] = useState("");
  const [identityType, setIdentityType] = useState<string>("BVN");
  const [loading, setLoading] = useState(false);
  const InitiateVerification = async () => {
    setLoading(true);
    try {
      const res = await accountService.InitiateVerification(
        identityType,
        identityNumber
      );
      console.log(res);
      if (res) {
        router.push({
          pathname: "/(auth)/KycOtp",
          params: { IdentityId: res.result._id, identityType, identityNumber },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
        <DarkLogo width={200} />
        <View
          style={[
            globalstyles.rowview,
            { gap: 6, justifyContent: "center", marginVertical: 10 },
          ]}
        >
          <FontAwesome5 name="user-check" size={24} color={Colors.primary} />
          <Text className="text-appblue font-mont font-[600] text-4xl ">
            Kyc
          </Text>
        </View>
        <Text className="text-center">
          Please provide your BVN/NIN to proceed
        </Text>
        <View
          style={[
            globalstyles.rowview,
            { gap: 10, marginVertical: 20, justifyContent: "space-between" },
          ]}
        >
          {/* BVN */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIdentityType("BVN")}
            className="rounded-[20px] flex-1 p-[14px] min-w-[150px] h-[76px] "
            style={[
              globalstyles.rowview,
              {
                gap: 5,
                backgroundColor: identityType == "BVN" ? "#ade0bf" : "#EDEDED",
              },
            ]}
          >
            <View
              style={[
                globalstyles.centerview,
                {
                  backgroundColor:
                    identityType == "BVN" ? "#F46717" : "#D2D2D2",
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                },
              ]}
            >
              <FontAwesome5
                name="user-check"
                size={24}
                color={identityType == "BVN" ? "white" : "#5C616F"}
              />
            </View>
            <Text>BVN</Text>
          </TouchableOpacity>
          {/* NIN */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIdentityType("NIN")}
            className="rounded-[20px] flex-1 p-[14px] min-w-[150px] h-[76px]"
            style={[
              globalstyles.rowview,
              {
                gap: 5,
                backgroundColor: identityType == "NIN" ? "#ade0bf" : "#EDEDED",
              },
            ]}
          >
            <View
              style={[
                globalstyles.centerview,
                {
                  backgroundColor:
                    identityType == "NIN" ? "#F46717" : "#D2D2D2",
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                },
              ]}
            >
              <FontAwesome5
                name="user-check"
                size={24}
                color={identityType == "NIN" ? "white" : "#5C616F"}
              />
            </View>
            <Text>NIN</Text>
          </TouchableOpacity>
        </View>
        <Text className="font-inter text-[14px] font-[600]">
          {identityType}&nbsp;Number
        </Text>
        <TextInput
          onChangeText={(text) => setIdentityNumber(text)}
          keyboardType="numeric"
          className="border p-3 rounded-[8px] border-gray-400 my-2"
          placeholder="Identification Number"
        />
        <TouchableOpacity
          disabled={loading}
          activeOpacity={0.8}
          onPress={InitiateVerification}
          className="mt-4"
        >
          <PrimaryButton loading={loading} text={"Submit"} />
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Kyc;

const styles = StyleSheet.create({});
