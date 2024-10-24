import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DynamicHeader from "@/components/DynamicHeader";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import walletService from "@/services/wallet.service";
import { getStatusColor } from "@/components/common/SingleTransactionWidget";
import { globalstyles } from "@/styles/common";
import { dateFormatter } from "@/utils/formatters";

type Props = {};

const transactionDetails = (props: Props) => {
  const { id } = useLocalSearchParams();

  const {
    isLoading,
    data: userTransaction,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transaction"],
    queryFn: () => walletService.getATransaction("67182cea780f7ae264199ab7"),
  });
  console.log(userTransaction);
  let transactionType: any;

  if (!isLoading) {
    const word = userTransaction[0].transactionType;
    const lowerCaseFirstLetter = word.charAt(0).toLowerCase() + word.slice(1);
    transactionType = lowerCaseFirstLetter;
  }
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <DynamicHeader title="Transaction Details" />
      {!isLoading && (
        <View
          style={{ gap: 4 }}
          className="shadow-sm bg-white flex items-center justify-center mt-8 mb-5 p-6 rounded-md"
        >
          <Text className="font-[700] text-lg">
            {userTransaction[0][transactionType].receiver?.vendType}
          </Text>
          <Text className="font-[600] text-xl">
            ₦{userTransaction[0][transactionType].amount}
          </Text>
          <Text
            className={`${
              getStatusColor(userTransaction[0][transactionType].status)?.bg
            } ${
              getStatusColor(userTransaction[0][transactionType].status)?.text
            } capitalize p-1 rounded-md text-sm`}
          >
            {userTransaction[0][transactionType].status}
          </Text>
        </View>
      )}

      {!isLoading && (
        <View className="bg-white overflow-hidden shadow-md rounded-md p-5">
          <Text className="font-[500] text-base">Transaction Details</Text>
          {transactionType == "safehavenAirtime" && (
            <View style={[globalstyles.colview, { gap: 10, marginTop: 10 }]}>
              <View
                style={[
                  globalstyles.rowview,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text className="text-gray-500 justify-between font-popp">
                  Recipient Mobile
                </Text>
                <Text className="font-[600] font-popp">
                  {userTransaction[0][transactionType].receiver?.number}
                </Text>
              </View>
              <View
                style={[
                  globalstyles.rowview,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text className="text-gray-500 justify-between font-popp">
                  Transaction Type
                </Text>
                <Text className="font-[600] font-popp">Airtime</Text>
              </View>
              <View
                style={[
                  globalstyles.rowview,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text className="text-gray-500 justify-between font-popp">
                  Payment Method
                </Text>
                <Text className="font-[600] font-popp">Wallet</Text>
              </View>
              <View
                style={[
                  globalstyles.rowview,
                  { justifyContent: "space-between", gap: 10 },
                ]}
              >
                <Text className="text-gray-500 justify-between font-popp">
                  Transaction Number
                </Text>
                <Text className="font-[600] font-popp">
                  {userTransaction[0][transactionType].reference.substring(
                    0,
                    Math.min(
                      userTransaction[0][transactionType].reference.length,
                      15
                    )
                  ) + "..."}
                </Text>
              </View>
              <View
                style={[
                  globalstyles.rowview,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text className="text-gray-500 justify-between font-popp">
                  Transaction Date
                </Text>
                <Text className="font-[600] font-popp">
                  {dateFormatter(
                    userTransaction[0][transactionType].transactionDate
                  )}
                </Text>
              </View>
            </View>
          )}
          {transactionType == "safehavenData" && (
            <View style={[globalstyles.colview, { gap: 10, marginTop: 10 }]}>
              <View
                style={[
                  globalstyles.rowview,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text className="text-gray-500 justify-between font-popp">
                  Recipient Mobile
                </Text>
                <Text className="font-[600] font-popp">
                  {userTransaction[0][transactionType].receiver?.number}
                </Text>
              </View>
              <View
                style={[
                  globalstyles.rowview,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text className="text-gray-500 justify-between font-popp">
                  Transaction Type
                </Text>
                <Text className="font-[600] font-popp">Airtime</Text>
              </View>
              <View
                style={[
                  globalstyles.rowview,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text className="text-gray-500 justify-between font-popp">
                  Payment Method
                </Text>
                <Text className="font-[600] font-popp">Wallet</Text>
              </View>
              <View
                style={[
                  globalstyles.rowview,
                  { justifyContent: "space-between", gap: 10 },
                ]}
              >
                <Text className="text-gray-500 justify-between font-popp">
                  Transaction Number
                </Text>
                <Text className="font-[600] font-popp">
                  {userTransaction[0][transactionType].reference.substring(
                    0,
                    Math.min(
                      userTransaction[0][transactionType].reference.length,
                      15
                    )
                  ) + "..."}
                </Text>
              </View>
              <View
                style={[
                  globalstyles.rowview,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text className="text-gray-500 justify-between font-popp">
                  Transaction Date
                </Text>
                <Text className="font-[600] font-popp">
                  {dateFormatter(
                    userTransaction[0][transactionType].transactionDate
                  )}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
      <View
        className="mt-auto"
        style={[
          globalstyles.rowview,
          { justifyContent: "space-between", gap: 10 },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          className="border-green-500 border rounded-[20px] px-3 py-4 flex-1"
        >
          <Text className="text-green-500 text-center font-[600] font-popp">
            Report An Issue
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-green-500 rounded-[20px] px-3 py-4 flex-1"
        >
          <Text className="text-white text-center font-[600] font-popp">
            Share Receipt
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default transactionDetails;

const styles = StyleSheet.create({});
