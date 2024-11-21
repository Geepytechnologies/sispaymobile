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
import { useQuery } from "@tanstack/react-query";
import walletService from "@/services/wallet.service";
import SingleTransactionWidget from "@/components/common/SingleTransactionWidget";
import { AxiosInstance } from "axios";
import ProfileHeader from "@/components/common/ProfileHeader";

export default function HomeScreen() {
  const [balanceVisible, setBalancevisible] = useState(false);
  const toggleBalance = () => {
    setBalancevisible(!balanceVisible);
  };

  // const [accountNumber, setAccountNumber] = useState("");

  const dispatch = useDispatch();
  const { currentuser } = useSelector((state: RootState) => state.user);
  const { userAccount } = useSelector((state: RootState) => state.account);

  const Api = useAxiosPrivate();
  const deviceinfo = useDeviceInfo();

  console.log({
    id: deviceinfo.deviceId,
    manu: deviceinfo.manufacturer,
    model: deviceinfo.model,
  });

  const accountNumber = userAccount && userAccount.accountNumber;

  const {
    isLoading: accountLoading,
    data: userAccountData,
    error: userAccountError,
    refetch: userAccountRefetch,
  } = useQuery({
    queryKey: ["getUserAccount"],
    queryFn: () => accountService.getUserAccount(Api),
  });

  const {
    isLoading,
    data: userTransactions,
    error,
    refetch,
  } = useQuery({
    queryKey: ["lastTwotransactions"],
    queryFn: () => walletService.getLastTwoTransactions(accountNumber),
    enabled: !!userAccountData?.result,
  });
  // console.log(userTransactions?.result);
  useEffect(() => {
    if (userAccountData) {
      dispatch(SET_ACCOUNT(userAccountData?.result));
    }
  }, [userAccountData, dispatch]);

  return (
    <SafeAreaView className="p-[14px]">
      <ScrollView showsVerticalScrollIndicator={false}>
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
                  ? userAccountData?.result.balance + ".00"
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
              userTransactions
                ?.sort(
                  (
                    a: { transactionDate: string | number | Date },
                    b: { transactionDate: string | number | Date }
                  ) =>
                    new Date(b.transactionDate).getTime() -
                    new Date(a.transactionDate).getTime()
                )
                .map((t: any, index: Key | null | undefined) => (
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
