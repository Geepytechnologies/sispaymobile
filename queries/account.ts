import { useQuery } from "@tanstack/react-query";
import accountService from "@/services/account.service";
import { useUserStore } from "@/config/store";

export const useUserAccount = () => {
  const { user } = useUserStore();
  const isEnabled = !!user?.accessToken;
  return useQuery({
    queryKey: ["getUserAccount"],
    queryFn: () => accountService.getUserAccount(),
    enabled: isEnabled,
  });
};
