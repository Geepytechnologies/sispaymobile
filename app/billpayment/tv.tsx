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
import billpaymentService from "@/services/billpayment.service";
import { globalstyles } from "@/styles/common";
import {
  Feather,
  FontAwesome,
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
import {
  useBuyCableTv,
  useCableTvCategories,
  useProductCategories,
  useVerifyCableTv,
} from "@/queries/billpayment";
import { IVerifyCableTvDTO } from "@/interfaces/requests/billpayment.interface";
import { useUserStore } from "@/config/store";

type Props = {};
interface ITvCategory {
  id: string;
  name: string;
  logoUrl: any;
  identifier: string;
}
const tv = (props: Props) => {
  const { userAccount } = useUserStore();
  const [tvCategory, setTvCategory] = useState<ITvCategory | null>(null);
  const tvCategorySheetRef = useRef<BottomSheet>(null);
  const [tvPackageData, setTvPackageData] = useState<
    { label: string; value: any }[]
  >([]);
  const [tvVerified, setTvVerified] = useState(false);
  const [smartCardNumber, setSmartCardNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  // const [productCategories, setProductCategories] = useState([]);
  const [tvInputDetails, setTvInputDetails] = useState({
    amount: "",
    bundleCode: "",
    name: "",
  });
  const [tvInputLabel, setTvInputLabel] = useState<any>();
  const [isFocus, setIsFocus] = useState(false);

  const { verifyCableTv, verifyingCableTv } = useVerifyCableTv({
    onSuccess: (value) => {
      setCustomerName(value.result.name);
      setTvVerified(true);
    },
  });
  const handleVerifyTv = () => {
    const data: IVerifyCableTvDTO = {
      serviceCategoryId: tvCategory?.id as string,
      entityNumber: smartCardNumber,
    };
    verifyCableTv(data);
  };
  const { buyCableTv, buyCableTvLoading } = useBuyCableTv({
    onSuccess: (data) => {
      setSuccessModal(true);
      setPurchaseLoading(false);
    },
    onError: (error) => {
      setPurchaseLoading(false);
      console.log("error", error);
    },
  });

  const { isLoading, data: tvCategories, refetch } = useCableTvCategories();
  useEffect(() => {
    if (tvCategories && tvCategories.length > 0) {
      //   console.log(dataCategories);
      setTvCategory(tvCategories[0]);
    }
  }, [tvCategories]);
  const { productCategories, fetchingProductCategory } = useProductCategories({
    id: tvCategory?.id,
  });
  const data = productCategories.map((item: any) => ({
    label: item.name,
    value: item,
  }));
  useEffect(() => {
    if (productCategories && productCategories.length > 0) {
      setTvPackageData(
        productCategories.map((item: any) => ({
          label: item.name,
          value: item,
        }))
      );
    }
  }, [productCategories]);
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
      accountNumber: userAccount?.accountNumber as string,
    };
    buyCableTv(tvDetails);
  };
  return (
    <TouchableNativeFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
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
            keyboardType="numeric"
            value={smartCardNumber}
            onChangeText={(text) => setSmartCardNumber(text)}
            className="bg-gray-100 px-2 py-3 rounded-md mt-2"
            style={{}}
            placeholder="Enter Your Smartcard Number"
          />
          {tvVerified && (
            <View className="flex flex-row items-center gap-2 mt-2">
              <FontAwesome name="user" size={24} color="black" />
              <Text className="text-sm">{customerName}</Text>
            </View>
          )}

          {tvVerified && (
            <View className="flex flex-col mt-4">
              {/* choose package */}
              <View style={{ gap: 4 }}>
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
                      data={tvPackageData}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="label"
                      placeholder={!isFocus ? "Choose Package" : "..."}
                      searchPlaceholder="Search..."
                      value={tvInputLabel}
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
              <View className="my-4">
                <Text className="font-[500]">Amount</Text>
                <Text className="bg-gray-100 text-gray-400 px-2 py-3 rounded-xl mt-2">
                  ₦ {tvInputDetails.amount || "00.00"}
                </Text>
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
            </View>
          )}
        </View>
        {!tvVerified ? (
          <TouchableOpacity
            onPress={handleVerifyTv}
            className="bg-appblue rounded-xl py-4 mt-auto"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center text-sm font-[500]">
              {verifyingCableTv ? "Processing..." : "Verify Smart Card Number"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleCableTv}
            className="bg-appblue rounded-xl py-4 mt-auto"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center text-sm font-[500]">
              {buyCableTvLoading ? "Processing..." : "Pay"}
            </Text>
          </TouchableOpacity>
        )}

        {/* tv options sheet */}
        <BottomSheet
          backdropComponent={renderBackdrop}
          index={-1}
          ref={tvCategorySheetRef}
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
                tvCategories.map((item: any, index: any) => (
                  <TouchableOpacity
                    className="flex flex-row items-center justify-between mb-5 p-3 rounded-lg bg-[#f8f8f8]"
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
