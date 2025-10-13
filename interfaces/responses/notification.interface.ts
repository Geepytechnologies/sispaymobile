export interface INotificationResponse {
  result: INotification[];
  message: string;
  statusCode: number;
}
export interface INotificationCountResponse {
  result: number;
  message: string;
  statusCode: number;
}
export interface INotification {
  id: string;
  title: string;
  body: string;
  type: "Transaction" | "Activity";
  status: "Read" | "Unread" | "Dismissed";
  timeSent: string;
  userId: string;
}
