import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  Feather,
  FontAwesome6,
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
  if (
    status?.toLocaleLowerCase() == "completed" ||
    status?.toLocaleLowerCase() == "successful"
  ) {
    return { bg: "bg-[#ddf7ed]", text: "text-[#1eb673]" };
  }
  if (status?.toLocaleLowerCase() == "true") {
    return { bg: "bg-green-100", text: "text-green-600" };
  }
  if (
    status?.toLocaleLowerCase() == "pending" ||
    status?.toLocaleLowerCase() == "processing"
  ) {
    return { bg: "bg-yellow-300", text: "text-gray-500" };
  }
  if (status?.toLocaleLowerCase() == "failed") {
    return { bg: "bg-red-400", text: "text-red-500" };
  }
  if (status?.toLocaleLowerCase() == "false") {
    return { bg: "bg-red-400", text: "text-red-800" };
  }
};

const SingleTransactionWidget = ({ transaction }: Props) => {
  const { userAccount } = useUserStore();

  // Only render if transaction exists and is not undefined/null
  if (!transaction) return null;

  let TransactionType: any;

  const nonNullProperty = Object.entries(transaction)
    .filter(
      ([key]) => key !== "transactionDate" && key !== "user" && key !== "id"
    )
    .find(([key, value]) => value !== null);

  TransactionType = nonNullProperty && nonNullProperty[0];

  const getIconToRender = () => {
    if (
      transaction?.safehavenAirtime !== null ||
      transaction?.vtuAirtimeTransaction !== null
    ) {
      return (
        <View
          style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
          className="flex items-center justify-center rounded-full h-[30px] w-[30px]"
        >
          <MaterialIcons name="call-made" size={20} color={Colors.primary} />
        </View>
      );
    }

    if (
      transaction?.safehavenData !== null ||
      transaction?.vtuDataTransaction !== null
    ) {
      return (
        <View
          style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
          className="flex items-center justify-center rounded-full h-[30px] w-[30px]"
        >
          <MaterialIcons name="network-wifi" size={20} color={Colors.primary} />
        </View>
      );
    }

    if (
      transaction?.safehavenCabletv !== null ||
      transaction?.vtuCabletvTransaction
    ) {
      return (
        <View
          style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
          className="flex items-center justify-center rounded-full h-[30px] w-[30px]"
        >
          <Feather name="tv" size={20} color={Colors.primary} />
        </View>
      );
    }
    if (
      transaction?.safehavenUtilitybill !== null ||
      transaction?.vtuUtilityTransaction
    ) {
      return (
        <View
          style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
          className="flex items-center justify-center rounded-full h-[30px] w-[30px]"
        >
          <Feather name="tv" size={20} color={Colors.primary} />
        </View>
      );
    }
    if (transaction?.transfer !== null) {
      return (
        <View
          style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
          className="flex items-center justify-center rounded-full h-[30px] w-[30px]"
        >
          <MaterialCommunityIcons
            name="bank-transfer"
            size={20}
            color={Colors.primary}
          />
        </View>
      );
    }
    return null;
  };

  const isIncomingTransfer = (beneficiaryAccount?: string) => {
    return beneficiaryAccount === userAccount?.accountNumber;
  };

  const ArrowSign = ({ account }: { account: string }) => {
    return (
      <View className="rotate-90 ml-2">
        <FontAwesome6
          name="arrow-right-arrow-left"
          size={12}
          color={isIncomingTransfer(account) ? "#1eb673" : "red"}
        />
      </View>
    );
  };
  const TransferTransactionView = () => (
    <View className="flex-1 gap-2" style={[globalstyles.rowview]}>
      <View className="flex-1" style={[globalstyles.rowview, { gap: 15 }]}>
        <View>{getIconToRender()}</View>
        <View>
          <Text className="font-[700]">
            {transaction?.[TransactionType]?.transactionType}
          </Text>
          <Text className="text-gray-500">
            {dateFormatter(transaction?.transactionDate)}
          </Text>
        </View>
      </View>
      <View className="basis-[30%]" style={[globalstyles.colview, { gap: 4 }]}>
        <View className="flex flex-row items-center">
          <Text
            className={
              isIncomingTransfer(
                transaction?.[TransactionType]?.beneficiaryAccountNumber
              )
                ? "text-[#1eb673]"
                : "text-black"
            }
          >
            {isIncomingTransfer(
              transaction?.[TransactionType]?.beneficiaryAccountNumber
            )
              ? "+" +
                "₦" +
                transaction?.[TransactionType]?.amount?.toLocaleString()
              : "-" +
                "₦" +
                transaction?.[TransactionType]?.amount?.toLocaleString()}
          </Text>
          <ArrowSign
            account={transaction?.[TransactionType]?.beneficiaryAccountNumber}
          />
        </View>
        <View
          className={`${
            getStatusColor(
              transaction?.[TransactionType]?.transferStatus?.toString()
            )?.bg
          } px-[1px] rounded-[8px] py-[2px] flex items-center justify-center`}
        >
          <Text
            className={` ${
              getStatusColor(
                transaction?.[TransactionType]?.transferStatus?.toString()
              )?.text
            } capitalize text-[10px] font-[500]`}
          >
            {transaction?.[TransactionType]?.transferStatus?.toString() ===
            "Completed"
              ? "Successful"
              : transaction?.[TransactionType]?.transferStatus?.toString()}
          </Text>
        </View>
      </View>
    </View>
  );

  const BillPaymentView = () => (
    <View className="flex-1" style={[globalstyles.rowview, ,]}>
      <View className="flex-1" style={[globalstyles.rowview, { gap: 15 }]}>
        <View>{getIconToRender()}</View>
        <View>
          <Text className="font-[700]">
            {transaction?.[TransactionType]?.receiver?.vendType}
          </Text>
          <Text className="text-gray-500">
            {dateFormatter(transaction?.transactionDate)}
          </Text>
        </View>
      </View>
      <View className="basis-[30%]" style={[globalstyles.colview, { gap: 4 }]}>
        <View className="flex flex-row items-center">
          <Text
            className={
              isIncomingTransfer(
                transaction?.[TransactionType]?.beneficiaryAccountNumber
              )
                ? "text-[#1eb673]"
                : "text-black"
            }
          >
            {isIncomingTransfer(
              transaction?.[TransactionType]?.beneficiaryAccountNumber
            )
              ? "+" +
                "₦" +
                transaction?.[TransactionType]?.amount?.toLocaleString()
              : "-" +
                "₦" +
                transaction?.[TransactionType]?.amount?.toLocaleString()}
          </Text>
          <ArrowSign
            account={transaction?.[TransactionType]?.beneficiaryAccountNumber}
          />
        </View>
        <View
          className={`${
            getStatusColor(transaction?.[TransactionType]?.status)?.bg
          }  rounded-[8px] px-[1px] py-[2px] flex items-center justify-center`}
        >
          <Text
            className={` ${
              getStatusColor(transaction?.[TransactionType]?.status)?.text
            } capitalize text-[10px] font-[500] px-4`}
          >
            {transaction?.[TransactionType]?.status}
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
          params: { id: transaction?.[TransactionType]?.id },
        })
      }
      activeOpacity={0.7}
      className="mb-5"
    >
      {TransactionType === "transfer" ? (
        <TransferTransactionView />
      ) : (
        <BillPaymentView />
      )}

      <View className="mt-4" style={[globalstyles.hr]}></View>
    </TouchableOpacity>
  );
};

export default SingleTransactionWidget;
