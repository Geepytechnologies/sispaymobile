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
