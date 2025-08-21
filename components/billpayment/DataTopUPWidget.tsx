import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { globalstyles } from "@/styles/common";
import { useQuery } from "@tanstack/react-query";
import billpaymentService from "@/services/billpayment.service";
import { useProductCategories, useVtuDataPlans } from "@/queries/billpayment";
import { Fontisto } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ScreenDimensions } from "@/constants/Dimensions";
import Toast, { BaseToast } from "react-native-toast-message";

type Props = {
  phone: string | undefined;
  category: string | undefined;
  name: string | undefined;
  showhotdatamodal: any;
  shownormaldatamodal: any;
  setPhoneError: React.Dispatch<React.SetStateAction<boolean>>;
  setNormalDataDetails: React.Dispatch<
    React.SetStateAction<{
      bundleCode: string;
      amount: string;
      serviceCategoryId: string;
    }>
  >;
  setHotDataDetails: React.Dispatch<
    React.SetStateAction<{
      network: string;
      dataPlan: string;
      amount: string;
    }>
  >;
};

const DataTopUPWidget = ({
  category,
  name,
  phone,
  setPhoneError,
  showhotdatamodal,
  shownormaldatamodal,
  setNormalDataDetails,
  setHotDataDetails,
}: Props) => {
  const [selectedDataCategoryOption, setSelectedDataCategoryOption] =
    useState("Hot");

  const dataCategoryOptions = [
    "Hot",
    "Daily",
    "2 Days",
    "Weekly",
    "Monthly",
    "2-Months",
    "3-Months",
    "Yearly",
    "Two Years",
  ];
  let productCategories;
  let HotPlans: any;
  let dailyPlans: any;
  let twoDayPlan: any;
  let weeklyPlans: any;
  let monthlyplans: any;
  let twoMonthPlan: any;
  let threeMonthPlan: any;
  let yearlyPlans: any;
  let twoYearPlans: any;

  const plansToRender = () => {
    switch (selectedDataCategoryOption) {
      case "Hot":
        return HotPlans;
      case "Daily":
        return dailyPlans;
      case "2 Days":
        return twoDayPlan;
      case "Weekly":
        return weeklyPlans;
      case "Monthly":
        return monthlyplans;
      case "2-Months":
        return twoMonthPlan;
      case "3-Months":
        return threeMonthPlan;
      case "Yearly":
        return yearlyPlans;
      case "Two Years":
        return twoYearPlans;
      default:
        return dailyPlans;
    }
  };

  const { isLoading, data } = useProductCategories(category);
  const { isLoading: vtuDataLoading, data: vtuDataPlans } = useVtuDataPlans();

  productCategories = data;
  if (!isLoading && productCategories) {
    dailyPlans = productCategories.filter(
      (item: { validity: string }) => item.validity == "1 Day"
    );
    twoDayPlan = productCategories.filter(
      (item: { validity: string }) => item.validity === "2 Days"
    );
    weeklyPlans = productCategories.filter(
      (item: { validity: string }) => item.validity === "7 Days"
    );
    monthlyplans = productCategories.filter(
      (item: { validity: string }) =>
        item.validity == "30 Days" || item.validity == "1 month"
    );
    twoMonthPlan = productCategories.filter(
      (item: { validity: string }) => item.validity === "2 Months"
    );
    threeMonthPlan = productCategories.filter(
      (item: { validity: string }) => item.validity === "3 Months"
    );
    yearlyPlans = productCategories.filter(
      (item: { planType: string }) => item.planType === "1 Year"
    );
    twoYearPlans = productCategories.filter(
      (item: { planType: string }) => item.planType === "2 Year"
    );
  }
  if (!vtuDataLoading) {
    HotPlans = vtuDataPlans.filter(
      (item: { NETWORK: string }) => item.NETWORK == name
    );
    // console.log("hot plans", HotPlans);
  }
  const RenderCategoryoptions = ({ item }: { item: string }) => {
    return (
      <TouchableOpacity
        className="mr-6"
        onPress={() => setSelectedDataCategoryOption(item)}
        activeOpacity={0.8}
        style={[globalstyles.colview]}
      >
        <Text
          className="font-popp"
          style={{
            fontWeight: "600",
            color:
              selectedDataCategoryOption == item ? Colors.offset : "#6b7280",
          }}
        >
          {item}
        </Text>
        {selectedDataCategoryOption == item && (
          <View
            style={{
              backgroundColor: Colors.offset,
            }}
            className="h-[4px] w-[70%] self-center mt-1"
          ></View>
        )}
      </TouchableOpacity>
    );
  };
  const handleHotData = (item: any) => {
    if (!phone) {
      setPhoneError(true);
      Toast.show({
        text1: "Please enter phone number",
        type: "error",
        position: "top",
        autoHide: true,
        topOffset: 20,
        bottomOffset: 0,
      });
      return;
    }
    if (name) {
      setHotDataDetails({
        network: name,
        dataPlan: item.dataPlan,
        amount: item.price[0].api_user,
      });
    }
    showhotdatamodal();
  };

  const handleNormalData = (item: any) => {
    if (!phone) {
      setPhoneError(true);
      Toast.show({
        swipeable: true,
        text1: "Please enter phone number",
        type: "info",
        position: "top",
        autoHide: true,
        bottomOffset: 0,
      });
      return;
    }
    if (category) {
      setNormalDataDetails({
        bundleCode: item.bundleCode,
        amount: item.amount,
        serviceCategoryId: category,
      });
    }
    shownormaldatamodal();
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="shadow-sm rounded-[20px] bg-white p-4"
    >
      <View style={{ zIndex: 40 }}>
        <Toast />
      </View>
      {/* scrolloptions */}
      <FlatList
        data={dataCategoryOptions}
        renderItem={RenderCategoryoptions}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      {plansToRender() === undefined || !plansToRender().length ? (
        <View style={[globalstyles.centerview, { marginTop: 50, gap: 20 }]}>
          <Fontisto name="search" size={40} color={Colors.offset} />
          <Text>No Products</Text>
        </View>
      ) : plansToRender() === HotPlans ? (
        <View className="flex flex-row flex-wrap my-5">
          {plansToRender()[0]?.["BUNDLE"]?.map((item: any, index: any) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleHotData(item)}
              activeOpacity={0.7}
              className="p-2 items-center justify-center w-1/3 h-[100px]"
            >
              <View className="rounded-md items-center justify-center w-full h-full  bg-[#e1e3ec]">
                <Text className="text-center font-popp font-[700] text-md">
                  <Text>{item.dataPlan}</Text>
                </Text>
                <Text className="text-center text-gray-500 font-[500] text-md">
                  {item.duration}
                </Text>
                <Text className="text-center text-green-700">
                  ₦{item.price[0].api_user}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View className="flex flex-row flex-wrap my-5">
          {plansToRender().map((item: any, index: any) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleNormalData(item)}
              activeOpacity={0.7}
              className="p-2 items-center justify-center w-1/3 h-[100px]"
            >
              <View className="rounded-md items-center justify-center w-full h-full  bg-[#e1e3ec]">
                <Text className="text-center font-popp font-[700] text-md">
                  <Text>{item.bundleCode}</Text>
                </Text>
                <Text className="text-center text-gray-500 font-[500] text-md">
                  {item.validity}
                </Text>
                <Text className="text-center text-green-700">
                  ₦{item.amount}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default DataTopUPWidget;

const styles = StyleSheet.create({});
