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
import { PurchaseAirtimeDTO } from "@/types/billpayment";
import SuccessPayment from "@/components/billpayment/SuccessPayment";
import axios from "axios";
import Toast from "react-native-toast-message";
type Props = {};

const Airtime = (props: Props) => {
  const { currentuser } = useSelector((state: RootState) => state.user);
  const { userAccount } = useSelector((state: RootState) => state.account);
  // const { contacts, getContacts } = useContacts();
  const snapPoints = ["40%"];
  const [isModalVisible, setModalVisible] = useState(false);
  const [isContactsModalVisible, setIsContactsModalVisible] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState(currentuser?.phoneNumber);
  const [successModal, setSuccessModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  interface AirtimeCategory {
    id: string;
    name: string;
    logoUrl: any;
  }
  const toggleModal = () => {
    setSuccessModal(!successModal);
  };
  const {
    isLoading,
    data: airtimeCategories,
    error,
    refetch,
  } = useQuery({
    queryKey: ["airtimecategories"],
    queryFn: billpaymentService.getAirtimeServiceCategory,
  });
  const [airtimeCategory, setAirtimeCategory] =
    useState<AirtimeCategory | null>(null);

  useEffect(() => {
    if (airtimeCategories && airtimeCategories.length > 0) {
      setAirtimeCategory(airtimeCategories[0]);
    }
  }, [airtimeCategories]);
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

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

  const handlePhoneSelected = (item: Contacts.Contact) => {
    if (item.phoneNumbers) {
      setSelectedPhone(item.phoneNumbers[0].number);
    }
    closeContactsModal();
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
  const bottomsheetRef = useRef<BottomSheet>(null);
  const contactsRef = useRef<BottomSheet>(null);

  const showmodal = () => {
    bottomsheetRef.current?.expand();
  };
  const showcontactsmodal = () => {
    contactsRef.current?.expand();
  };
  const closeContactsModal = () => {
    contactsRef.current?.close();
  };
  const handleAirtimeCategory = (item: any) => {
    bottomsheetRef.current?.close();
    setAirtimeCategory(item);
  };
  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.7} // You can customize the opacity here
    />
  );
  const buyAirtime = async () => {
    if (selectedPhone == undefined || selectedPhone == null) {
      return;
    }
    if (airtimeCategory !== null) {
      if (airtimeCategory.id == undefined || airtimeCategory.id == null) {
        return;
      }
    }
    const airtimeDetails: PurchaseAirtimeDTO = {
      accountNumber: userAccount?.accountNumber,
      amount: Number(amount),
      phoneNumber: selectedPhone,
      serviceCategoryId: airtimeCategory?.id,
    };
    console.log(airtimeDetails);
    setPurchaseLoading(true);
    try {
      const res = await billpaymentService.purchaseAirtime(airtimeDetails);
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
        <DynamicHeader title="Airtime" />
        <View
          style={[
            globalstyles.rowview,
            { justifyContent: "space-between", marginVertical: 20 },
          ]}
        >
          <View style={[globalstyles.rowview, { gap: 15 }]}>
            <TouchableOpacity
              key={airtimeCategory && airtimeCategory.id}
              style={[globalstyles.rowview, { gap: 4 }]}
              onPress={showmodal}
            >
              <Image
                source={{ uri: airtimeCategory && airtimeCategory.logoUrl }}
                style={{ height: 40, width: 40, objectFit: "cover" }}
                className="rounded-full "
              />
              <FontAwesome6 name="caret-up" size={18} color={Colors.primary} />
            </TouchableOpacity>
            <TextInput
              keyboardType="numeric"
              placeholderTextColor={"black"}
              placeholder={selectedPhone || "Recipient Phone"}
              className="font-[700] text-[20px] font-popp  w-[200px]"
              onChangeText={(text) => setSelectedPhone(text)}
              value={selectedPhone}
            />
          </View>
          <FontAwesome
            onPress={showcontactsmodal}
            name="user-circle"
            size={24}
            color={Colors.primary}
          />
        </View>
        <AirtimeTopUpwidget
          loading={purchaseLoading}
          purchaseAirtime={buyAirtime}
          amount={amount}
          setAmount={setAmount}
        />
        {/* network options sheet */}
        <BottomSheet
          backdropComponent={renderBackdrop}
          index={-1}
          ref={bottomsheetRef}
          snapPoints={["45%"]}
        >
          <BottomSheetView style={{ paddingTop: 20 }}>
            <View className="px-5 pt-9 justify-center h-full">
              {!isLoading &&
                airtimeCategories.map((item: any, index: any) => (
                  <TouchableOpacity
                    className="flex flex-row items-center justify-between mb-5 p-3 rounded-lg bg-[#d5d8e5]"
                    key={item.id}
                    onPress={() => handleAirtimeCategory(item)}
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
                        airtimeCategory && airtimeCategory.name == item.name
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

export default Airtime;

const styles = StyleSheet.create({});
