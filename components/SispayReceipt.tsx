import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { dateFormatter } from "@/utils/formatters";

type Props = {};

const SispayReceipt = ({
  transaction,
  transactionType,
}: {
  transaction: any;
  transactionType: any;
}) => (
  <View style={styles.receiptContainer}>
    {/* Watermark logo */}
    <Image
      source={require("@/assets/images/sispaylogo2.png")}
      style={styles.watermarkLogo}
      resizeMode="contain"
    />
    {/* Header */}
    <View style={styles.header}>
      <Image
        source={require("@/assets/images/sispaylogo2.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Sispay Receipt</Text>
    </View>
    {/* Details */}
    <View style={styles.details}>
      <Text style={styles.label}>Amount</Text>
      <Text style={styles.value}>₦{transaction[transactionType].amount}</Text>
      <Text style={styles.label}>Recipient</Text>
      <Text style={styles.value}>
        {transaction[transactionType].receiver?.number}
      </Text>
      <Text style={styles.label}>Reference</Text>
      <Text style={styles.value}>{transaction[transactionType].reference}</Text>
      <Text style={styles.label}>Date</Text>
      <Text style={styles.value}>
        {dateFormatter(transaction[transactionType].transactionDate)}
      </Text>
      <Text style={styles.label}>Status</Text>
      <Text style={styles.value}>{transaction[transactionType].status}</Text>
    </View>
    {/* Footer */}
    <View style={styles.footer}>
      <Text style={styles.footerText}>Thank you for using Sispay!</Text>
    </View>
  </View>
);

export default SispayReceipt;

const styles = StyleSheet.create({
  receiptContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
    position: "relative",
  },
  watermarkLogo: {
    position: "absolute",
    top: "35%",
    left: "25%",
    width: 150,
    height: 150,
    opacity: 0.08,
    zIndex: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    zIndex: 1,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20", // Sispay green
  },
  details: {
    marginVertical: 8,
    zIndex: 1,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
    zIndex: 1,
  },
  footerText: {
    fontSize: 14,
    color: "#1B5E20",
    fontWeight: "500",
  },
});
