import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TransactionWithPin from "./TransactionWithPin";

interface ExampleTransactionButtonProps {
  amount: number;
  recipient: string;
  onSuccess: () => void;
}

const ExampleTransactionButton: React.FC<ExampleTransactionButtonProps> = ({
  amount,
  recipient,
  onSuccess,
}) => {
  const handleTransactionSuccess = () => {
    // This will be called after PIN validation
    console.log(`Transaction successful: $${amount} to ${recipient}`);
    onSuccess();
  };

  const handleTransactionError = (error: string) => {
    console.error("Transaction failed:", error);
  };

  return (
    <TransactionWithPin
      transactionType="Transfer"
      amount={amount}
      onTransactionSuccess={handleTransactionSuccess}
      onTransactionError={handleTransactionError}
    >
      <View style={styles.buttonContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="arrow-up" size={24} color="#fff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.buttonText}>Send Money</Text>
          <Text style={styles.amountText}>${amount.toLocaleString()}</Text>
          <Text style={styles.recipientText}>To: {recipient}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </View>
      </View>
    </TransactionWithPin>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  amountText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  recipientText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  arrowContainer: {
    marginLeft: 8,
  },
});

export default ExampleTransactionButton;
