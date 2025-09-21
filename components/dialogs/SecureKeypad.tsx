import { ISuccessResponse } from "@/interfaces/general.interface";
import { UseMutateFunction } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Vibration,
} from "react-native";

type Props = {
  pinAction:
    | UseMutateFunction<ISuccessResponse, unknown, string, unknown>
    | any;
  loading: boolean;
  isError: boolean;
  setIsError: (val: boolean) => void;
};

const SecureKeypad = ({ pinAction, loading, isError, setIsError }: Props) => {
  const [pin, setPin] = useState("");
  const maxLength = 4;

  interface HandleKeyPress {
    (key: string): void;
  }

  const handleKeyPress: HandleKeyPress = (key) => {
    if (isError) {
      setIsError(false);
      setPin("");
    }
    if (key === "delete") {
      setPin(pin.slice(0, -1));
    } else if (pin.length < maxLength) {
      setPin(pin + key);
    }
  };
  useEffect(() => {
    if (isError) {
      Vibration.vibrate(200);
      setPin("");
    }
  }, [isError]);
  useEffect(() => {
    if (pin.length === maxLength) {
      pinAction(pin);
      setPin("");
    }
  }, [pin]);

  const renderInputBoxes = () => {
    const boxes = [];
    for (let i = 0; i < maxLength; i++) {
      boxes.push(
        <View
          key={i}
          style={[
            styles.inputBox,
            isError && { borderColor: "red" }, // 🔴 error state
          ]}
        >
          <Text style={[styles.inputText, isError && { color: "red" }]}>
            {pin[i] ? "•" : ""}
          </Text>
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
      ["0", "delete"],
    ];
    return (
      <View style={{ marginTop: 10 }}>
        {keys.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            {row.map((key) => (
              <TouchableOpacity
                activeOpacity={0.9}
                key={key}
                onPress={() => key && handleKeyPress(key)}
                disabled={key === ""}
                style={{
                  width: key == "0" ? 140 : 60,
                  height: 60,
                  marginHorizontal: 10,
                  borderRadius: 30,
                  backgroundColor: key === "" ? "transparent" : "#e6e6e6",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: key === "" ? 0 : 1,
                }}
              >
                <Text style={styles.keyText}>
                  {key === "delete" ? "⌫" : key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        className="relative w-full flex justify-center"
        style={styles.inputContainer}
      >
        {renderInputBoxes()}
        <View className="absolute w-full h-[50px] flex items-center justify-center left-0">
          <ActivityIndicator
            className="opacity-50"
            size="large"
            color="#031D42"
            animating={loading}
          />
        </View>
      </View>
      <View style={styles.keypadContainer}>{renderKeypad()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  inputBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  inputText: {
    fontSize: 24,
    color: "#000",
  },
  keypadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "80%",
  },
  keyText: {
    fontSize: 24,
    color: "#000",
  },
});

export default SecureKeypad;
