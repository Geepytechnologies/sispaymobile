import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import DynamicHeader from "@/components/DynamicHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import billpaymentService from "@/services/billpayment.service";
import { globalstyles } from "@/styles/common";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { renderBackdrop } from "./buydata";
import {
  useBuyElectricity,
  useUtilityBillCategories,
  useVerifyPower,
} from "@/queries/billpayment";
import { ScreenDimensions } from "@/constants/Dimensions";
import { useUserStore } from "@/config/store";
import { IVerifyPowerDataDTO } from "@/interfaces/requests/billpayment.interface";
import { PurchaseUtilityBillDTO } from "@/types/billpayment";

type Props = {};

interface IUtilityBillCategory {
  id: string;
  name: string;
  logoUrl: any;
  identifier: string;
}

const electricity = (props: Props) => {
  const { user, userAccount } = useUserStore();

  const [utilitybillCategory, setUtilityBillCategory] =
    useState<IUtilityBillCategory | null>(null);
  const utilityBillCategorySheetRef = React.useRef<BottomSheet>(null);
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [vendType, setvendType] = useState("");
  const [powerVerified, setPowerVerified] = useState(false);
  const { isLoading, data: utilitybillCategories } = useUtilityBillCategories();
  const inputPinRef = useRef<BottomSheet>(null);
  const setPinRef = useRef<BottomSheet>(null);
  useEffect(() => {
    if (utilitybillCategories && utilitybillCategories.length > 0) {
      setUtilityBillCategory(utilitybillCategories[0]);
    }
  }, [utilitybillCategories]);
  const { verifyPower, verifyingPower } = useVerifyPower({
    onSuccess: (value) => {
      setvendType(value.result.vendType);
      setPowerVerified(true);
    },
  });
  const { buyElectricity, buyingElectricity } = useBuyElectricity({
    onSuccess: () => {
      setPowerVerified(true);
    },
  });
  const handleVerifyPower = () => {
    const data: IVerifyPowerDataDTO = {
      serviceCategoryId: utilitybillCategory?.id as string,
      entityNumber: meterNumber,
    };
    verifyPower(data);
  };
  const showmodal = () => {
    utilityBillCategorySheetRef.current?.expand();
  };
  const closeOpenModals = () => {
    // normaldataRef.current?.close();
    // hotdataRef.current?.close();
    inputPinRef.current?.close();
    setPinRef.current?.close();
  };
  //  const openPinModal = () => {

  //     if (Number(dataAmount) > userAccount?.balance!) {
  //       Toast.show({
  //         type: "info",
  //         text1: "Insufficient Balance",
  //         text2: "Please top up to complete this transaction",
  //         visibilityTime: 3000,
  //         autoHide: true,
  //       });
  //       return;
  //     }
  //     if (userAccount?.accountPinSet) {
  //       inputPinRef.current?.expand();
  //     } else {
  //       setPinRef.current?.expand();
  //     }
  //   };
  const buyUtilityBill = () => {
    const data: PurchaseUtilityBillDTO = {
      serviceCategoryId: utilitybillCategory?.id as string,
      vendType: vendType,
      amount: Number(amount),
      meterNumber: meterNumber,
      accountNumber: userAccount?.accountNumber as string,
    };
    buyElectricity(data);
  };

  const handleUtilityBillCategory = (item: any) => {
    utilityBillCategorySheetRef.current?.close();
    setUtilityBillCategory(item);
  };
  return (
    <TouchableNativeFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Toast />
        <DynamicHeader title="Electricity" />
        {/* Service Provider */}
        <View className="bg-white px-3 py-6 my-5 shadow-sm rounded-xl">
          <Text className="text-gray-500">Service Provider</Text>
          <TouchableOpacity
            key={utilitybillCategory && utilitybillCategory.id}
            style={[globalstyles.rowview, { gap: 4 }]}
            onPress={() => showmodal()}
          >
            <Image
              source={{
                uri: utilitybillCategory && utilitybillCategory.logoUrl,
              }}
              style={{ height: 50, width: 50, objectFit: "contain" }}
              className="rounded-full "
            />
            <Text>{utilitybillCategory && utilitybillCategory.identifier}</Text>
            <FontAwesome6 name="caret-up" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        {/* packages */}
        <View className="bg-white px-3 py-6 my-5 shadow-sm rounded-xl">
          <Text className="font-[500]">Meter Number</Text>
          <TextInput
            value={meterNumber}
            onChangeText={(text) => setMeterNumber(text)}
            className="bg-gray-100 px-2 py-3 rounded-md mt-2"
            style={{}}
            placeholder="Enter Meter Number"
          />
        </View>
        {/* amount */}
        {powerVerified && (
          <View className="bg-white px-3 py-6 my-5 shadow-sm rounded-xl">
            <Text className="font-[500]">Amount (₦)</Text>
            <TextInput
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => setAmount(text)}
              className="bg-gray-100 px-2 py-3 rounded-md mt-2"
              style={{}}
              placeholder="Enter Amount"
            />
          </View>
        )}
        {!powerVerified ? (
          <TouchableOpacity
            onPress={handleVerifyPower}
            className="bg-appblue rounded-xl py-4 mt-auto"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center text-md font-[500]">
              {verifyingPower ? "Processing..." : "Verify Meter Number"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={buyUtilityBill}
            className="bg-appblue rounded-xl py-4 mt-auto"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center text-md font-[500]">
              {buyingElectricity ? "Processing..." : "Pay"}
            </Text>
          </TouchableOpacity>
        )}
        {/* tv options sheet */}
        <BottomSheet
          backdropComponent={renderBackdrop}
          index={-1}
          ref={utilityBillCategorySheetRef}
          snapPoints={["65%"]}
        >
          <BottomSheetView
            style={{ maxHeight: ScreenDimensions.screenHeight * 0.5 }}
          >
            <Text className="font-[500] text-center text-xl">
              Choose your provider
            </Text>
            <View className="px-5 pt-9 justify-center h-full">
              {!isLoading &&
                utilitybillCategories.map((item: any, index: any) => (
                  <TouchableOpacity
                    className="flex flex-row items-center justify-between mb-5 p-3 rounded-lg bg-[#f8f8f8]"
                    key={item.id}
                    onPress={() => handleUtilityBillCategory(item)}
                  >
                    <View className="flex flex-row items-center gap-3">
                      <Image
                        source={{ uri: item.logoUrl }}
                        style={{ height: 40, width: 40, objectFit: "contain" }}
                        className="rounded-full "
                      />
                      <Text>{item.identifier}</Text>
                    </View>

                    <MaterialCommunityIcons
                      name={
                        utilitybillCategory &&
                        utilitybillCategory.name == item.name
                          ? "check-circle"
                          : "checkbox-blank-circle-outline"
                      }
                      size={20}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </TouchableNativeFeedback>
  );
};

export default electricity;

const styles = StyleSheet.create({});
