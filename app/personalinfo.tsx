import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/config/store";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";

const personalinfo = () => {
  const { user, userAccount } = useUserStore();
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="h-[60px] flex-row items-center justify-between px-4">
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>

        <Text
          className="text-[15px] text-black"
          style={{ fontFamily: "Jura_700Bold" }}
        >
          Personal Information
        </Text>

        <View className="w-5" />
      </View>

      {/* Content */}
      <ScrollView
        className="px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Profile Card */}
        <View className="items-center my-4">
          <View className="w-14 h-14 rounded-full bg-appblue items-center justify-center">
            <Text
              className="text-white text-lg"
              style={{ fontFamily: "Jura_700Bold" }}
            >
              {user?.firstName?.charAt(0)}
            </Text>
          </View>

          <Text
            className="mt-4 text-gray-600 text-base"
            style={{ fontFamily: "Jura_700Bold" }}
          >
            {userAccount?.accountName}
          </Text>
        </View>

        {/* Info Cards */}
        <InfoCard
          title="Your Wallet Number"
          value={userAccount?.accountNumber as string}
          copyable
        />
        <InfoCard
          title="KYC Status"
          value={user?.kyc ? "Verified" : "Not Verified"}
        />
        <InfoCard title="Phone Number" value={user?.phoneNumber as string} />
        <InfoCard title="Email" value={user?.email ?? "Email Not Set"} />
        <InfoCard
          title="Home Address"
          value={user?.homeAddress ?? "Address Not Set"}
        />
        <InfoCard title="Date of Birth" value={user?.dateOfBirth ?? ""} />
        <InfoCard title="State" value={user?.stateOfOrigin ?? ""} />
        <InfoCard title="LGA" value={user?.lga ?? ""} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default personalinfo;

type InfoCardProps = {
  title: string;
  value: string;
  copyable?: boolean;
};

const InfoCard = ({ title, value, copyable }: InfoCardProps) => {
  const copyToClipboard = async (text: string) => {
    const res = await Clipboard.setStringAsync(text);
    Toast.show({
      type: "success",
      text1: "Copied to clipboard",
    });
  };
  return (
    <View className="mb-3">
      <Text
        className="text-gray-600 text-[14px] mb-1"
        style={{ fontFamily: "Jura_600SemiBold" }}
      >
        {title}
      </Text>

      <View className="bg-white rounded-2xl p-3 flex-row justify-between items-center">
        <Text
          className="text-gray-700 text-[14px]"
          style={{ fontFamily: "Jura_600SemiBold" }}
        >
          {value}
        </Text>

        {copyable && (
          <TouchableOpacity onPress={() => copyToClipboard(value)}>
            <MaterialIcons name="content-copy" size={18} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
