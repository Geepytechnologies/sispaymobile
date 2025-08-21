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
import React, { useEffect, useState } from "react";
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
  const [userAccountDetails, setUserAccountDetails] = useState({
    accountName: "",
    accountNumber: "",
    sessionId: "",
    bankCode: "",
  });

  const handleAmount = (text: string) => {
    const formattedText = parseInt(text).toLocaleString();
    const numbertext = parseInt(text);
    if (numbertext) {
      setAmount(text);
    }
  };

  const fetchAcountdetails = async (account: string) => {
    setAccountFetching(true);
    try {
      const res = await walletService.SisPayNameEnquiry(account);
      setUserAccountDetails({
        accountName: res.result.accountName,
        accountNumber: res.result.accountNumber,
        sessionId: res.result.sessionId,
        bankCode: bankCode,
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

  const { isLoading, data: banklists } = useBankLists();
  const data =
    !isLoading &&
    banklists.map((item: any) => ({
      label: item.name,
      value: item.bankCode,
    }));
  // console.log(data);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
        <Toast />
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
            editable={!disabled}
            style={[disabled && { borderColor: "#22c55e", borderWidth: 1 }]}
            maxLength={10}
            value={accountNumber}
            onChangeText={(text) => handleAccountNumber(text)}
            placeholder="Account No."
            className="bg-gray-100 rounded-md p-3"
          />
          {!accountFetching && (
            <View style={[globalstyles.rowview, { gap: 10, marginTop: 20 }]}>
              <View
                style={[{ backgroundColor: "rgba(3, 29, 66, 0.2)" }]}
                className="flex items-center justify-center rounded-full h-[50px] w-[50px] 
            "
              >
                <MaterialCommunityIcons
                  name="greenhouse"
                  size={24}
                  color={Colors.primary}
                />
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
