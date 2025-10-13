import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DynamicHeader from "@/components/DynamicHeader";
import { useLocalSearchParams } from "expo-router";
import { useTransactionById } from "@/queries/wallet";
import { globalstyles } from "@/styles/common";
import { dateFormatter } from "@/utils/formatters";
import ViewShot from "react-native-view-shot";
// import Share from "react-native-share";
import SispayReceipt from "@/components/SispayReceipt";
type Props = {};
const transactionDetail = (props: Props) => {
  const { id } = useLocalSearchParams();
  const { isLoading, data: userTransaction } = useTransactionById(id);
  let transactionType;
  if (!isLoading) {
    const word = userTransaction[0].transactionType;
    transactionType = word.charAt(0).toLowerCase() + word.slice(1);
  }

  const viewShotRef = useRef<ViewShot>(null);

  const handleShareReceipt = async () => {
    try {
      if (
        viewShotRef.current &&
        typeof viewShotRef.current.capture === "function"
      ) {
        const uri = await viewShotRef.current.capture();
        //await Share.open({ url: uri });
      } else {
        console.log("ViewShot ref or capture method is not available.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <DynamicHeader title="Transaction Detail" />
      {!isLoading && (
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.9 }}>
          <SispayReceipt
            transaction={userTransaction[0]}
            transactionType={transactionType}
          />
        </ViewShot>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.reportBtn}>
          <Text style={styles.reportText}>Report An Issue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShareReceipt}>
          <Text style={styles.shareText}>Share Receipt</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default transactionDetail;

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: "auto",
  },
  reportBtn: {
    borderColor: "#1B5E20",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    flex: 1,
    marginRight: 5,
  },
  reportText: {
    color: "#1B5E20",
    textAlign: "center",
    fontWeight: "600",
  },
  shareBtn: {
    backgroundColor: "#1B5E20",
    borderRadius: 20,
    paddingVertical: 16,
    flex: 1,
    marginLeft: 5,
  },
  shareText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
