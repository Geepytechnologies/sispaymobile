import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";

export const formatPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.startsWith("0")) {
    return "234" + phoneNumber.slice(1);
  }
  return phoneNumber;
};

export const dateFormatter = (date: string) => {
  const dateTime = new Date(date);

  const formattedDateTime = dateTime.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return formattedDateTime;
};

export const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);
  Toast.show({
    type: "success",
    text1: "Copied to clipboard",
  });
};
export function extractDays(validity: string): number | null {
  const match = validity.match(
    /(\d+)\s*(day|days|week|weeks|month|months|year|years)/i
  );
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  const unitToDays: Record<string, number> = {
    day: 1,
    days: 1,
    week: 7,
    weeks: 7,
    month: 30,
    months: 30,
    year: 365,
    years: 365,
  };

  return value * unitToDays[unit];
}
