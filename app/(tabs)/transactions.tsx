import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import walletService from "@/services/wallet.service";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import { SafeAreaView } from "react-native-safe-area-context";
import DynamicHeader from "@/components/DynamicHeader";
import { globalstyles } from "@/styles/common";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import SingleTransactionWidget from "@/components/common/SingleTransactionWidget";

type Props = {};

const transactions = (props: Props) => {
  const { userAccount } = useSelector((state: RootState) => state.account);
  const accountNumber =
    (userAccount && userAccount.accountNumber) || "8022507499";
  const startDate = "";
  const endDate = "";
  const {
    isLoading,
    data: userTransactions,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () =>
      walletService.getTransactions(startDate, endDate, accountNumber, 1, 10),
  });
  console.log(userTransactions);
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
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
      <View className="my-5">
        {!isLoading &&
          userTransactions.result.map((t: any, index: any) => (
            <SingleTransactionWidget key={index} transaction={t} />
          ))}
      </View>
    </SafeAreaView>
  );
};

export default transactions;

const styles = StyleSheet.create({});
