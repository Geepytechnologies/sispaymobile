import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { QrCodeSvg, plainRenderer } from "react-native-qr-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import DynamicHeader from "@/components/DynamicHeader";
import { useUserStore } from "@/config/store";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

type Props = {};

const qrCodePage = (props: Props) => {
  const { userAccount } = useUserStore();
  const SIZE = 250;
  const CONTENT = userAccount?.accountNumber as string;
  const [paymentMode, setPaymentMode] = React.useState(1);

  const handlePaymentModeChange = (mode: number) => {
    setPaymentMode(mode);
  };

  return (
    <SafeAreaView className="bg-white" style={{ flex: 1, padding: 16 }}>
      <DynamicHeader title={"QR Code Payment"} />
      <Text className="text-[14px] leading-[22px] font-[500] font-Inter text-[#292B2D] mt-6">
        You can receive and send money via sispay QR Code payment.
      </Text>
      <View className="flex flex-row justify-between gap-3 mt-6 ">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handlePaymentModeChange(1)}
          className="flex-1"
        >
          <View
            className={` ${
              paymentMode == 1 && "border border-[#07AF0E] "
            } flex flex-row items-center bg-[#DCFCE7] gap-3 p-[18px] rounded-[20px]`}
          >
            <View className="bg-[#07AF0E] h-[50px] w-[50px] items-center justify-center rounded-full">
              <FontAwesome name="qrcode" size={24} color="white" />
            </View>
            <Text className="text-base font-Poppins max-w-[100px]">
              Receive Money
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handlePaymentModeChange(2)}
          className="flex-1"
        >
          <View
            className={` ${
              paymentMode == 2 && "border border-[#07AF0E] "
            } flex flex-row items-center bg-[#DCFCE7] gap-3 p-[18px] rounded-[20px]`}
          >
            <View className="bg-[#0064FF] h-[50px] w-[50px] items-center justify-center rounded-full">
              <FontAwesome name="qrcode" size={24} color="white" />
            </View>
            <Text className="text-base font-Poppins max-w-[100px]">
              Make Payment
            </Text>
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
      <View>
        {paymentMode == 1 && (
          <Text className="text-center text-[14px] leading-[22px] font-[500] font-Inter text-[#292B2D] mt-6">
            Scan the QR code to complete your transaction.
          </Text>
        )}
        {paymentMode == 2 && (
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/transfer/cameraScreen" })}
            activeOpacity={0.7}
            className="flex items-center justify-center mt-6 bg-appblue gap-3 p-[18px] rounded-[20px]  "
          >
            <Text className="text-lg font-[500] font-Poppins text-white">
              Scan A QR Code
            </Text>
          </TouchableOpacity>
        )}
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
