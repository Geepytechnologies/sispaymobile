import {
  ActivityIndicator,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import DynamicHeader from "@/components/DynamicHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import walletService from "@/services/wallet.service";
import { globalstyles } from "@/styles/common";
import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
  Zocial,
} from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { TransferDTO } from "@/types/AccountDTO";
import { useUserStore } from "@/config/store";
import Toast from "react-native-toast-message";
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";
import { useBankLists } from "@/queries/wallet";
import BottomSheet from "@gorhom/bottom-sheet";
import InputPinSheet from "@/components/bottomsheets/InputPinSheet";
import SetPinSheet from "@/components/bottomsheets/SetPinSheet";
import { router } from "expo-router";

type Props = {};

const ToBankAccount = (props: Props) => {
  const { userAccount } = useUserStore();
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState<string>();
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [transferNarration, setTransferNarration] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [accountFetching, setAccountFetching] = useState(true);
  const [transferLoading, setTransferLoading] = useState(false);
  const [bankCode, setBankCode] = useState<any>();
  const [isFocus, setIsFocus] = useState(false);
  const [nameEnquiryError, setNameEnquiryError] = useState(false);
  const [userAccountDetails, setUserAccountDetails] = useState({
    accountName: "",
    accountNumber: "",
    sessionId: "",
    bankCode: "",
  });
  const inputPinRef = useRef<BottomSheet>(null);
  const setPinRef = useRef<BottomSheet>(null);
  const [pinValidationError, setPinValidationError] = useState(false);
  const openPinModal = () => {
    if (Number(amount) > userAccount?.balance!) {
      Toast.show({
        type: "info",
        text1: "Insufficient Balance",
        text2: "Please top up to complete this transaction",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }
    if (userAccount?.accountPinSet) {
      inputPinRef.current?.expand();
    } else {
      setPinRef.current?.expand();
    }
  };
  const handleAmount = (text: string) => {
    if (text === "") {
      setAmount("");
      return;
    }

    const numericValue = parseInt(text.replace(/,/g, ""), 10);

    if (!isNaN(numericValue)) {
      const formatted = numericValue.toLocaleString();
      setAmount(formatted);
    }
  };

  const fetchAcountdetails = async (account: string) => {
    setAccountFetching(true);
    try {
      const res = await walletService.NameEnquiry(bankCode, account);
      setUserAccountDetails({
        accountName: res.result.accountName,
        accountNumber: res.result.accountNumber,
        sessionId: res.result.sessionId,
        bankCode: bankCode,
      });
    } catch (error) {
      setNameEnquiryError(true);

      if (axios.isAxiosError(error)) {
        if (error.response?.status == 400) {
          Toast.show({
            type: "error",
            text1: "Attention!!!",
            text2: error.response.data.message,
          });
        } else if (
          error.response?.status == 403 &&
          error.response.data.message == "User hasn't completed KYC"
        ) {
          Toast.show({
            type: "info",
            text1: "Attention!!!",
            text2: "You Haven't Completed Your KYC",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Attention!!!",
            text2: error.response?.data.Message || "Something went wrong",
          });
        }
      }
    } finally {
      setAccountFetching(false);
    }
  };
  const handleAccountNumber = (text: string) => {
    setAccountNumber(text);
    setNameEnquiryError(false);
    setUserAccountDetails((prev) => ({ ...prev, accountName: "" }));
    if (text.length == 10) {
      setDisabled(true);
      fetchAcountdetails(text);
    }
  };

  const handleTransfer = async (pin: string) => {
    const transferData: TransferDTO = {
      saveBeneficiary: saveBeneficiary,
      nameEnquiryReference: userAccountDetails.sessionId,
      debitAccountNumber: userAccount?.accountNumber,
      amount: amount && parseInt(amount),
      beneficiaryAccountNumber: userAccountDetails.accountNumber,
      beneficiaryBankCode: userAccountDetails.bankCode,
      narration: transferNarration,
      accountPin: pin,
    };
    setTransferLoading(true);
    try {
      const res = await walletService.MakeTransfer(transferData);
      if (res.statusCode == 200) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Transfer Successful",
        });
        router.push("/(tabs)/transactions");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == 400) {
          Toast.show({
            type: "error",
            text1: "Alert",
            text2: error.response.data.message,
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Attention!!!",
            text2: error.response?.data.Message || "Something went wrong",
          });
        }
      }
    } finally {
      setTransferLoading(false);
    }
  };
  const handlePay = (pin: string) => {
    handleTransfer(pin);
  };
  const { isLoading, data: banklists } = useBankLists();
  const data =
    !isLoading &&
    banklists.map((item: any) => ({
      label: item.name,
      value: item.bankCode,
    }));
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
        <DynamicHeader title="Transfer To Bank Account" />
        <View
          style={{ gap: 5 }}
          className="shadow-sm rounded-lg bg-white p-4 my-9"
        >
          {/* dropdown */}
          <View style={{ gap: 4 }} className="my-4">
            <Text className="font-[500]">Recipient Bank</Text>
            {!isLoading && (
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
                placeholder={!isFocus ? "Select bank" : "..."}
                searchPlaceholder="Search..."
                value={bankCode}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setBankCode(item.value);
                  setIsFocus(false);
                }}
                renderLeftIcon={() => (
                  <MaterialCommunityIcons
                    style={styles.icon}
                    name="greenhouse"
                    size={20}
                    color={isFocus ? Colors.primary : "black"}
                  />
                )}
              />
            )}
          </View>
          <Text className="font-[500]">Recipient Account</Text>
          <TextInput
            // editable={!disabled}
            style={[
              disabled && { borderColor: "#22c55e", borderWidth: 1 },
              nameEnquiryError && { borderColor: "red", borderWidth: 1 },
            ]}
            maxLength={10}
            value={accountNumber}
            onChangeText={(text) => handleAccountNumber(text)}
            placeholder="Account No."
            className="bg-gray-100 rounded-md p-3"
          />
          {!accountFetching && userAccountDetails.accountName && (
            <View style={[globalstyles.rowview, { gap: 10, marginTop: 20 }]}>
              <View
                style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
                className="flex items-center justify-center rounded-full h-[40px] w-[40px] 
            "
              >
                <MaterialCommunityIcons
                  name="greenhouse"
                  size={24}
                  color={Colors.primary}
                />
              </View>
              <View className="max-w-[250px]">
                <Text
                  numberOfLines={2}
                  ellipsizeMode="clip"
                  style={{ flexShrink: 1 }}
                  className="font-[500] text-base"
                >
                  {userAccountDetails.accountName}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {userAccountDetails.accountNumber}
                </Text>
              </View>
            </View>
          )}
          {/* amount */}
          <View style={{ gap: 4 }} className="my-5">
            <Text className="font-[500]">Amount</Text>

            <TextInput
              // maxLength={10}
              value={amount}
              onChangeText={(text) => handleAmount(text)}
              placeholder="Amount"
              keyboardType="numeric"
              className="bg-gray-100 rounded-md p-3"
            />
          </View>
          {/* narration */}
          <View style={{ gap: 4 }} className="my-5">
            <Text className="font-[500]">Narration</Text>

            <TextInput
              value={transferNarration}
              onChangeText={(text) => setTransferNarration(text)}
              placeholder="Narration"
              keyboardType="default"
              className="bg-gray-100 rounded-md p-3"
            />
          </View>
          {/* beneficiary */}
          <View style={[globalstyles.rowview, { gap: 10, marginVertical: 10 }]}>
            <Text className=" font-[500]">Save Beneficiary</Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setSaveBeneficiary(!saveBeneficiary)}
            >
              {saveBeneficiary && (
                <FontAwesome6
                  name="toggle-on"
                  size={24}
                  color={Colors.primary}
                />
              )}
              {!saveBeneficiary && (
                <FontAwesome6
                  name="toggle-off"
                  size={24}
                  color={Colors.primary}
                />
              )}
            </TouchableOpacity>
          </View>
          {/* submit */}
          <TouchableOpacity
            onPress={() => openPinModal()}
            activeOpacity={0.8}
            disabled={transferLoading}
            className="bg-appblue text-gray-400 rounded-lg py-4"
          >
            {!transferLoading ? (
              <Text className="text-white font-popp text-lg text-center font-[600]">
                Transfer
              </Text>
            ) : (
              <ActivityIndicator size={"small"} className="" />
            )}
          </TouchableOpacity>
        </View>
        {/* input pin sheet */}
        <InputPinSheet
          ref={inputPinRef}
          isError={pinValidationError}
          setIsError={setPinValidationError}
          validatePin={handlePay}
          validatingPin={transferLoading}
        />
        {/* set pin sheet */}
        <SetPinSheet
          ref={setPinRef}
          paymentAction={handlePay}
          processing={transferLoading}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ToBankAccount;

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
