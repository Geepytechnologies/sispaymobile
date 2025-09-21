import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import SecureKeypadModal from "../SecureKeypad/SecureKeypadModal";
import useTransactionSecurity from "@/hooks/useTransactionSecurity";

interface TransactionWithPinProps {
  transactionType: string;
  amount?: number;
  onTransactionSuccess: () => void;
  onTransactionError?: (error: string) => void;
  children: React.ReactNode; // The transaction form/button
}

const TransactionWithPin: React.FC<TransactionWithPinProps> = ({
  transactionType,
  amount,
  onTransactionSuccess,
  onTransactionError,
  children,
}) => {
  const {
    hasPin,
    showPinModal,
    setShowPinModal,
    showCreatePinModal,
    setShowCreatePinModal,
    handlePinSuccess,
    handlePinError,
    handleCreatePinSuccess,
    handleCreatePinError,
    validatePin,
    createPin,
  } = useTransactionSecurity();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleTransactionInitiation = async () => {
    if (!hasPin) {
      setShowCreatePinModal(true);
      return;
    }

    setShowPinModal(true);
  };

  const handlePinValidation = async (pin: string) => {
    setIsProcessing(true);
    try {
      const isValid = await validatePin(pin);
      if (isValid) {
        setShowPinModal(false);
        onTransactionSuccess();
      }
    } catch (error) {
      onTransactionError?.(
        error instanceof Error ? error.message : "Transaction failed"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePinCreation = async (pin: string) => {
    setIsProcessing(true);
    try {
      const success = await createPin(pin);
      if (success) {
        setShowCreatePinModal(false);
        // After creating PIN, proceed with transaction
        setShowPinModal(true);
      }
    } catch (error) {
      onTransactionError?.(
        error instanceof Error ? error.message : "Failed to create PIN"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Render the transaction form/button */}
      <TouchableOpacity
        onPress={handleTransactionInitiation}
        disabled={isProcessing}
        style={[
          styles.transactionButton,
          isProcessing && styles.disabledButton,
        ]}
      >
        {children}
      </TouchableOpacity>

      {/* PIN Verification Modal */}
      <SecureKeypadModal
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinValidation}
        onError={handlePinError}
        title="Enter PIN"
        subtitle={`Enter your PIN to ${transactionType.toLowerCase()}`}
        maxLength={4}
      />

      {/* PIN Creation Modal */}
      <SecureKeypadModal
        visible={showCreatePinModal}
        onClose={() => setShowCreatePinModal(false)}
        onSuccess={handlePinCreation}
        onError={handleCreatePinError}
        title="Create PIN"
        subtitle="Create a 4-digit PIN for secure transactions"
        maxLength={4}
        requireConfirmation={true}
        isCreatingPin={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transactionButton: {
    // Style your transaction button here
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default TransactionWithPin;
