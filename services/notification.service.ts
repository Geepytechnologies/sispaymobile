import { getNotificationsParams } from "@/interfaces/queryprops.interface";
import {
  INotificationCountResponse,
  INotificationResponse,
} from "@/interfaces/responses/notification.interface";
import { getRequestParams, putRequest } from "@/utils/apiCaller";

class NotificationService {
  async getNotifications(params: getNotificationsParams) {
    try {
      const response = await getRequestParams<
        getNotificationsParams,
        INotificationResponse
      >({
        url: `/Notification/GetNotifications`,
        params,
      });
      return response.result;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }
  async getUnreadNotificationCount(params: getNotificationsParams) {
    try {
      const response = await getRequestParams<
        getNotificationsParams,
        INotificationCountResponse
      >({
        url: `/Notification/GetUnreadNotificationCount`,
        params,
      });
      return response.result;
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
      throw error;
    }
  }
  async readNotification(id: string) {
    try {
      const response = await putRequest<null, INotificationResponse>({
        url: `/Notification/read/${id}`,
        payload: null,
      });
      return response.result;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }
  async dismissNotification(id: string) {
    try {
      const response = await putRequest<null, INotificationResponse>({
        url: `/Notification/dismiss/${id}`,
        payload: null,
      });
      return response.result;
    } catch (error) {
      console.error("Error marking notification as dismissed:", error);
      throw error;
    }
  }
}

export default new NotificationService();
