import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { globalstyles } from "@/styles/common";
import { dateFormatter } from "@/utils/formatters";
import { router } from "expo-router";

type Props = {
  transaction: any;
};
export const getStatusColor = (status: string) => {
  if (status == "successful") {
    return { bg: "bg-green-300", text: "text-green-600" };
  }
  if (status == "pending") {
    return { bg: "bg-yellow-300", text: "text-yellow-500" };
  }
  if (status == "failed") {
    return { bg: "bg-red-400", text: "text-red-500" };
  }
};

const SingleTransactionWidget = ({ transaction }: Props) => {
  let TransactionType: any;

  const nonNullProperty = Object.entries(transaction)
    .filter(([key]) => key !== "transactionDate" && key !== "user")
    .find(([key, value]) => value !== null);

  TransactionType = nonNullProperty && nonNullProperty[0];

  const getIconToRender = () => {
    if (
      transaction.safehavenAirtime !== null ||
      transaction.vtuAirtimeTransaction !== null
    ) {
      return (
        <View
          style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
          className="flex items-center justify-center rounded-full h-[30px] w-[30px] 
          "
        >
          <MaterialIcons name="call-made" size={20} color={Colors.primary} />
        </View>
      );
    }

    if (
      transaction.safehavenData !== null ||
      transaction.vtuDataTransaction !== null
    ) {
      return (
        <View
          style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
          className="flex items-center justify-center rounded-full h-[30px] w-[30px] 
            "
        >
          <MaterialIcons name="network-wifi" size={20} color={Colors.primary} />
        </View>
      );
    }

    if (
      transaction.safehavenCabletv !== null ||
      transaction.vtuCabletvTransaction
    ) {
      return (
        <View
          style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
          className="flex items-center justify-center rounded-full h-[30px] w-[30px] 
            "
        >
          <Feather name="tv" size={20} color={Colors.primary} />
        </View>
      );
    }
    if (
      transaction.safehavenUtilitybill !== null ||
      transaction.vtuUtilityTransaction
    ) {
      return (
        <View
          style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
          className="flex items-center justify-center rounded-full h-[30px] w-[30px] 
            "
        >
          <Feather name="tv" size={20} color={Colors.primary} />
        </View>
      );
    }
  };

  // console.log(transaction);
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/transactionDetails",
          params: { id: transaction[TransactionType].id },
        })
      }
      activeOpacity={0.7}
      className="mb-5"
    >
      <View
        style={[
          globalstyles.rowview,
          { gap: 15, justifyContent: "space-between" },
        ]}
      >
        <View style={[globalstyles.rowview, { gap: 15 }]}>
          <View>{getIconToRender()}</View>
          <View>
            <Text className="font-[700]">
              {transaction[TransactionType].receiver?.vendType}
            </Text>
            <Text className="text-gray-500">
              {dateFormatter(transaction[TransactionType].transactionDate)}
            </Text>
          </View>
        </View>
        <View style={[globalstyles.colview, { gap: 4 }]}>
          <Text>₦{transaction[TransactionType].amount}</Text>
          <View
            className={`${
              getStatusColor(transaction[TransactionType].status)?.bg
            }  rounded-md p-1`}
          >
            <Text
              className={` ${
                getStatusColor(transaction[TransactionType].status)?.text
              } capitalize text-sm`}
            >
              {transaction[TransactionType].status}
            </Text>
          </View>
        </View>
      </View>
      <View className="mt-4" style={[globalstyles.hr]}></View>
    </TouchableOpacity>
  );
};

export default SingleTransactionWidget;

const styles = StyleSheet.create({});
