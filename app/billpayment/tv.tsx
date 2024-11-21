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
import Toast from "react-native-toast-message";
import DynamicHeader from "@/components/DynamicHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import billpaymentService from "@/services/billpayment.service";
import { globalstyles } from "@/styles/common";
import {
  Feather,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { ScreenDimensions } from "@/constants/Dimensions";
import { renderBackdrop } from "./buydata";
import axios from "axios";
import { PurchaseCableTvDTO } from "@/types/billpayment";
import { Dropdown } from "react-native-element-dropdown";
import { useBuyCableTv } from "@/queries/billpayment";

type Props = {};
interface ITvCategory {
  id: string;
  name: string;
  logoUrl: any;
  identifier: string;
}
const tv = (props: Props) => {
  const [tvCategory, setTvCategory] = useState<ITvCategory | null>(null);
  const tvCategorySheetRef = useRef<BottomSheet>(null);
  const [smartCardNumber, setSmartCardNumber] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [productCategories, setProductCategories] = useState([]);
  const [tvInputDetails, setTvInputDetails] = useState({
    amount: "",
    bundleCode: "",
    name: "",
  });
  const [tvInputLabel, setTvInputLabel] = useState<any>();
  const [isFocus, setIsFocus] = useState(false);

  const { buyCableTv, buyCableTvLoading } = useBuyCableTv({
    onSuccess: (data) => {
      setSuccessModal(true);
      setPurchaseLoading(false);
      refetch();
    },
    onError: (error) => {
      setPurchaseLoading(false);
      console.log("error", error);
    },
  });

  const {
    isLoading,
    data: tvCategories,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tvcategories"],
    queryFn: billpaymentService.getCableTvServiceCategory,
  });
  useEffect(() => {
    if (tvCategories && tvCategories.length > 0) {
      //   console.log(dataCategories);
      setTvCategory(tvCategories[0]);
    }
  }, [tvCategories]);
  const data = isLoading
    ? []
    : productCategories.map((item: any) => ({
        label: item.name,
        value: item,
      }));
  const getProductCategories = async () => {
    try {
      const res = await billpaymentService.getProductCategories(tvCategory?.id);
      console.log("product categories", res);
      setProductCategories(res);
    } catch (error) {}
  };
  useEffect(() => {
    getProductCategories();
  }, [tvCategory]);

  const toggleModal = () => {
    setSuccessModal(!successModal);
  };
  const showmodal = () => {
    tvCategorySheetRef.current?.expand();
  };
  const handleTvCategory = (item: any) => {
    tvCategorySheetRef.current?.close();
    setTvCategory(item);
  };
  const handleTvPackage = (item: any) => {
    setTvInputDetails({
      name: item.label,
      amount: item.value.amount,
      bundleCode: item.value.bundleCode,
    });
  };
  const handleCableTv = async () => {
    if (smartCardNumber == "") {
      Toast.show({
        type: "error",
        text1: "Smart Card Number is required",
      });
      return;
    }
    if (tvInputLabel == "") {
      Toast.show({
        type: "error",
        text1: "Select a TV Package",
      });
      return;
    }
    setPurchaseLoading(true);
    const tvDetails: PurchaseCableTvDTO = {
      cardNumber: smartCardNumber,
      serviceCategoryId: tvCategory?.id,
      bundleCode: tvInputDetails.bundleCode,
      amount: Number(tvInputDetails.amount),
      accountNumber: "",
    };
    buyCableTv(tvDetails);
  };
  return (
    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Toast />
        <DynamicHeader title="Tv" />
        {/* Service Provider */}
        <View className="bg-white px-3 py-6 my-5 shadow-sm rounded-xl">
          <Text className="text-gray-500">Service Provider</Text>
          <TouchableOpacity
            key={tvCategory && tvCategory.id}
            style={[globalstyles.rowview, { gap: 4 }]}
            onPress={() => showmodal()}
          >
            <Image
              source={{ uri: tvCategory && tvCategory.logoUrl }}
              style={{ height: 50, width: 50, objectFit: "contain" }}
              className="rounded-full "
            />
            <Text>{tvCategory && tvCategory.identifier}</Text>
            <FontAwesome6 name="caret-up" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        {/* packages */}
        <View className="bg-white px-3 py-6 my-5 shadow-sm rounded-xl">
          <Text className="font-[500]">Smartcard Number</Text>
          <TextInput
            value={smartCardNumber}
            onChangeText={(text) => setSmartCardNumber(text)}
            className="bg-gray-100 px-2 py-3 rounded-md mt-2"
            style={{}}
            placeholder="Enter Your Smartcard Number"
          />
          {/* choose package */}
          <View style={{ gap: 4 }} className="my-4">
            {!isLoading && (
              <View style={{}}>
                <Text className="font-[500] mb-2">Package</Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus && { borderColor: Colors.primary },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={data}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "Choose Package" : "..."}
                  searchPlaceholder="Search..."
                  value={"tvInputLabel"}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setTvInputLabel(item.value.name);
                    handleTvPackage(item);
                    setIsFocus(false);
                  }}
                  renderLeftIcon={() => (
                    <Feather
                      style={styles.icon}
                      name="tv"
                      size={20}
                      color={isFocus ? Colors.primary : "black"}
                    />
                  )}
                />
              </View>
            )}
          </View>
          {/* package */}
          {tvInputLabel && (
            <View className="my-4">
              <Text className="font-[500]">Package</Text>
              <Text className="bg-gray-100 text-gray-400 px-2 py-3 rounded-xl mt-2">
                {tvInputLabel}
              </Text>
            </View>
          )}
          {/* Amount */}
          {!isLoading && (
            <View>
              <Text className="font-[500]">Amount</Text>
              <Text className="bg-gray-100 text-gray-400 px-2 py-3 rounded-xl mt-2">
                ₦ {tvInputDetails.amount || "00.00"}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={handleCableTv}
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
          ref={tvCategorySheetRef}
          snapPoints={["40%"]}
        >
          <BottomSheetView
            style={{ maxHeight: ScreenDimensions.screenHeight * 0.5 }}
          >
            <View className="px-5 pt-9 justify-center h-full">
              {!isLoading &&
                tvCategories.map((item: any, index: any) => (
                  <TouchableOpacity
                    className="flex flex-row items-center justify-between mb-5 p-3 rounded-lg bg-[#d5d8e5]"
                    key={item.id}
                    onPress={() => handleTvCategory(item)}
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
                        tvCategory && tvCategory.name == item.name
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

export default tv;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    padding: 12,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#9ca3af",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
