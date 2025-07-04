import { api } from "@/services/api";

export interface User {
  id: string;
  name: string;
  email: string;
  document: string | null;
  agreement: string;
  phone: string;
  whatsapp: boolean;
  whatsappPhone: string;
  level: number;
}

export interface UserLoginResponse {
  user: User;
  token: string;
  success: boolean;
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const query = await api.post<UserLoginResponse>(
    "auth/login",
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return query.data;
}
