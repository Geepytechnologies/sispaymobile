import { getNotificationsParams } from "@/interfaces/queryprops.interface";
import notificationService from "@/services/notification.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetNotifications = (params: getNotificationsParams) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => notificationService.getNotifications(params),
    enabled: !!params.type,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUnreadNotificationCount = (
  params: getNotificationsParams
) => {
  return useQuery({
    queryKey: ["unreadNotificationCount", params],
    queryFn: () => notificationService.getUnreadNotificationCount(params),
    refetchOnMount: true,
    staleTime: 0,
  });
};

export const useReadNotification = (id: string | undefined) => {
  const { mutate, status, error, ...rest } = useMutation({
    mutationFn: () => notificationService.readNotification(id ?? ""),
  });
  return {
    readNotification: mutate,
    readingNotification: status === "pending",
    readNotificationError: error,
    ...rest,
  };
};

export const useDismissNotification = (id: string | undefined) => {
  const { mutate, status, error, ...rest } = useMutation({
    mutationFn: () => notificationService.dismissNotification(id ?? ""),
  });
  return {
    dismissNotification: mutate,
    dismissingNotification: status === "pending",
    dismissNotificationError: error,
    ...rest,
  };
};
