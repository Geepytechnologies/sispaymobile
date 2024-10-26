import {
  Button,
  FlatList,
  Image,
  ImageSourcePropType,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "expo-router";
import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { globalstyles } from "@/styles/common";
import { SafeAreaView } from "react-native-safe-area-context";
import Backbutton from "@/components/buttons/Backbutton";
import { useMutation, useQuery } from "@tanstack/react-query";
import billpaymentService from "@/services/billpayment.service";
import DynamicHeader from "@/components/DynamicHeader";
import useContacts from "@/hooks/useContacts";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Modal from "react-native-modal";
import { Backdrop } from "@/components/common/Backdrop";
import { Colors } from "@/constants/Colors";
import * as Contacts from "expo-contacts";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import { ScreenDimensions } from "@/constants/Dimensions";
import AirtimeTopUpwidget from "@/components/billpayment/AirtimeTopUpwidget";
import {
  PurchaseAirtimeDTO,
  PurchaseDataDTO,
  PurchaseVtuDataDTO,
} from "@/types/billpayment";
import SuccessPayment from "@/components/billpayment/SuccessPayment";
import axios from "axios";
import Toast from "react-native-toast-message";
import DataTopUPWidget from "@/components/billpayment/DataTopUPWidget";
import DataTopUpDetailswidget from "@/components/billpayment/DataTopUpDetailswidget";

type Props = {};

interface DataCategory {
  id: string;
  name: string;
  logoUrl: any;
}

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    opacity={0.7} // You can customize the opacity here
  />
);

