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
import { Key, useCallback, useEffect, useState } from "react";
import accountService from "@/services/account.service";
import { Link, router, useFocusEffect } from "expo-router";
import { Colors } from "@/constants/Colors";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import TransferWidget from "@/components/TransferWidget";
import ServiceWidget from "@/components/ServiceWidget";
import useDeviceInfo from "@/hooks/useDeviceInfo";
import walletService from "@/services/wallet.service";
import SingleTransactionWidget from "@/components/common/SingleTransactionWidget";
import { AxiosInstance } from "axios";
import ProfileHeader from "@/components/common/ProfileHeader";
import Auth from "@/utils/auth";
import { useUserStore } from "@/config/store";
import { useLastTwoTransactions } from "@/queries/wallet";
import { useUserAccount as useAccountQuery } from "@/queries/account";

export default function HomeScreen() {
  const [balanceVisible, setBalancevisible] = useState(false);
  const toggleBalance = () => {
    setBalancevisible(!balanceVisible);
  };

  // const [accountNumber, setAccountNumber] = useState("");

  const Api = useAxiosPrivate();
  const deviceinfo = useDeviceInfo();

  console.log({
    id: deviceinfo.deviceId,
    manu: deviceinfo.manufacturer,
    model: deviceinfo.model,
  });

  const { userAccount, setUserAccount } = useUserStore();
  const accountNumber = userAccount && userAccount.accountNumber;
  const { data: userAccountData } = useAccountQuery();
  const { data: userTransactions } = useLastTwoTransactions(accountNumber);
  useEffect(() => {
    if (userAccountData) {
      setUserAccount(userAccountData);
    }
  }, [userAccountData]);
  return (
    <SafeAreaView className="p-[14px]">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        {/* header */}
        <ProfileHeader />
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
                {balanceVisible
                  ? userAccount?.balance.toLocaleString() + ".00"
                  : "*****"}
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
        {userTransactions && (
          <View className="bg-white px-3 pt-6 my-5 shadow-md rounded-xl">
            {userTransactions &&
              userTransactions.map((t: any, index: Key | null | undefined) => (
                <SingleTransactionWidget key={index} transaction={t} />
              ))}
          </View>
        )}
        <View
          style={{ gap: 30 }}
          className="bg-white px-3 py-6 my-5 shadow-md rounded-xl"
        >
          {/* Transfer */}
          <TransferWidget />
          {/* services */}
          <ServiceWidget />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
