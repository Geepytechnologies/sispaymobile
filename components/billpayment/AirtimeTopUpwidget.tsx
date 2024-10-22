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

type Props = {
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  amount: string;
};

const AirtimeTopUpwidget = ({ setAmount, amount }: Props) => {
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
        <View style={[globalstyles.rowview]} className="gap-2 underline ">
          <Text>₦</Text>
          <TextInput
            value={amount}
            className=""
            placeholder="50 - 500,000"
            keyboardType="numeric"
            onChangeText={(text) => setAmount(text)}
          />
        </View>
        <TouchableOpacity
          className="px-4 py-2 rounded-[15px]"
          style={{ backgroundColor: Colors.primary }}
          activeOpacity={0.8}
          disabled
        >
          <Text className="text-white">Pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AirtimeTopUpwidget;

const styles = StyleSheet.create({});
