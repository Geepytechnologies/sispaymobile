import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { globalstyles } from "@/styles/common";
import { LoadingIndicator } from "../common/LoadingIndicator";

type Props = {
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  amount: string;
  purchaseAirtime: any;
  loading: boolean;
};

const AirtimeTopUpwidget = ({
  loading,
  setAmount,
  amount,
  purchaseAirtime,
}: Props) => {
  const TopupPrices = [
    {
      price: 50,
      pay: 50,
    },

    {
      price: 100,
      pay: 100,
    },
    { price: 200, pay: 200 },
    { price: 500, pay: 500 },
    { price: 1000, pay: 1000 },
    { price: 2000, pay: 2000 },
  ];
  return (
    <View className="shadow-sm rounded-[20px] bg-white p-4">
      <Text className="font-[600] text-md font-popp">Top up</Text>
      <View className="flex flex-row flex-wrap my-5">
        {TopupPrices.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setAmount(item.pay.toString())}
            key={index}
            className="p-2 items-center justify-center w-1/3 h-[80px]"
          >
            <View className="rounded-md items-center justify-center w-full h-full  bg-[#e1e3ec]">
              <Text className="text-center font-[500] text-md">
                ₦<Text>{item.price}</Text>
              </Text>
              <Text className="text-center text-gray-500">Pay ₦{item.pay}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[globalstyles.rowview, { justifyContent: "space-between" }]}>
        <View
          style={[globalstyles.rowview]}
          className="gap-2 underline text-primary "
        >
          <Text className="text-primary">₦</Text>
          <TextInput
            style={{ color: "#14A673" }}
            value={amount}
            className=""
            placeholder="50 - 500,000"
            keyboardType="numeric"
            onChangeText={(text) => setAmount(text)}
          />
        </View>
        <TouchableOpacity
          onPress={purchaseAirtime}
          className="py-4 min-w-[80px] items-center justify-center rounded-[10px]"
          style={{ backgroundColor: Colors.primary }}
          activeOpacity={0.8}
        >
          {!loading ? (
            <Text className="text-white">Pay</Text>
          ) : (
            <LoadingIndicator size={15} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AirtimeTopUpwidget;

const styles = StyleSheet.create({});
