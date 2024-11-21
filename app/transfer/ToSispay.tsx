import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import DynamicHeader from "@/components/DynamicHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import walletService from "@/services/wallet.service";
import { globalstyles } from "@/styles/common";
import { FontAwesome6, Zocial } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { TransferDTO } from "@/types/AccountDTO";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import Toast from "react-native-toast-message";
import axios from "axios";

type Props = {};

const ToSispay = (props: Props) => {
  const { userAccount } = useSelector((state: RootState) => state.account);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState<string>();
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [transferNarration, setTransferNarration] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [accountFetching, setAccountFetching] = useState(true);
  const [transferLoading, setTransferLoading] = useState(false);
  const [userAccountDetails, setUserAccountDetails] = useState({
    accountName: "",
    accountNumber: "",
    sessionId: "",
    bankCode: "",
  });

  const handleAmount = (text: string) => {
    const formattedText = parseInt(text).toLocaleString();
    const numbertext = parseInt(text);
    setAmount(text);
  };

  const fetchAcountdetails = async (account: string) => {
    setAccountFetching(true);
    try {
      const res = await walletService.SisPayNameEnquiry(account);
      setUserAccountDetails({
        accountName: res.result.accountName,
        accountNumber: res.result.accountNumber,
        sessionId: res.result.sessionId,
        bankCode: res.result.bankCode,
      });
      console.log(res.result);
    } catch (error) {
    } finally {
      setAccountFetching(false);
    }
  };
  const handleAccountNumber = (text: string) => {
    setAccountNumber(text);
    if (text.length == 10) {
      setDisabled(true);
      fetchAcountdetails(text);
    }
  };

  const handleTransfer = async () => {
    const transferData: TransferDTO = {
      saveBeneficiary: saveBeneficiary,
      nameEnquiryReference: userAccountDetails.sessionId,
      debitAccountNumber: userAccount?.accountNumber,
      amount: amount && parseInt(amount),
      beneficiaryAccountNumber: userAccountDetails.accountNumber,
      beneficiaryBankCode: userAccountDetails.bankCode,
      narration: transferNarration,
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
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == 400) {
          Toast.show({
            type: "error",
            text1: "Alert",
            text2: error.response.data.message,
          });
        }
      }
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
        <Toast />
        <DynamicHeader title="Transfer To Sispay Account" />
        <View
          style={{ gap: 5 }}
          className="shadow-sm rounded-lg bg-white p-4 my-9"
        >
          <Text className="font-[500]">Recipient Account</Text>
          <TextInput
            // editable={!disabled}
            style={[disabled && { borderColor: "#22c55e", borderWidth: 1 }]}
            maxLength={10}
            keyboardType="numeric"
            value={accountNumber}
            onChangeText={(text) => handleAccountNumber(text)}
            placeholder="SisPay Account No."
            className="bg-gray-100 rounded-md p-3"
          />
          {!accountFetching && (
            <View style={[globalstyles.rowview, { gap: 10, marginTop: 20 }]}>
              <View
                style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
                className="flex items-center justify-center rounded-full h-[50px] w-[50px] 
            "
              >
                <Zocial name="persona" size={24} color={Colors.primary} />
              </View>
              <View>
                <Text className="font-[500] text-base">
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
            onPress={handleTransfer}
            activeOpacity={0.8}
            disabled={transferLoading}
            className="bg-appblue rounded-lg py-4"
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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ToSispay;

const styles = StyleSheet.create({});
