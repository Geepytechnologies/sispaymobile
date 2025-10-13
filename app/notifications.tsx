import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import DynamicHeader from "@/components/DynamicHeader";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

const notifications = (props: Props) => {
  const [activeTab, setActiveTab] = useState<"Transactions" | "Activities">(
    "Transactions"
  );

  const toggleTab = (tab: "Transactions" | "Activities") => {
    setActiveTab(tab);
  };
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <DynamicHeader title="Notifications" />
      <View className="flex flex-row items-center gap-2 mt-5">
        <TouchableOpacity
          activeOpacity={0.8}
          className={`${
            activeTab == "Transactions" ? "bg-green-300" : "bg-[#e8e8e8]"
          } rounded-[20px] px-2 py-3 flex-1`}
          onPress={() => toggleTab("Transactions")}
        >
          <Text
            className={`${
              activeTab == "Transactions" ? "text-green-700" : "text-black"
            } font-[500] text-base text-center`}
          >
            Transactions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          className={`${
            activeTab == "Activities" ? "bg-green-300" : "bg-[#e8e8e8]"
          } rounded-[20px] px-2 py-3 flex-1`}
          onPress={() => toggleTab("Activities")}
        >
          <Text
            className={`${
              activeTab == "Activities" ? "text-green-700" : "text-black"
            } font-[500] text-base text-center`}
          >
            Activities
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default notifications;

const styles = StyleSheet.create({});
