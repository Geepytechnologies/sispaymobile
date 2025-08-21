import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { use } from "react";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { globalstyles } from "@/styles/common";
import { dateFormatter } from "@/utils/formatters";
import { router } from "expo-router";
import { useUserStore } from "@/config/store";

type Props = {
  transaction: any;
};
export const getStatusColor = (status: string) => {
  if (status.toLocaleLowerCase() == "completed") {
    return { bg: "bg-green-300", text: "text-green-600" };
  }
  if (status.toLocaleLowerCase() == "true") {
    return { bg: "bg-green-300", text: "text-green-600" };
  }
  if (
    status.toLocaleLowerCase() == "pending" ||
    status.toLocaleLowerCase() == "processing"
  ) {
    return { bg: "bg-yellow-300", text: "text-gray-500" };
  }
  if (status.toLocaleLowerCase() == "failed") {
    return { bg: "bg-red-400", text: "text-red-500" };
  }
  if (status.toLocaleLowerCase() == "false") {
    return { bg: "bg-red-400", text: "text-red-800" };
  }
};

const SingleTransactionWidget = ({ transaction }: Props) => {
  const { userAccount } = useUserStore();
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
    if (transaction.transfer !== null) {
      return (
        <View
          style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
          className="flex items-center justify-center rounded-full h-[30px] w-[30px] 
            "
        >
          <MaterialCommunityIcons
            name="bank-transfer"
            size={20}
            color={Colors.primary}
          />
        </View>
      );
    }
  };
  const isIncomingTransfer = (beneficiaryAccount: string) => {
    return beneficiaryAccount === userAccount?.accountNumber;
  };
  console.log({ singleTransaction: transaction });
  const TransferTransactionView = () => (
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
            {transaction[TransactionType].transactionType}
          </Text>
          <Text className="text-gray-500">
            {dateFormatter(transaction[TransactionType].transactionDate)}
          </Text>
        </View>
      </View>
      <View style={[globalstyles.colview, { gap: 4 }]}>
        <Text
          className={
            `${isIncomingTransfer(
              transaction[TransactionType].beneficiaryAccountNumber
            )} `
              ? "text-green-700"
              : "text-black"
          }
        >
          {isIncomingTransfer(
            transaction[TransactionType].beneficiaryAccountNumber
          )
            ? "+"
            : "-" + "₦" + transaction[TransactionType].amount.toLocaleString()}
        </Text>
        <View
          className={`${
            getStatusColor(
              transaction[TransactionType].transferStatus.toString()
            )?.bg
          }  rounded-[10px] h-10 p-1 flex items-center justify-center`}
        >
          <Text
            className={` ${
              getStatusColor(
                transaction[TransactionType].transferStatus.toString()
              )?.text
            } capitalize text-sm px-4`}
          >
            {transaction[TransactionType].transferStatus.toString() ==
            "Completed"
              ? "Successful"
              : "Failed"}
          </Text>
        </View>
      </View>
    </View>
  );
  const BillPaymentView = () => (
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
        <Text
          className={
            `${isIncomingTransfer(
              transaction[TransactionType].senderAccountNumber
            )} `
              ? getStatusColor(transaction[TransactionType].status)?.text
              : "text-black"
          }
        >
          {isIncomingTransfer(
            transaction[TransactionType].beneficiaryAccountNumber
          )
            ? "+"
            : "-" + "₦" + transaction[TransactionType].amount.toLocaleString()}
        </Text>
        <View
          className={`${
            getStatusColor(transaction[TransactionType].status)?.bg
          }  rounded-[10px] h-10 p-1 flex items-center justify-center`}
        >
          <Text
            className={` ${
              getStatusColor(transaction[TransactionType].status)?.text
            } capitalize text-sm px-4`}
          >
            {transaction[TransactionType].status}
          </Text>
        </View>
      </View>
    </View>
  );
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
      {TransactionType == "transfer" ? (
        <TransferTransactionView />
      ) : (
        <BillPaymentView />
      )}

      <View className="mt-4" style={[globalstyles.hr]}></View>
    </TouchableOpacity>
  );
};

export default SingleTransactionWidget;

const styles = StyleSheet.create({});
