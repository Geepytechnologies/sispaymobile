export interface PurchaseAirtimeDTO {
  serviceCategoryId: string | null | undefined;
  amount: number;
  phoneNumber: string;
  accountNumber: string | undefined;
}
export interface PurchaseDataDTO {
  serviceCategoryId: string | undefined;
  bundleCode: string;
  amount: number;
  phoneNumber: string;
  accountNumber: string | undefined;
}
export interface PurchaseCableTvDTO {
  serviceCategoryId: string;
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
