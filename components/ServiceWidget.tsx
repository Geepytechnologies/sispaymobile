import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

type Props = {};

const ServiceWidget = (props: Props) => {
  return (
    <View className="flex flex-row justify-between">
      {/* Airtime */}
      <Link suppressHighlighting href={"/billpayment"}>
        <View className="flex flex-col">
          <View
            style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
            className="flex items-center justify-center rounded-full h-[50px] w-[50px] 
            "
          >
            <MaterialIcons name="call-made" size={24} color={Colors.primary} />
          </View>
          <Text className="text-[12px] font-popp font-[500] text-center">
            Airtime
          </Text>
        </View>
      </Link>
      {/* Data */}
      <Link suppressHighlighting href={"/billpayment/buydata"}>
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
      </Link>
      {/* Tv */}
      <Link suppressHighlighting href={"/billpayment/tv"}>
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
      </Link>
      {/* Electricity */}
      <View className="flex flex-col">
        <View
          style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
          className="flex items-center justify-center rounded-full h-[50px] w-[50px] 
            "
        >
          <MaterialIcons
            name="electric-bolt"
            size={24}
            color={Colors.primary}
          />
        </View>
        <Text className="text-[12px] font-popp font-[500] text-center">
          Electricity
        </Text>
      </View>
    </View>
  );
};

export default ServiceWidget;

const styles = StyleSheet.create({});
