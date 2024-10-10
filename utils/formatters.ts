export const formatPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.startsWith("0")) {
    return "234" + phoneNumber.slice(1);
  }
  return phoneNumber;
};
