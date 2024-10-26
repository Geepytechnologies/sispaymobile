import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { globalstyles } from "@/styles/common";

type Props = {
  logoUrl: string;
  productName: string | undefined;
  amount: string;
  buydata: () => Promise<void>;
  purchaseLoading: boolean;
};

const DataTopUpDetailswidget = ({
  logoUrl,
  productName,
  amount,
  buydata,
  purchaseLoading,
}: Props) => {
  return (
    <View className="h-full" style={{ padding: 20 }}>
      <View>
        <Text className="text-xl font-[700] self-center">₦{amount}</Text>
        <View style={[{ gap: 20 }]}>
          {/* product name */}
          <View
            style={[globalstyles.rowview, { justifyContent: "space-between" }]}
          >
            <Text className="text-gray-500">Product Name</Text>
            <View style={[globalstyles.rowview, { gap: 5 }]}>
              <Image
                source={{ uri: logoUrl }}
                style={{ height: 30, width: 30, objectFit: "cover" }}
                className="rounded-full "
              />
              <Text className="text-gray-600">MobileData</Text>
            </View>
          </View>
          {/* Amount */}
          <View
            style={[globalstyles.rowview, { justifyContent: "space-between" }]}
          >
            <Text className="text-gray-500">Amount</Text>
            <View style={[globalstyles.rowview, { gap: 5 }]}>
              <Text className="text-gray-600">₦{amount}</Text>
            </View>
          </View>
          {/* Bonus */}
          <View
            style={[globalstyles.rowview, { justifyContent: "space-between" }]}
          >
            <Text className="text-gray-500">Bonus to Earn</Text>
            <View style={[globalstyles.rowview, { gap: 5 }]}>
              <Text className="text-green-500">
                +₦ {0.025 * Number(amount)} Cashback
              </Text>
            </View>
          </View>
          {/* Payment Method */}
          <View
            style={[globalstyles.rowview, { justifyContent: "space-between" }]}
          >
            <Text className="text-gray-600">Payment Method</Text>
            <View style={[globalstyles.rowview, { gap: 5 }]}>
              <Text className="text-appblue">Wallet</Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity
        disabled={purchaseLoading}
        onPress={buydata}
        activeOpacity={0.8}
        className="bg-appblue rounded-[20px] py-3 mt-auto"
      >
        <Text className="font-[600] text-white text-center text-xl font-popp">
          {purchaseLoading ? "Processing..." : "Pay"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DataTopUpDetailswidget;

const styles = StyleSheet.create({});
