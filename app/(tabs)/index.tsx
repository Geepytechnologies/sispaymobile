import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "@/assets/images/avatar.svg";
import { EvilIcons, Feather, Ionicons } from "@expo/vector-icons";
import { globalstyles } from "@/styles/common";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/config/store";

export default function HomeScreen() {
  const [balanceVisible, setBalancevisible] = useState(false);
  const toggleBalance = () => {
    setBalancevisible(!balanceVisible);
  };
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state: RootState) => state.user);
  const firstname = currentuser && currentuser.firstName;
  const lastname = currentuser && currentuser.lastName;
  return (
    <SafeAreaView className="p-[14px]">
      {/* header */}
      <View
        className="px-[10px] py-[14px]"
        style={[globalstyles.rowview, { justifyContent: "space-between" }]}
      >
        <View className="flex flex-row gap-[12px] ">
          <Avatar />
          <View style={[globalstyles.colview]}>
            <Text className="text-[#000C20] font-[500] text-[13px]">Hello</Text>
            <Text className="text-[#000C20] font-[700] text-[13px]">
              {firstname} {lastname}
            </Text>
          </View>
        </View>
        <EvilIcons name="bell" size={24} color="black" />
      </View>
      {/* widget */}
      <View className="flex flex-row items-center mt-5 justify-between p-3 bg-appblue rounded-[20px] min-h-[120px]">
        <View className="flex flex-col gap-4">
          <View className="flex flex-row items-center">
            <Ionicons name="shield-checkmark-sharp" size={17} color="white" />
            <Text className="text-white mr-3 ml-1">Available Balance</Text>
            <Feather
              suppressHighlighting
              onPress={() => toggleBalance()}
              name={balanceVisible ? "eye" : "eye-off"}
              size={17}
              color="white"
            />
          </View>
          <Text className="text-white">
            ₦ <Text className="text-[20px] font-[700]">5,000</Text>
          </Text>
        </View>
        <View className="flex flex-col gap-4">
          <Text className="text-white">Transaction History {">"}</Text>
          <TouchableOpacity
            className="bg-white rounded-[20px] px-3 py-2"
            activeOpacity={0.9}
          >
            <Text>{"+"} Add Money</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* latest transactions */}
      <View className="bg-white shadow-xl">
        <View>
          <View></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
