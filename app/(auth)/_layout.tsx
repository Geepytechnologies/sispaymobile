import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="Register" options={{ headerShown: false }} />
      <Stack.Screen name="Kyc" options={{ headerShown: false }} />
      <Stack.Screen name="KycOtp" options={{ headerShown: false }} />
      <Stack.Screen name="Otp" options={{ headerShown: false }} />
      <Stack.Screen name="TwoFactorOtp" options={{ headerShown: false }} />
    </Stack>
  );
};
export default Layout;
