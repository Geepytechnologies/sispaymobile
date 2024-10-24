import { CONSTANTS } from "@/constants";
import { TransferDTO } from "@/types/AccountDTO";
import axios, { AxiosInstance } from "axios";

class WalletService {
  async getTransactions(
    startDate: string,
    endDate: string,
    accountNumber: string,
    pageNumber: number,
    pageSize: number
  ) {
    try {
      const response = await axios.get(
        `${CONSTANTS.APIURL}/Transaction/GetAllTransactions?startDate=${startDate}&endDate=${endDate}&accountNumber=${accountNumber}&pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }
  async getATransaction(id: string | string[] | undefined) {
    try {
      const response = await axios.get(
        `${CONSTANTS.APIURL}/Transaction/GetATransaction/${id}`
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      throw error;
    }
  }

  async SisPayNameEnquiry(accountNo: string) {
    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/Wallet/transfer/name_enquiry`,
        { bankCode: "999240", accountNumber: accountNo }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching SisPay name enquiry:", error);
      throw error;
    }
  }
  async NameEnquiry(bankCode: string, accountNo: string) {
    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/Wallet/transfer/name_enquiry`,
        { bankCode: bankCode, accountNumber: accountNo }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching name enquiry:", error);
      throw error;
    }
  }
  async MakeTransfer(details: TransferDTO) {
    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/Wallet/transfer`,
        details
      );
      return response.data;
    } catch (error) {
      console.error("Error making transfer:", error);
      throw error;
    }
  }
}

export default new WalletService();
