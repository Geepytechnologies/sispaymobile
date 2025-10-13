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
import { ref } from "joi";
import TransactionDetails from "@/app/transactionDetail";
import AnimatedLoader from "@/components/common/loader/AnimatedLoader";
import RippleLoader from "@/components/common/loader/RippleLoader";

type Props = {};

const transactions = (props: Props) => {
  const { userAccount } = useUserStore();
  const accountNumber =
    (userAccount && userAccount.accountNumber) || "8028434560";
  // const accountNumber = "8028434560"; // Default account number for testing
  const startDate = "";
  const endDate = "";
  const {
    isLoading,
    data: userTransactions,
    refetch,
  } = useTransactions(startDate, endDate, accountNumber, 1, 10);
  useFocusEffect(
    useCallback(() => {
      if (userTransactions) {
        refetch();
      }
    }, [userTransactions, refetch])
  );

  // console.log(userTransactions);
  return (
    <SafeAreaView className="px-4 pt-4 flex-1" style={{ flex: 1 }}>
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
      {isLoading && <RippleLoader />}
      {!isLoading && !userTransactions.result ? (
        <View className="my-5 flex-1 items-center justify-center">
          <Text className="text-[16px] text-gray-500">
            No transactions found
          </Text>
        </View>
      ) : (
        <View className="flex-1 mt-5">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {userTransactions &&
              userTransactions.result.map((t: any, index: any) => (
                <SingleTransactionWidget key={index} transaction={t} />
              ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default transactions;

const styles = StyleSheet.create({});
