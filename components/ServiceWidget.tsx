import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Zocial,
} from "@expo/vector-icons";
import { Link, router } from "expo-router";

type Props = {};

const ServiceWidget = (props: Props) => {
  return (
    <>
      <View className="flex flex-row gap-2 w-full">
        {/* To Sispay */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/transfer/ToSispay")}
          className="flex flex-col flex-1"
        >
          <View
            style={[{ backgroundColor: "#DCFCE7" }]}
            className="flex flex-row items-center gap-2 justify-center rounded-[20px] h-[90px] w-full 
            "
          >
            <View className="rounded-full bg-[#F46717] w-[50px] h-[50px] flex items-center justify-center">
              <FontAwesome name="user-o" size={24} color="white" />
            </View>
            <Text className="text-[12px] font-popp font-[500]">To Sispay</Text>
          </View>
        </TouchableOpacity>
        {/* To Bank */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/transfer/toBankAccount")}
          className="flex flex-col flex-1"
        >
          <View
            style={[{ backgroundColor: "#FFEDD5" }]}
            className="flex flex-row items-center gap-2 justify-center rounded-[20px] h-[90px] w-full 
            "
          >
            <View className="rounded-full bg-[#2A7B0B] w-[50px] h-[50px] flex items-center justify-center">
              <MaterialCommunityIcons
                name="greenhouse"
                size={24}
                color={"white"}
              />
            </View>
            <Text className="text-[12px] font-popp font-[500]">To Bank</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Withdraw */}
      <TouchableOpacity
        onPress={() => router.push("/withdraw")}
        activeOpacity={0.8}
        className="flex flex-col flex-1"
      >
        <View
          style={[{ backgroundColor: "#DBEAFE" }]}
          className="flex flex-row items-center gap-2 justify-center rounded-[20px] h-[90px] w-full 
            "
        >
          <View className="rounded-full bg-[#910FE1] w-[50px] h-[50px] flex items-center justify-center">
            <MaterialCommunityIcons
              name="bank-transfer"
              size={24}
              color={"white"}
            />
          </View>

          <Text className="text-[12px] font-popp font-[500] text-center">
            Withdraw
          </Text>
        </View>
      </TouchableOpacity>
      <View className="flex flex-row gap-2 w-full">
        {/* Airtime */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/billpayment")}
          className="flex flex-col flex-1"
        >
          <View
            style={[{ backgroundColor: "#DCFCE7" }]}
            className="flex flex-row items-center gap-2 justify-center rounded-[20px] h-[90px] w-full 
            "
          >
            <View className="rounded-full bg-[#07AF0E] w-[50px] h-[50px] flex items-center justify-center">
              <FontAwesome5 name="phone-alt" size={24} color="white" />
            </View>

            <Text className="text-[12px] font-popp font-[500] text-center">
              Airtime
            </Text>
          </View>
        </TouchableOpacity>
        {/* Data */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/billpayment/buydata")}
          className="flex flex-col flex-1"
        >
          <View
            style={[{ backgroundColor: "#DCFCE7" }]}
            className="flex flex-row items-center gap-2 justify-center rounded-[20px] h-[90px] w-full 
            "
          >
            <View className="rounded-full bg-[#910FE1] w-[50px] h-[50px] flex items-center justify-center">
              <MaterialIcons name="wifi" size={24} color="white" />
            </View>
            <Text className="text-[12px] font-popp font-[500] text-center">
              Data
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Qr Code */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("/transfer/qrCodePage")}
        className="flex flex-col flex-1"
      >
        <View
          style={[{ backgroundColor: "#DCFCE7" }]}
          className="flex flex-row items-center gap-2 justify-center rounded-[20px] h-[90px] w-full 
            "
        >
          <View className="rounded-full bg-[#07AF0E] w-[50px] h-[50px] flex items-center justify-center">
            <FontAwesome name="qrcode" size={24} color="white" />
          </View>

          <Text className="text-[12px] font-popp font-[500] text-center">
            QR Code
          </Text>
        </View>
      </TouchableOpacity>
      <View className="flex flex-row gap-2 w-full">
        {/* Tv */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/billpayment/tv")}
          className="flex flex-col flex-1"
        >
          <View
            style={[{ backgroundColor: "#FEE2E2" }]}
            className="flex flex-row items-center gap-2 justify-center rounded-[20px] h-[90px] w-full 
            "
          >
            <View className="rounded-full bg-[#0064FF] w-[50px] h-[50px] flex items-center justify-center">
              <Feather name="tv" size={24} color="white" />
            </View>
            <Text className="text-[12px] font-popp font-[500] text-center">
              Tv
            </Text>
          </View>
        </TouchableOpacity>
        {/* Electricity */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/billpayment")}
          className="flex flex-col flex-1"
        >
          <View
            style={[{ backgroundColor: "#FEE2E2" }]}
            className="flex flex-row items-center gap-2 justify-center rounded-[20px] h-[90px] w-full 
            "
          >
            <View className="rounded-full bg-[#0064FF] w-[50px] h-[50px] flex items-center justify-center">
              <MaterialIcons name="electric-bolt" size={24} color="white" />
            </View>
            <Text className="text-[12px] font-popp font-[500] text-center">
              Electricity
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ServiceWidget;

const styles = StyleSheet.create({});
