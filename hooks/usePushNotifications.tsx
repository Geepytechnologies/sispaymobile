import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

type NotificationData = {
  title: string;
  body: string;
  data: Record<string, any>;
};

type ExpoPushTokenResponse = {
  data: string;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: false,
  }),
});

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const sendPushNotification = async (
    title: string,
    body: string,
    data: Record<string, any>
  ) => {
    if (!expoPushToken) {
      console.error("No Expo Push Token available");
      return;
    }

    const message = {
      to: expoPushToken,
      sound: "default",
      title: title,
      body: body,
      data: data,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  let projectId: string | undefined = undefined;
  if (Constants?.expoConfig?.extra) {
    projectId = Constants.expoConfig.extra.eas.projectId as string;
  }

  useEffect(() => {
    const registerForPushNotificationsAsync = async (): Promise<
      string | undefined
    > => {
      let token: string | undefined;

      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }

        const tokenResponse: ExpoPushTokenResponse =
          await Notifications.getExpoPushTokenAsync({
            projectId,
          });
        token = tokenResponse.data;
      } else {
        // alert("Must use a physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return token;
    };

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(notification);
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [projectId]);

  return {
    expoPushToken,
    notification,
    sendPushNotification,
  };
}
