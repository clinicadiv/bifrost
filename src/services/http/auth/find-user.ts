import { api } from "@/services/api";
import { User } from "./login";

interface FindUserResponse {
  user: User;
  success: boolean;
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
