import { api } from "../../api";

interface DeleteAllNotificationsResponse {
  success: boolean;
  message: string;
  deletedCount: number;
}

export async function deleteAllNotifications(
  userId: string,
  token: string
): Promise<DeleteAllNotificationsResponse> {
  const response = await api.delete<DeleteAllNotificationsResponse>(
    `/notifications/user/${userId}/delete-all`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
