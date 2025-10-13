import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DynamicHeader from "@/components/DynamicHeader";
import { useLocalSearchParams } from "expo-router";
import { useTransactionById } from "@/queries/wallet";
import walletService from "@/services/wallet.service";
import { getStatusColor } from "@/components/common/SingleTransactionWidget";
import { globalstyles } from "@/styles/common";
import { dateFormatter } from "@/utils/formatters";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import RippleLoader from "@/components/common/loader/RippleLoader";

type Props = {};

const transactionDetails = (props: Props) => {
  const { id } = useLocalSearchParams();

  const { isLoading, data: userTransaction } = useTransactionById(id);
  console.log(userTransaction);
  let transactionType: any;

  if (!isLoading) {
    const word = userTransaction[0].transactionType;
    const lowerCaseFirstLetter = word.charAt(0).toLowerCase() + word.slice(1);
    transactionType = lowerCaseFirstLetter;
  }
  const copyToClipboard = async (text: string) => {
    const res = await Clipboard.setStringAsync(text);
    Toast.show({
      type: "success",
      text1: "Copied to clipboard",
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <DynamicHeader title="Transaction Details" />
      {isLoading && <RippleLoader />}

      {!isLoading && (
        <>
          <View
            style={{ gap: 4 }}
            className="shadow-sm bg-white flex items-center justify-center mt-8 mb-5 p-6 rounded-md"
          >
            <Text className="font-[700] text-lg">
              {transactionType === "safehavenAirtime"
                ? userTransaction[0][transactionType].receiver?.distribution +
                  " " +
                  userTransaction[0][transactionType].receiver?.vendType
                : transactionType === "transfer"
                ? userTransaction[0][transactionType].debitAccountName
                : userTransaction[0][transactionType].receiver?.vendType}
            </Text>
            <Text className="font-[600] text-xl">
              ₦{userTransaction[0][transactionType].amount.toFixed(2)}
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
          <View className="bg-white overflow-hidden shadow-md rounded-md p-5">
            <View className="flex w-full h-full absolute top-0 left-0">
              <Image
                source={require("@/assets/images/sispaylogo2.png")}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
                className="opacity-10"
              />
            </View>
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
                  <Text className="font-[500] font-popp">
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
                  <Text className="font-[500] font-popp">Airtime</Text>
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
                  <Text className="font-[500] font-popp">Wallet</Text>
                </View>
                <View
                  style={[
                    globalstyles.rowview,
                    { justifyContent: "space-between", gap: 10 },
                  ]}
                >
                  <Text className="text-gray-500 justify-between font-popp">
                    Transaction No
                  </Text>
                  <View className="flex flex-row items-center gap-2">
                    <Text className="font-[500] font-popp">
                      {userTransaction[0][transactionType].reference.substring(
                        0,
                        Math.min(
                          userTransaction[0][transactionType].reference.length,
                          15
                        )
                      ) + "..."}
                    </Text>
                    <Ionicons
                      onPress={() =>
                        copyToClipboard(
                          userTransaction[0][transactionType].reference
                        )
                      }
                      name="copy-outline"
                      size={16}
                      color="black"
                    />
                  </View>
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
                  <Text className="font-[500] font-popp">
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
                  <Text className="font-[500] font-popp">
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
                  <Text className="font-[500] font-popp">Airtime</Text>
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
                  <Text className="font-[500] font-popp">Wallet</Text>
                </View>
                <View
                  style={[
                    globalstyles.rowview,
                    { justifyContent: "space-between", gap: 10 },
                  ]}
                >
                  <Text className="text-gray-500 justify-between font-popp">
                    Transaction No
                  </Text>
                  <View className="flex flex-row items-center gap-2">
                    <Text className="font-[500] font-popp">
                      {userTransaction[0][transactionType].reference.substring(
                        0,
                        Math.min(
                          userTransaction[0][transactionType].reference.length,
                          15
                        )
                      ) + "..."}
                    </Text>
                    <Ionicons
                      onPress={() =>
                        copyToClipboard(
                          userTransaction[0][transactionType].reference
                        )
                      }
                      name="copy-outline"
                      size={16}
                      color="black"
                    />
                  </View>
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
                  <Text className="font-[500] font-popp">
                    {dateFormatter(
                      userTransaction[0][transactionType].transactionDate
                    )}
                  </Text>
                </View>
              </View>
            )}
            {transactionType == "transfer" && (
              <View style={[globalstyles.colview, { gap: 10, marginTop: 10 }]}>
                <View
                  style={[
                    globalstyles.rowview,
                    { justifyContent: "space-between" },
                  ]}
                >
                  <Text className="text-gray-500 justify-between font-popp">
                    Recipient
                  </Text>
                  <Text className="font-[500] font-popp">
                    {userTransaction[0][transactionType].beneficiaryAccountName}
                  </Text>
                </View>
                <View
                  className="gap-5"
                  style={[
                    globalstyles.rowview,
                    { justifyContent: "space-between" },
                  ]}
                >
                  <Text className="text-gray-500 justify-between font-popp">
                    Sender
                  </Text>
                  <Text className="font-[500] text-right font-popp break-words flex-1">
                    {`${userTransaction[0][transactionType].debitAccountName} | ${userTransaction[0][transactionType].debitAccountNumber}`}
                  </Text>
                </View>
                <View
                  className="gap-5"
                  style={[
                    globalstyles.rowview,
                    { justifyContent: "space-between" },
                  ]}
                >
                  <Text className="text-gray-500 justify-between font-popp ">
                    Remark
                  </Text>
                  <Text className="font-[500] font-popp text-right break-words flex-1">
                    {`${userTransaction[0][transactionType].narration}`}
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
                  <Text className="font-[500] font-popp text-right">
                    Transfer
                  </Text>
                </View>

                <View
                  style={[
                    globalstyles.rowview,
                    { justifyContent: "space-between", gap: 10 },
                  ]}
                >
                  <Text className="text-gray-500 justify-between font-popp">
                    Transaction No
                  </Text>
                  <View className="flex flex-row items-center gap-2">
                    <Text className="font-[500] font-popp text-right">
                      {userTransaction[0][
                        transactionType
                      ].transactionReference.substring(
                        0,
                        Math.min(
                          userTransaction[0][transactionType]
                            .transactionReference.length,
                          15
                        )
                      ) + "..."}
                    </Text>
                    <Ionicons
                      onPress={() => {
                        copyToClipboard(
                          userTransaction[0][transactionType]
                            .transactionReference
                        );
                      }}
                      name="copy-outline"
                      size={16}
                      color="black"
                    />
                  </View>
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
                  <Text className="font-[500] font-popp">
                    {dateFormatter(
                      userTransaction[0][transactionType].transactionDate
                    )}
                  </Text>
                </View>
                <View
                  className="gap-3"
                  style={[
                    globalstyles.rowview,
                    { justifyContent: "space-between" },
                  ]}
                >
                  <Text className="text-gray-500 justify-between font-popp">
                    Session ID
                  </Text>
                  <View className="flex flex-row items-center gap-2">
                    <Text className="font-[500] font-popp">
                      {userTransaction[0][transactionType].sessionId.substring(
                        0,
                        Math.min(
                          userTransaction[0][transactionType].sessionId.length,
                          15
                        )
                      ) + "..."}
                    </Text>
                    <Ionicons
                      onPress={() =>
                        copyToClipboard(
                          userTransaction[0][transactionType].sessionId
                        )
                      }
                      name="copy-outline"
                      size={16}
                      color="black"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </>
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
          className="border-appblue border rounded-[20px] px-3 py-4 flex-1"
        >
          <Text className="text-appblue text-center font-[500] font-popp">
            Report An Issue
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-appblue rounded-[20px] px-3 py-4 flex-1"
        >
          <Text className="text-white text-center font-[500] font-popp">
            Share Receipt
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default transactionDetails;

const styles = StyleSheet.create({});
