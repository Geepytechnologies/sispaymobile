import React from "react";
import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "@/assets/images/avatar.svg";
import {
  EvilIcons,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { globalstyles } from "@/styles/common";
import { Key, useCallback, useEffect, useState } from "react";
import accountService from "@/services/account.service";
import { Link, router, useFocusEffect } from "expo-router";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import ServiceWidget from "@/components/ServiceWidget";
import useDeviceInfo from "@/hooks/useDeviceInfo";

import ProfileHeader from "@/components/common/ProfileHeader";
import Auth from "@/utils/auth";
import { useUserStore } from "@/config/store";
import { useLastTwoTransactions } from "@/queries/wallet";
import { useUserAccount as useAccountQuery } from "@/queries/account";
import AnimatedLoader from "@/components/common/loader/AnimatedLoader";
import Toast from "react-native-toast-message";
import { copyToClipboard } from "@/utils/formatters";

export default function HomeScreen() {
  const [balanceVisible, setBalancevisible] = useState(false);
  const toggleBalance = () => {
    setBalancevisible(!balanceVisible);
  };

  // const [accountNumber, setAccountNumber] = useState("");

  const Api = useAxiosPrivate();
  const deviceinfo = useDeviceInfo();

  // console.log({
  //   id: deviceinfo.deviceId,
  //   manu: deviceinfo.manufacturer,
  //   model: deviceinfo.model,
  // });

  const { userAccount, setUserAccount } = useUserStore();
  const accountNumber = userAccount && userAccount.accountNumber;
  const { data: userAccountData } = useAccountQuery();
  const { data: userTransactions } = useLastTwoTransactions(accountNumber);

  useFocusEffect(
    useCallback(() => {
      if (userAccountData) {
        setUserAccount(userAccountData);
      }
    }, [userAccountData])
  );

  return (
    <SafeAreaView className="px-[14px] pt-[14px] flex-1">
      <StatusBar barStyle={"light-content"} />
      <View className="h-screen">
        <ScrollView className="mb-20" showsVerticalScrollIndicator={false}>
          {/* header */}
          <ProfileHeader />

          {/* widget */}
          <View className="flex flex-row items-center justify-center mt-5 px-5 bg-appblue rounded-[20px] min-h-[120px]">
            <View className="flex flex-col gap-3">
              <View className="flex flex-row items-center">
                <Ionicons
                  name="shield-checkmark-sharp"
                  size={17}
                  color="white"
                />
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
              <View
                style={[{ gap: 5 }]}
                className="flex flex-row items-center justify-center"
              >
                <Text className="text-white items-center">₦</Text>
                <Text className="text-[25px] font-[700] text-white">
                  {balanceVisible
                    ? userAccount?.balance.toFixed(2).toLocaleString()
                    : "*****"}
                </Text>
              </View>
              <View className="flex flex-row items-center justify-center gap-2">
                <Text className="text-white">{userAccount?.accountNumber}</Text>
                <Ionicons
                  onPress={() =>
                    copyToClipboard(userAccount?.accountNumber as string)
                  }
                  name="copy-outline"
                  size={16}
                  color="white"
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/(tabs)/transactions")}
                className="flex flex-row items-center justify-center"
              >
                <Text className="text-white font-popp">
                  Transaction History
                </Text>
                <MaterialCommunityIcons
                  name="chevron-double-right"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{ gap: 30 }}
            className="bg-white px-3 py-6 my-5 shadow-md rounded-xl"
          >
            {/* services */}
            <ServiceWidget />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
