import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface SecureKeypadModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
  onError?: (error: string) => void;
  title?: string;
  subtitle?: string;
  maxLength?: number;
  requireConfirmation?: boolean;
  isCreatingPin?: boolean;
}

const SecureKeypadModal: React.FC<SecureKeypadModalProps> = ({
  visible,
  onClose,
  onSuccess,
  onError,
  title = "Enter PIN",
  subtitle = "Enter your 4-digit PIN to continue",
  maxLength = 4,
  requireConfirmation = false,
  isCreatingPin = false,
}) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  useEffect(() => {
    if (visible) {
      setPin("");
      setConfirmPin("");
      setIsConfirming(false);
      setAttempts(0);
    }
  }, [visible]);

  const handleKeyPress = (key: string) => {
    if (key === "delete") {
      if (isConfirming) {
        setConfirmPin((prev) => prev.slice(0, -1));
      } else {
        setPin((prev) => prev.slice(0, -1));
      }
    } else {
      const currentPin = isConfirming ? confirmPin : pin;
      if (currentPin.length < maxLength) {
        if (isConfirming) {
          setConfirmPin((prev) => prev + key);
        } else {
          setPin((prev) => prev + key);
        }
      }
    }
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePinComplete = () => {
    if (isCreatingPin && requireConfirmation) {
      if (!isConfirming) {
        setIsConfirming(true);
        return;
      } else {
        if (pin === confirmPin) {
          onSuccess(pin);
        } else {
          triggerShake();
          Alert.alert(
            "PIN Mismatch",
            "The PINs you entered do not match. Please try again."
          );
          setPin("");
          setConfirmPin("");
          setIsConfirming(false);
        }
        return;
      }
    }

    // For PIN verification
    if (pin.length === maxLength) {
      onSuccess(pin);
    }
  };

  const handleWrongPin = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    triggerShake();

    if (newAttempts >= maxAttempts) {
      Alert.alert(
        "Too Many Attempts",
        "You have exceeded the maximum number of attempts. Please try again later.",
        [{ text: "OK", onPress: onClose }]
      );
    } else {
      Alert.alert(
        "Incorrect PIN",
        `Incorrect PIN. ${maxAttempts - newAttempts} attempts remaining.`
      );
    }

    setPin("");
    setConfirmPin("");
    setIsConfirming(false);
  };

  const renderInputBoxes = () => {
    const currentPin = isConfirming ? confirmPin : pin;
    const boxes = [];

    for (let i = 0; i < maxLength; i++) {
      boxes.push(
        <View key={i} style={styles.inputBox}>
          <Text style={styles.inputText}>{currentPin[i] ? "•" : ""}</Text>
        </View>
      );
    }
    return boxes;
  };

  const renderKeypad = () => {
    const keys = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      ["", "0", "delete"],
    ];

    return (
      <View style={styles.keypadContainer}>
        {keys.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                onPress={() => key && handleKeyPress(key)}
                disabled={key === ""}
                style={[styles.keyButton, key === "" && styles.emptyKeyButton]}
              >
                {key === "delete" ? (
                  <Ionicons name="backspace-outline" size={24} color="#333" />
                ) : (
                  <Text style={styles.keyText}>{key}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const currentTitle = isConfirming ? "Confirm PIN" : title;
  const currentSubtitle = isConfirming
    ? "Re-enter your PIN to confirm"
    : subtitle;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateX: shakeAnimation }] },
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{currentTitle}</Text>
            <Text style={styles.subtitle}>{currentSubtitle}</Text>

            <View style={styles.inputContainer}>{renderInputBoxes()}</View>

            {renderKeypad()}

            {isCreatingPin && (
              <TouchableOpacity
                style={styles.forgotPinButton}
                onPress={() => {
                  Alert.alert(
                    "Forgot PIN?",
                    "Please contact customer support to reset your PIN.",
                    [{ text: "OK" }]
                  );
                }}
              >
                <Text style={styles.forgotPinText}>Forgot PIN?</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: height * 0.7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  inputBox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    backgroundColor: "#f9f9f9",
  },
  inputText: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
  },
  keypadContainer: {
    width: "100%",
    maxWidth: 300,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  keyButton: {
    width: 70,
    height: 70,
    marginHorizontal: 10,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyKeyButton: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
  keyText: {
    fontSize: 24,
    color: "#333",
    fontWeight: "600",
  },
  forgotPinButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  forgotPinText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default SecureKeypadModal;
