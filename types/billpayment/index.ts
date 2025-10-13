export interface PurchaseAirtimeDTO {
  serviceCategoryId: string | null | undefined;
  amount: number;
  phoneNumber: string;
  accountNumber: string | undefined;
  accountPin: string;
}
export interface PurchaseDataDTO {
  serviceCategoryId: string | undefined;
  bundleCode: string;
  amount: number;
  phoneNumber: string;
  accountPin: string;
}
export interface PurchaseCableTvDTO {
  serviceCategoryId: string | undefined;
  bundleCode: string;
  amount: number;
  cardNumber: string;
  accountNumber: string;
}
export interface PurchaseUtilityBillDTO {
  serviceCategoryId: string;
  vendType: string;
  amount: number;
  meterNumber: string;
  accountNumber: string;
}
export interface PurchaseVtuDataDTO {
  phone: string;
  network: string | undefined;
  dataPlan: string;
  accountNumber: string | undefined;
  amount: string | undefined;
}
