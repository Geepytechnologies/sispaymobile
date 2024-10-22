import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

type Props = {};

const ServiceWidget = (props: Props) => {
  return (
    <View className="bg-white px-3 py-6 my-5 shadow-md rounded-xl">
      <View className="flex flex-row justify-between">
        {/* Airtime */}
        <Link href={"/billpayment"}>
          <View className="flex flex-col">
            <View
              style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
              className="flex items-center justify-center rounded-full h-[50px] w-[50px] 
            "
            >
              <MaterialIcons
                name="call-made"
                size={24}
                color={Colors.primary}
              />
            </View>
            <Text className="text-[12px] font-popp font-[500] text-center">
              Airtime
            </Text>
          </View>
        </Link>
        {/* Data */}
        <View className="flex flex-col">
          <View
            style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
            className="flex items-center justify-center rounded-full h-[50px] w-[50px] 
            "
          >
            <MaterialIcons
              name="network-wifi"
              size={24}
              color={Colors.primary}
            />
          </View>
          <Text className="text-[12px] font-popp font-[500] text-center">
            Data
          </Text>
        </View>
        {/* Tv */}
        <View className="flex flex-col">
          <View
            style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
            className="flex items-center justify-center rounded-full h-[50px] w-[50px] 
            "
          >
            <Feather name="tv" size={24} color={Colors.primary} />
          </View>
          <Text className="text-[12px] font-popp font-[500] text-center">
            Tv
          </Text>
        </View>
        {/* Betting */}
        <View className="flex flex-col">
          <View
            style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
            className="flex items-center justify-center rounded-full h-[50px] w-[50px] 
            "
          >
            <Ionicons name="football-sharp" size={24} color={Colors.primary} />
          </View>
          <Text className="text-[12px] font-popp font-[500] text-center">
            Betting
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ServiceWidget;

const styles = StyleSheet.create({});
