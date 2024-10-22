import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "@/assets/images/avatar.svg";
import {
  EvilIcons,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { globalstyles } from "@/styles/common";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/config/store";
import accountService from "@/services/account.service";
import { SET_ACCOUNT } from "@/config/slices/accountSlice";
import { Link, useFocusEffect } from "expo-router";
import { Colors } from "@/constants/Colors";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import TransferWidget from "@/components/TransferWidget";
import ServiceWidget from "@/components/ServiceWidget";
import useDeviceInfo from "@/hooks/useDeviceInfo";

export default function HomeScreen() {
  const [balanceVisible, setBalancevisible] = useState(false);
  const toggleBalance = () => {
    setBalancevisible(!balanceVisible);
  };
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state: RootState) => state.user);
  const { userAccount } = useSelector((state: RootState) => state.account);
  const firstname = currentuser && currentuser.firstName;
  const lastname = currentuser && currentuser.lastName;
  const axiosPrivate = useAxiosPrivate();
  const deviceinfo = useDeviceInfo();

  console.log({
    id: deviceinfo.deviceId,
    manu: deviceinfo.manufacturer,
    model: deviceinfo.model,
  });

  const getUserAccount = async () => {
    const res = await accountService.getUserAccount(axiosPrivate);
    dispatch(SET_ACCOUNT(res.result));
  };

  useFocusEffect(
    useCallback(() => {
      getUserAccount();
      // Add cleanup logic here
      // return () => {};
    }, [])
  );

  useEffect(() => {
    getUserAccount();
  }, []);
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
        <FontAwesome name="qrcode" size={24} color="black" />
        <EvilIcons name="bell" size={24} color="black" />
      </View>
      {/* widget */}
      <View className="flex flex-row items-center mt-5 justify-between px-5 bg-appblue rounded-[20px] min-h-[120px]">
        <View className="flex flex-col gap-9">
          <View className="flex flex-row items-center">
            <Ionicons name="shield-checkmark-sharp" size={17} color="white" />
            <Text className="text-white  ml-1 font-popp">
              Available Balance
            </Text>
            <TouchableOpacity
              className="p-2"
              onPress={toggleBalance}
              activeOpacity={0.8}
            >
              <Feather
                suppressHighlighting
                name={balanceVisible ? "eye" : "eye-off"}
                size={17}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <View style={[{ gap: 5 }]} className="flex flex-row items-center">
            <Text className="text-white items-center">₦</Text>
            <Text className="text-[20px] font-[700] text-white">
              {balanceVisible ? userAccount?.balance : "*****"}
            </Text>
          </View>
        </View>
        <View className="flex flex-col gap-9">
          <Link
            href={"/(tabs)/transactions"}
            suppressHighlighting={true}
            className="text-white font-popp"
          >
            Transaction History {">"}
          </Link>
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
      {/* Transfer */}
      <TransferWidget />
      {/* services */}
      <ServiceWidget />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
