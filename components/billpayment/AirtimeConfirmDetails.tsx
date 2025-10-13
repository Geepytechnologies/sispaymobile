import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useUserStore } from "@/config/store";
import { AirtimeCategory } from "@/interfaces/airtime.interface";
import { Entypo } from "@expo/vector-icons";

type Props = {
  product: AirtimeCategory | null;
  phoneNumber?: string;
  amount?: string;
};

const AirtimeConfirmDetails = ({ amount, product, phoneNumber }: Props) => {
  const { userAccount } = useUserStore();
  return (
    <View>
      <View className="flex w-full h-full absolute top-0 left-0">
        <Image
          source={require("@/assets/images/sispaylogo2.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
          className="opacity-10"
        />
      </View>
      <Text className="font-[600] self-center">
        ₦<Text className="text-[30px]">{amount}</Text>
      </Text>
      <View className="flex flex-col gap-6 mt-3">
        <View className="flex flex-row items-center justify-between">
          <Text>Product Name</Text>
          <View className="flex flex-row items-center gap-2">
            <Image
              source={{ uri: product && product.logoUrl }}
              style={{ height: 20, width: 20, objectFit: "cover" }}
              className="rounded-full "
            />
            <Text>{product?.name} Airtime</Text>
          </View>
        </View>
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
  );
};

export default AirtimeConfirmDetails;

const styles = StyleSheet.create({});
