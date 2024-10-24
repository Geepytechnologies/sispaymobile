import React from "react";

type Props = {
  date: Date;
};

const useDateFormatter = ({ date }: Props) => {
  const dateTime = new Date(date);

  const formattedDateTime = dateTime.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return { formattedDateTime };
};

export default useDateFormatter;
