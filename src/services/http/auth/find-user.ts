import { api } from "@/services/api";
import { User } from "./login";

interface FindUserData {
  user: User;
}

interface FindUserResponse {
  success: boolean;
  data: FindUserData;
  message: string;
  timestamp: string;
}

export async function findUser(token: string) {
  const query = await api.get<FindUserResponse>("auth/me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return query.data;
}
