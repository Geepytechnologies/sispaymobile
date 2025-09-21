import { useState, useCallback } from "react";
import { Alert } from "react-native";
import authService from "@/services/auth.service";
import transactionSecurityService from "@/services/transactionSecurity.service";
import { useUserStore } from "@/config/store";
import { IUserResponse } from "@/interfaces/responses/user.interface";

interface UseTransactionSecurityReturn {
  // PIN Management
  hasPin: boolean;
  isPinLocked: boolean;
  attemptsRemaining: number;

  // PIN Operations
  createPin: (pin: string) => Promise<boolean>;
  validatePin: (pin: string) => Promise<boolean>;
  requirePinForTransaction: (
    transactionType: string,
    amount?: number
  ) => Promise<boolean>;

  // UI State
  showPinModal: boolean;
  setShowPinModal: (show: boolean) => void;
  showCreatePinModal: boolean;
  setShowCreatePinModal: (show: boolean) => void;

  // Handlers
  handlePinSuccess: (pin: string) => void;
  handlePinError: (error: string) => void;
  handleCreatePinSuccess: (pin: string) => void;
  handleCreatePinError: (error: string) => void;

  // Transaction Flow
  initiateTransaction: (
    transactionType: string,
    amount?: number,
    onSuccess?: () => void
  ) => void;
}

export const useTransactionSecurity = (): UseTransactionSecurityReturn => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [showCreatePinModal, setShowCreatePinModal] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [isPinLocked, setIsPinLocked] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

  // Check PIN status
  const checkPinStatus = useCallback(async () => {
    try {
      // Get user from store instead of API call
      const { user } = useUserStore.getState();
      if (!user) return;

      const status = await transactionSecurityService.getUserPinStatus(
        user.userId
      );
      setHasPin(status.hasPin);
      setIsPinLocked(status.isLocked);
      setAttemptsRemaining(status.attemptsRemaining);
    } catch (error) {
      console.error("Failed to check PIN status:", error);
    }
  }, []);

  // Create PIN
  const createPin = useCallback(
    async (pin: string): Promise<boolean> => {
      try {
        // Get user from store instead of API call
        const { user } = useUserStore.getState();
        if (!user) {
          Alert.alert("Error", "User not found. Please log in again.");
          return false;
        }

        const success = await transactionSecurityService.setUserPin(
          user.userId,
          pin
        );
        if (success) {
          await checkPinStatus();
          Alert.alert("Success", "PIN created successfully!");
          return true;
        } else {
          Alert.alert("Error", "Failed to create PIN. Please try again.");
          return false;
        }
      } catch (error) {
        console.error("Create PIN error:", error);
        Alert.alert("Error", "An error occurred while creating PIN.");
        return false;
      }
    },
    [checkPinStatus]
  );

  // Validate PIN
  const validatePin = useCallback(
    async (pin: string): Promise<boolean> => {
      try {
        // Get user from store instead of API call
        const { user } = useUserStore.getState();
        if (!user) {
          Alert.alert("Error", "User not found. Please log in again.");
          return false;
        }

        const result = await transactionSecurityService.validatePin(
          user.userId,
          pin
        );

        if (result.success) {
          await checkPinStatus();
          return true;
        } else {
          if (result.requiresPinCreation) {
            Alert.alert(
              "PIN Required",
              result.message || "Please create a PIN to continue.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Create PIN",
                  onPress: () => setShowCreatePinModal(true),
                },
              ]
            );
          } else {
            Alert.alert("Invalid PIN", result.message || "Please try again.");
          }
          await checkPinStatus();
          return false;
        }
      } catch (error) {
        console.error("Validate PIN error:", error);
        Alert.alert("Error", "An error occurred during PIN validation.");
        return false;
      }
    },
    [checkPinStatus]
  );

  // Require PIN for transaction
  const requirePinForTransaction = useCallback(
    async (transactionType: string, amount?: number): Promise<boolean> => {
      try {
        // Get user from store instead of API call
        const { user } = useUserStore.getState();
        if (!user) {
          Alert.alert("Error", "User not found. Please log in again.");
          return false;
        }

        const result =
          await transactionSecurityService.requirePinForTransaction(
            user.userId,
            transactionType,
            amount
          );

        if (result.success) {
          return true;
        } else {
          if (result.requiresPinCreation) {
            Alert.alert(
              "PIN Required",
              result.message || "Please create a PIN to make transactions.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Create PIN",
                  onPress: () => setShowCreatePinModal(true),
                },
              ]
            );
          } else {
            Alert.alert(
              "Transaction Blocked",
              result.message || "Cannot proceed with transaction."
            );
          }
          return false;
        }
      } catch (error) {
        console.error("Transaction security check error:", error);
        Alert.alert("Error", "An error occurred during security check.");
        return false;
      }
    },
    []
  );

  // PIN Success Handler
  const handlePinSuccess = useCallback((pin: string) => {
    setShowPinModal(false);
    // PIN validation will be handled by the calling component
  }, []);

  // PIN Error Handler
  const handlePinError = useCallback(
    (error: string) => {
      Alert.alert("PIN Error", error);
      checkPinStatus();
    },
    [checkPinStatus]
  );

  // Create PIN Success Handler
  const handleCreatePinSuccess = useCallback(
    async (pin: string) => {
      const success = await createPin(pin);
      if (success) {
        setShowCreatePinModal(false);
      }
    },
    [createPin]
  );

  // Create PIN Error Handler
  const handleCreatePinError = useCallback((error: string) => {
    Alert.alert("Create PIN Error", error);
  }, []);

  // Initiate Transaction Flow
  const initiateTransaction = useCallback(
    (transactionType: string, amount?: number, onSuccess?: () => void) => {
      const startTransaction = async () => {
        const canProceed = await requirePinForTransaction(
          transactionType,
          amount
        );
        if (canProceed) {
          if (hasPin) {
            setShowPinModal(true);
          } else {
            setShowCreatePinModal(true);
          }
        }
      };

      startTransaction();
    },
    [requirePinForTransaction, hasPin]
  );

  return {
    // PIN Status
    hasPin,
    isPinLocked,
    attemptsRemaining,

    // PIN Operations
    createPin,
    validatePin,
    requirePinForTransaction,

    // UI State
    showPinModal,
    setShowPinModal,
    showCreatePinModal,
    setShowCreatePinModal,

    // Handlers
    handlePinSuccess,
    handlePinError,
    handleCreatePinSuccess,
    handleCreatePinError,

    // Transaction Flow
    initiateTransaction,
  };
};

export default useTransactionSecurity;