const buydata = (props: Props) => {
  const { currentuser } = useSelector((state: RootState) => state.user);
  const { userAccount } = useSelector((state: RootState) => state.account);
  // const { contacts, getContacts } = useContacts();
  const snapPoints = ["40%"];
  const [isModalVisible, setModalVisible] = useState(false);
  const [isContactsModalVisible, setIsContactsModalVisible] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<string | undefined>(
    currentuser?.phoneNumber
  );
  const [phoneError, setPhoneError] = useState(!selectedPhone);
  const [successModal, setSuccessModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [hotDataDetails, setHotDataDetails] = useState({
    network: "",
    dataPlan: "",
    amount: "",
  });
  const [normalDataDetails, setNormalDataDetails] = useState({
    bundleCode: "",
    amount: "",
    serviceCategoryId: "",
  });
  const [DataCategory, setDataCategory] = useState<DataCategory | null>(null);
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const bottomsheetRef = useRef<BottomSheet>(null);
  const contactsRef = useRef<BottomSheet>(null);
  const hotdataRef = useRef<BottomSheet>(null);
  const normaldataRef = useRef<BottomSheet>(null);

  const toggleModal = () => {
    setSuccessModal(!successModal);
  };
  const {
    isLoading,
    data: dataCategories,
    error,
    refetch,
  } = useQuery({
    queryKey: ["datacategories"],
    queryFn: billpaymentService.getDataServiceCategory,
  });

  useEffect(() => {
    if (dataCategories && dataCategories.length > 0) {
      //   console.log(dataCategories);
      setDataCategory(dataCategories[0]);
    }
  }, [dataCategories]);

  useEffect(() => {
    const getContactsPermission = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        console.log(status);
        const { data } = await Contacts.getContactsAsync();
        const sortedContacts = [...data].sort((a: any, b: any) =>
          a?.firstName?.localeCompare(b?.firstName)
        );
        setContacts(sortedContacts);
      }
    };

    getContactsPermission();
  }, []);

  // console.log("datacat", DataCategory);

  const handlePhoneSelected = (item: Contacts.Contact) => {
    if (item.phoneNumbers) {
      setSelectedPhone(item.phoneNumbers[0].number);
    }
    closeContactsModal();
  };
  const handlePhoneOnChange = (text: string) => {
    if (text.length == 11) {
      setPhoneError(false);
      setSelectedPhone(text);
    }
  };
  const renderContactItem = ({ item }: { item: Contacts.Contact }) => {
    return (
      <TouchableOpacity
        onPress={() => handlePhoneSelected(item)}
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderColor: "#e6e6e6",
        }}
      >
        <Text className="font-popp font-[500] text-sm">
          {item.firstName ||
            "" + "" + item.middleName ||
            "" + "" + item.lastName ||
            ""}
        </Text>
        {item.phoneNumbers && item.phoneNumbers?.length > 0 && (
          <Text>{item.phoneNumbers[0].number}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const showhotdatamodal = () => {
    hotdataRef.current?.expand();
  };
  const shownormaldatamodal = () => {
    normaldataRef.current?.expand();
  };

  const showmodal = () => {
    bottomsheetRef.current?.expand();
  };
  const showcontactsmodal = () => {
    contactsRef.current?.expand();
  };
  const closeContactsModal = () => {
    contactsRef.current?.close();
  };
  const handleDataCategory = (item: any) => {
    bottomsheetRef.current?.close();
    setDataCategory(item);
  };

  const buyNormalData = async () => {
    if (selectedPhone == undefined || selectedPhone == null) {
      Toast.show({
        type: "info",
        text1: "Attention!!!",
        text2: "Input A Phone Number",
      });
      return;
    }
    if (DataCategory !== null) {
      if (DataCategory.id == undefined || DataCategory.id == null) {
        Toast.show({
          type: "info",
          text1: "Attention!!!",
          text2: "Choose A Data Category",
        });
        return;
      }
    }
    const dataDetails: PurchaseDataDTO = {
      accountNumber: userAccount?.accountNumber,
      amount: Number(normalDataDetails.amount),
      bundleCode: normalDataDetails.bundleCode,
      phoneNumber: selectedPhone,
      serviceCategoryId: DataCategory?.id,
    };
    console.log(dataDetails);
    setPurchaseLoading(true);
    try {
      const res = await billpaymentService.purchaseData(dataDetails);
      console.log(res.result);
      if (res.result) {
        toggleModal();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status == 403 &&
          error.response.data.message == "User hasn't completed KYC"
        ) {
          Toast.show({
            type: "info",
            text1: "Attention!!!",
            text2: "You Haven't Completed Your KYC",
          });
        }
        console.log(error.message);
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      }
    } finally {
      setPurchaseLoading(false);
    }
  };
  const buyHotData = async () => {
    if (selectedPhone == undefined || selectedPhone == null) {
      Toast.show({
        type: "info",
        text1: "Attention!!!",
        text2: "Input A Phone Number",
      });
      return;
    }
    if (DataCategory !== null) {
      if (DataCategory.id == undefined || DataCategory.id == null) {
        Toast.show({
          type: "info",
          text1: "Attention!!!",
          text2: "Choose A Data Category",
        });
        return;
      }
    }
    const dataDetails: PurchaseVtuDataDTO = {
      accountNumber: userAccount?.accountNumber,
      amount: hotDataDetails.amount,
      dataPlan: normalDataDetails.bundleCode,
      phone: selectedPhone,
      network: DataCategory?.name,
    };
    console.log(dataDetails);
    setPurchaseLoading(true);
    try {
      const res = await billpaymentService.PurchaseVTUData(dataDetails);
      console.log(res.result);
      if (res.result) {
        toggleModal();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status == 403 &&
          error.response.data.message == "User hasn't completed KYC"
        ) {
          Toast.show({
            type: "info",
            text1: "Attention!!!",
            text2: "You Haven't Completed Your KYC",
          });
        }
        console.log(error.message);
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      }
    } finally {
      setPurchaseLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
        <Toast />
        <DynamicHeader title="Data" />
        <View
          style={[
            globalstyles.rowview,
            { justifyContent: "space-between", marginVertical: 20 },
          ]}
        >
          <View style={[globalstyles.rowview, { gap: 15 }]}>
            <TouchableOpacity
              key={DataCategory && DataCategory.id}
              style={[globalstyles.rowview, { gap: 4 }]}
              onPress={() => showmodal()}
            >
              <Image
                source={{ uri: DataCategory && DataCategory.logoUrl }}
                style={{ height: 40, width: 40, objectFit: "cover" }}
                className="rounded-full "
              />
              <FontAwesome6 name="caret-up" size={18} color={Colors.primary} />
            </TouchableOpacity>
            <TextInput
              keyboardType="numeric"
              placeholderTextColor={"black"}
              placeholder={selectedPhone || "Recipient Phone"}
              className="font-[700] text-[14px] font-popp  w-[200px]"
              onChangeText={(text) => handlePhoneOnChange(text)}
              value={selectedPhone}
              maxLength={11}
            />
          </View>
          <FontAwesome
            onPress={showcontactsmodal}
            name="user-circle"
            size={24}
            color={Colors.primary}
          />
        </View>
        {/* Error detail */}
        {phoneError && (
          <View style={{ gap: 8, marginBottom: 5 }}>
            <View className="bg-red-300 w-full h-[1px]"></View>
            <Text className="text-red-400 text-[12px]">
              please enter the correct phone number
            </Text>
          </View>
        )}
        <DataTopUPWidget
          phone={selectedPhone}
          setPhoneError={setPhoneError}
          setNormalDataDetails={setNormalDataDetails}
          setHotDataDetails={setHotDataDetails}
          shownormaldatamodal={shownormaldatamodal}
          showhotdatamodal={showhotdatamodal}
          name={DataCategory?.name}
          category={DataCategory?.id}
        />
        {/* network options sheet */}
        <BottomSheet
          backdropComponent={renderBackdrop}
          index={-1}
          ref={bottomsheetRef}
          snapPoints={snapPoints}
        >
          <BottomSheetView
            style={{ maxHeight: ScreenDimensions.screenHeight * 0.7 }}
          >
            <View className="px-5 pt-9 justify-center h-full">
              {!isLoading &&
                dataCategories.map((item: any, index: any) => (
                  <TouchableOpacity
                    className="flex flex-row items-center justify-between mb-5 p-3 rounded-lg bg-[#d5d8e5]"
                    key={item.id}
                    onPress={() => handleDataCategory(item)}
                  >
                    <View className="flex flex-row items-center gap-3">
                      <Image
                        source={{ uri: item.logoUrl }}
                        style={{ height: 40, width: 40, objectFit: "cover" }}
                        className="rounded-full "
                      />
                      <Text>{item.name}</Text>
                    </View>

                    <MaterialCommunityIcons
                      name={
                        DataCategory && DataCategory.name == item.name
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

        {/* contacts sheet */}
        <BottomSheet
          backdropComponent={renderBackdrop}
          index={-1}
          ref={contactsRef}
          snapPoints={snapPoints}
        >
          <BottomSheetView
            style={{ maxHeight: ScreenDimensions.screenHeight * 0.8 }}
          >
            <View style={{ padding: 20 }}>
              <Text className="text-center text-appblue mb-4 text-lg">
                Contacts
              </Text>

              <FlatList data={contacts} renderItem={renderContactItem} />
            </View>
          </BottomSheetView>
        </BottomSheet>

        {/* hot data sheet */}
        <BottomSheet
          backdropComponent={renderBackdrop}
          index={-1}
          ref={hotdataRef}
          snapPoints={["45%"]}
        >
          <BottomSheetView
            style={{ maxHeight: ScreenDimensions.screenHeight * 0.6 }}
          >
            <DataTopUpDetailswidget
              purchaseLoading={purchaseLoading}
              buydata={buyHotData}
              amount={hotDataDetails.amount}
              logoUrl={DataCategory?.logoUrl}
              productName={DataCategory?.name}
            />
          </BottomSheetView>
        </BottomSheet>
        {/* normal data sheet */}
        <BottomSheet
          backdropComponent={renderBackdrop}
          index={-1}
          ref={normaldataRef}
          snapPoints={["45%"]}
        >
          <BottomSheetView
            style={{ maxHeight: ScreenDimensions.screenHeight * 0.6 }}
          >
            <DataTopUpDetailswidget
              purchaseLoading={purchaseLoading}
              buydata={buyNormalData}
              amount={normalDataDetails.amount}
              logoUrl={DataCategory?.logoUrl}
              productName={DataCategory?.name}
            />
          </BottomSheetView>
        </BottomSheet>
        <Modal
          style={{ margin: 0 }}
          onBackdropPress={toggleModal}
          swipeDirection={["down"]}
          onSwipeComplete={toggleModal}
          propagateSwipe={true}
          isVisible={successModal}
        >
          <SuccessPayment amount={amount} />
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default buydata;

const styles = StyleSheet.create({});
