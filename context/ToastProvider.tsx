import { StyleSheet, Text, View } from "react-native";
import React, { Children } from "react";
import Toast from "react-native-toast-message";

type Props = {
  children: React.ReactNode;
};

const ToastProvider = ({ children }: Props) => {
  return (
    <>
      {children}
      <Toast />
    </>
  );
};

export default ToastProvider;

const styles = StyleSheet.create({});
