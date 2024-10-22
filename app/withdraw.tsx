import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalstyles } from "@/styles/common";
import PrimaryButton from "@/components/common/PrimaryButton";
import CardReader from "@/assets/images/cardreader.svg";
import DynamicHeader from "@/components/DynamicHeader";
import Backbutton from "@/components/buttons/Backbutton";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

const withdraw = (props: Props) => {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: "white", padding: 20 }]}>
      <Backbutton />
      <View style={[globalstyles.centerview, { flex: 1 }]}>
        <View style={[{ gap: 10, justifyContent: "center" }]}>
          <Text className="text-[25px] font-[700] font-popp leading-[40px] text-center self-center text-[#121212] max-w-[200px]">
            Please Insert Card
          </Text>
          <CardReader />
          <PrimaryButton text="Continue" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default withdraw;

const styles = StyleSheet.create({});
