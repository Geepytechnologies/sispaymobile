import React from "react";
import { Redirect } from "expo-router";

type Props = {};

const index = (props: Props) => {
  return <Redirect href={"/billpayment/buydata"} />;
};

export default index;
