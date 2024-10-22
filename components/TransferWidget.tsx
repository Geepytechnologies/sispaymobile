import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons, Zocial } from "@expo/vector-icons";
import { router } from "expo-router";

type Props = {};

const TransferWidget = (props: Props) => {
  return (
    <View className="bg-white px-3 py-6 my-5 shadow-md rounded-xl">
      <View className="flex flex-row justify-between">
        {/* To Sispay */}
        <View className="flex flex-col">
          <View
            style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
            className="flex items-center justify-center rounded-full h-[50px] w-[50px] 
            "
          >
            <Zocial name="persona" size={24} color={Colors.primary} />
          </View>
          <Text className="text-[12px] font-popp font-[500]">To Sispay</Text>
        </View>
        {/* To Bank */}
        <View className="flex flex-col">
          <View
            style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
            className="flex items-center justify-center rounded-full h-[50px] w-[50px] 
            "
          >
            <MaterialCommunityIcons
              name="greenhouse"
              size={24}
              color={Colors.primary}
            />
          </View>
          <Text className="text-[12px] font-popp font-[500]">To Bank</Text>
        </View>
        {/* Withdraw */}
        <TouchableOpacity
          onPress={() => router.push("/withdraw")}
          activeOpacity={0.8}
          className="flex flex-col"
        >
          <View
            style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
            className="flex items-center justify-center rounded-full h-[50px] w-[50px] 
            "
          >
            <MaterialCommunityIcons
              name="bank-transfer"
              size={30}
              color={Colors.primary}
            />
          </View>
          <Text className="text-[12px] font-popp font-[500] text-center">
            Withdraw
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransferWidget;

const styles = StyleSheet.create({});
