import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalstyles } from "@/styles/common";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import Avatar from "@/assets/images/avatar.svg";
import { Image } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import { Link } from "expo-router";

type Props = {};

const ProfileHeader = () => {
  const { currentuser } = useSelector((state: RootState) => state.user);
  return (
    <View
      className="px-[10px] py-[14px]"
      style={[globalstyles.rowview, { justifyContent: "space-between" }]}
    >
      <View className="flex flex-row gap-[12px] ">
        {currentuser?.imageUrl ? (
          <Image
            src={currentuser?.imageUrl}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <Avatar />
        )}
        <View style={[globalstyles.colview]}>
          <Text className="text-[#000C20] font-[500] text-[13px]">Hello</Text>
          <Text className="text-[#000C20] font-[700] text-[13px]">
            {currentuser?.firstName} {currentuser?.lastName}
          </Text>
        </View>
      </View>
      <View style={[globalstyles.rowview, { gap: 10 }]}>
        <Link href={"/transfer/qrCodePage"} asChild>
          <FontAwesome name="qrcode" size={24} color="black" />
        </Link>
        <EvilIcons name="bell" size={24} color="black" />
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({});
