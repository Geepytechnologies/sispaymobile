import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { QrCodeSvg, plainRenderer } from "react-native-qr-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import DynamicHeader from "@/components/DynamicHeader";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import { FontAwesome } from "@expo/vector-icons";

type Props = {};

const qrCodePage = (props: Props) => {
  const { userAccount } = useSelector((state: RootState) => state.account);
  const SIZE = 250;
  const CONTENT = userAccount?.accountNumber as string;

  return (
    <SafeAreaView className="bg-white" style={{ flex: 1, padding: 16 }}>
      <DynamicHeader title={"QR Code Payment"} />
      <Text className="text-[14px] leading-[22px] text-[#292B2D] mt-6">
        You can receive and send money via sispay QR Code payment.
      </Text>
      <View className="flex flex-row justify-between">
        <TouchableOpacity>
          <View className="flex flex-row bg-[#DCFCE7] gap-3 p-[18px] rounded-[20px]">
            <View className="bg-[#07AF0E] h-[50px] w-[50px] items-center justify-center rounded-full">
              <FontAwesome name="qrcode" size={24} color="white" />
            </View>
            <Text>Receive Money</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View className="flex flex-row bg-[#DCFCE7] gap-3 p-[18px] rounded-[20px]">
            <View className="bg-[#0064FF] h-[50px] w-[50px] items-center justify-center rounded-full">
              <FontAwesome name="qrcode" size={24} color="white" />
            </View>
            <Text>Make Payment</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className="items-center justify-center mt-8">
        <QrCodeSvg
          style={styles.qr}
          value={CONTENT}
          frameSize={SIZE}
          contentCells={5}
          content={<Text style={styles.icon}>👋</Text>}
          contentStyle={styles.box}
          dotColor={Colors.primary}
        />
      </View>
    </SafeAreaView>
  );
};

export default qrCodePage;

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 40,
  },
  qr: {
    padding: 15,
  },
});
