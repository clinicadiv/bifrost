import { api } from "../../api";

interface GetUnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    unreadCount: number;
  };
}

export async function getUnreadCount(
  userId: string,
  token: string
): Promise<GetUnreadCountResponse> {
  const response = await api.get<GetUnreadCountResponse>(
    `/notifications/user/${userId}/unread-count`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

// Alias para compatibilidade
export async function getUnreadNotificationsCount(
  userId: string,
  token: string
): Promise<GetUnreadCountResponse> {
  const response = await api.get<GetUnreadCountResponse>(
    `/notifications/user/${userId}/unread-count`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
