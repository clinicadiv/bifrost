import { api } from "../../api";

interface MarkAllNotificationsReadResponse {
  success: boolean;
  message: string;
  updatedCount: number;
}

export async function markAllNotificationsRead(
  userId: string,
  token: string
): Promise<MarkAllNotificationsReadResponse> {
  const response = await api.patch<MarkAllNotificationsReadResponse>(
    `/notifications/user/${userId}/mark-all-read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
