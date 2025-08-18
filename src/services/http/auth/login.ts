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
  avatar?: string | null;
  plan: {
    planName: string;
    companyName: string;
  } | null;
}

interface UserLoginData {
  user: User;
  token: string;
}

export interface UserLoginResponse {
  success: boolean;
  data: UserLoginData;
  message: string;
  timestamp: string;
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
