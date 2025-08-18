import { api } from "../../api";

interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}

export async function deleteNotification(
  notificationId: string,
  token: string
): Promise<DeleteNotificationResponse> {
  const response = await api.delete<DeleteNotificationResponse>(
    `/notifications/${notificationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
