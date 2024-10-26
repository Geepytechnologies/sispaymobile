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
import React, { useEffect, useState } from "react";
import DynamicHeader from "@/components/DynamicHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import billpaymentService from "@/services/billpayment.service";
import { useQuery } from "@tanstack/react-query";
import { globalstyles } from "@/styles/common";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { renderBackdrop } from "./buydata";
import { ScreenDimensions } from "@/constants/Dimensions";

type Props = {};

interface IUtilityBillCategory {
  id: string;
  name: string;
  logoUrl: any;
  identifier: string;
}

const electricity = (props: Props) => {
  const [utilitybillCategory, setUtilityBillCategory] =
    useState<IUtilityBillCategory | null>(null);
  const utilityBillCategorySheetRef = React.useRef<BottomSheet>(null);
  const [meterNumber, setMeterNumber] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const {
    isLoading,
    data: utilitybillCategories,
    error,
    refetch,
  } = useQuery({
    queryKey: ["utilitybillcategories"],
    queryFn: billpaymentService.getUtilityBillServiceCategory,
  });
  useEffect(() => {
    if (utilitybillCategories && utilitybillCategories.length > 0) {
      //   console.log(dataCategories);
      setUtilityBillCategory(utilitybillCategories[0]);
    }
  }, [utilitybillCategories]);

  const showmodal = () => {
    utilityBillCategorySheetRef.current?.expand();
  };
  const buyUtilityBill = () => {};
  const handleUtilityBillCategory = (item: any) => {
    utilityBillCategorySheetRef.current?.close();
    setUtilityBillCategory(item);
  };
  return (
    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
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
        <TouchableOpacity
          onPress={buyUtilityBill}
          className="bg-appblue rounded-xl py-4 mt-auto"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center text-xl font-[500]">
            {purchaseLoading ? "Processing..." : "Pay"}
          </Text>
        </TouchableOpacity>
        {/* tv options sheet */}
        <BottomSheet
          backdropComponent={renderBackdrop}
          index={-1}
          ref={utilityBillCategorySheetRef}
          snapPoints={["40%"]}
        >
          <BottomSheetView
            style={{ maxHeight: ScreenDimensions.screenHeight * 0.5 }}
          >
            <View className="px-5 pt-9 justify-center h-full">
              {!isLoading &&
                utilitybillCategories.map((item: any, index: any) => (
                  <TouchableOpacity
                    className="flex flex-row items-center justify-between mb-5 p-3 rounded-lg bg-[#d5d8e5]"
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
