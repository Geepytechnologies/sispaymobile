export interface IServiceCategory {
  name: string;
  validity: string;
  amount: number;
  bundleCode: string;
  isAmountFixed: boolean;
  planType: string;
}

export interface IServiceCategoryResponse {
  result: IServiceCategory[];
  message: string;
  statusCode: number;
}

export interface IVerifyCableTv {
  status: string;
  name: string;
  customernumber: string;
}

export interface IVerifyCableTvResponse {
  result: IVerifyCableTv;
  message: string;
  statusCode: number;
}

export interface IVerifyPower {
  discoCode: string;
  vendType: string;
  meterNo: string;
  minVendAmount: string;
  maxVendAmount: string;
  outstanding: string;
  debtRepayment: string;
  name: string;
  address: string;
  orderId: string;
}
export interface IVerifyPowerResponse {
  result: IVerifyPower;
  message: string;
  statusCode: number;
}
