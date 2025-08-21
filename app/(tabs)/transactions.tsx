import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback } from "react";
import walletService from "@/services/wallet.service";
import { useUserStore } from "@/config/store";
import { SafeAreaView } from "react-native-safe-area-context";
import DynamicHeader from "@/components/DynamicHeader";
import { globalstyles } from "@/styles/common";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import SingleTransactionWidget from "@/components/common/SingleTransactionWidget";
import { useFocusEffect } from "expo-router";
import { useTransactions } from "@/queries/wallet";

type Props = {};

const transactions = (props: Props) => {
  const { userAccount } = useUserStore();
  // const accountNumber =
  //   (userAccount && userAccount.accountNumber) || "8028434560";
  const accountNumber = "8028434560"; // Default account number for testing
  const startDate = "";
  const endDate = "";
  const { isLoading, data: userTransactions } = useTransactions(
    startDate,
    endDate,
    accountNumber,
    1,
    10
  );
  // useFocusEffect(() => {
  //   useCallback(() => {
  //     refetch();
  //   }, []);
  // });
  console.log(userTransactions);
  return (
    <SafeAreaView className="" style={{ flex: 1, padding: 16 }}>
      <DynamicHeader title="Transactions" />
      <View className="mt-5" style={[globalstyles.rowview]}>
        <TouchableOpacity
          style={[globalstyles.rowview, { gap: 10 }]}
          activeOpacity={0.7}
          className=""
        >
          <Text style={{ color: Colors.primary }} className={``}>
            All Categories
          </Text>
          <FontAwesome name="angle-down" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {!isLoading && !userTransactions.result ? (
        <View className="my-5 flex-1 items-center justify-center">
          <Text className="text-[16px] text-gray-500">
            No transactions found
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="mt-5 flex-1"
        >
          <View className="">
            {userTransactions &&
              userTransactions.result.map((t: any, index: any) => (
                <SingleTransactionWidget key={index} transaction={t} />
              ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default transactions;

const styles = StyleSheet.create({});
