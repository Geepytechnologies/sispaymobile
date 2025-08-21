import moment from "moment";

export const formatDate = (date: Date): string => {
  return moment(date).format("Do [of] MMMM, YYYY");
};

export const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};
