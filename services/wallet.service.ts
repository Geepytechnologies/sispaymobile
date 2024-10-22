import { AxiosInstance } from "axios";

class WalletService {
  async getTransactions(axiosPrivate: AxiosInstance) {
    try {
      const response = await axiosPrivate.get("/Wallet/GetTransactions");
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }
}

export default WalletService;
