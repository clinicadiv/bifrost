import { api } from "../../api";

interface MarkNotificationReadResponse {
  success: boolean;
  message: string;
}

export async function markNotificationRead(
  notificationId: string,
  token: string,
  isRead: boolean = true
): Promise<MarkNotificationReadResponse> {
  const response = await api.patch<MarkNotificationReadResponse>(
    `/notifications/${notificationId}/read`,
    {
      isRead,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
