import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { globalstyles } from "@/styles/common";
import { Entypo } from "@expo/vector-icons";
import { useUserStore } from "@/config/store";

type Props = {
  logoUrl: string;
  productName: string | undefined;
  amount: string;
  buydata: () => void;
  purchaseLoading: boolean;
  phoneNumber: string;
};

const DataTopUpDetailswidget = ({
  logoUrl,
  productName,
  amount,
  buydata,
  purchaseLoading,
  phoneNumber,
}: Props) => {
  const { userAccount } = useUserStore();
  return (
    <View className="h-full" style={{ padding: 20 }}>
      <View className="flex w-full h-full absolute top-0 left-0">
        <Image
          source={require("@/assets/images/sispaylogo2.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
          className="opacity-10"
        />
      </View>
      <View className="mb-5">
        <Text className="font-[600] self-center">
          ₦<Text className="text-[30px]">{amount}</Text>
        </Text>
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
          <View className="flex flex-row items-center justify-between">
            <Text>Recipient</Text>
            <Text>{phoneNumber}</Text>
          </View>
          <View className="flex flex-row items-center justify-between">
            <Text>Amount</Text>
            <Text>₦{amount}</Text>
          </View>
          <View className="border border-dashed"></View>
          <View className="bg-[#e1e3ec] rounded-lg">
            <View className="flex flex-row items-center justify-between p-4">
              <View className="flex flex-row gap-1">
                <Text className="font-[600]">Available Balance</Text>
                <Entypo name="check" size={24} color="green" />
              </View>
              <Text className="font-[600]">₦{userAccount?.balance}</Text>
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
