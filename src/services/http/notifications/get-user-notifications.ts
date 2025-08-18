import { api } from "../../api";

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  timestamp: string;
}

export interface GetUserNotificationsResponse {
  success: boolean;
  data: {
    results: NotificationResponse[];
    total: number;
    page: number;
    limit: number;
    offset: number;
  };
}

export async function getUserNotifications(
  userId: string,
  token: string
): Promise<GetUserNotificationsResponse> {
  const response = await api.get<GetUserNotificationsResponse>(
    `/notifications/user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
