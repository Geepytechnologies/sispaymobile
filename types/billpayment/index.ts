export interface PurchaseAirtimeDTO {
  serviceCategoryId: string | null | undefined;
  amount: number;
  phoneNumber: string;
  accountNumber: string | undefined;
}
export interface PurchaseDataDTO {
  serviceCategoryId: string;
  bundleCode: string;
  amount: number;
  phoneNumber: string;
  accountNumber: string;
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
