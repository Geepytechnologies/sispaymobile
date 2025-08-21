import { useQuery } from "@tanstack/react-query";
import walletService from "@/services/wallet.service";

export const useLastTwoTransactions = (
  accountNumber: string | undefined | null
) => {
  return useQuery({
    queryKey: ["lastTwotransactions", accountNumber],
    queryFn: () => walletService.getLastTwoTransactions(accountNumber ?? null),
    enabled: !!accountNumber,
  });
};

export const useTransactions = (
  startDate: string,
  endDate: string,
  accountNumber: string,
  pageNumber: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: [
      "transactions",
      startDate,
      endDate,
      accountNumber,
      pageNumber,
      pageSize,
    ],
    queryFn: () =>
      walletService.getTransactions(
        startDate,
        endDate,
        accountNumber,
        pageNumber,
        pageSize
      ),
    refetchOnMount: true,
    staleTime: 0,
  });
};

export const useTransactionById = (id: string | string[] | undefined) => {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => walletService.getATransaction(id),
    enabled: !!id,
  });
};

export const useBankLists = () => {
  return useQuery({
    queryKey: ["banklists"],
    queryFn: () => walletService.GetBankList(),
  });
};
