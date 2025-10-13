import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { globalstyles } from "@/styles/common";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import Avatar from "@/assets/images/avatar.svg";
import { Image } from "react-native";
import { useUserStore } from "@/config/store";
import { Link, router } from "expo-router";
import { useGetUnreadNotificationCount } from "@/queries/notification";
import { getGreeting } from "@/utils/DateFormatter";

type Props = {};

const ProfileHeader = () => {
  const { user } = useUserStore();
  const { data } = useGetUnreadNotificationCount({});
  return (
    <View
      className="px-[10px] py-[14px]"
      style={[globalstyles.rowview, { justifyContent: "space-between" }]}
    >
      <View className="flex flex-row gap-[12px] ">
        {user?.imageUrl ? (
          <Image
            src={user?.imageUrl}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <Avatar />
        )}
        <View style={[globalstyles.colview]}>
          <Text className="text-[#000C20] font-[500] text-[13px]">
            {getGreeting()}
          </Text>
          <Text className="text-[#000C20] font-[700] text-[13px]">
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
      </View>
      <View style={[globalstyles.rowview, { gap: 10 }]}>
        <Link href={"/transfer/qrCodePage"} asChild>
          <FontAwesome name="qrcode" size={24} color="black" />
        </Link>
        <TouchableOpacity
          onPress={() => router.push("/notifications")}
          className="relative"
        >
          <EvilIcons name="bell" size={24} color="black" />
          {data && data > 0 && (
            <View className="absolute h-3 w-3 -top-1 -right-[1px] bg-red-500 rounded-full items-center justify-center">
              <Text className="text-[8px] text-white font-[600]">{data}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({});
