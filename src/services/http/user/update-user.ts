import { api } from "../../api";

interface UpdateUserDTO {
  name?: string;
  email?: string;
  phone?: string;
  document?: string;
  whatsappPhone?: string;
  whatsapp?: boolean;
  avatar?: string | null;
}

interface UpdateUserResponse {
  success: boolean;
  data: {
    success: boolean;
    user: {
      id: string;
      name: string;
      email: string;
      password: string;
      document: string | null;
      agreement: string;
      agreementstatus: string | null;
      phone: string;
      whatsapp: string | null;
      whatsappPhone: string | null;
      level: number;
      status: number;
      departmentId: string | null;
      asaasCustomerId: string | null;
      avatar?: string | null;
      plan: {
        planName: string;
        companyName: string;
      } | null;
      createdAt: string;
      updatedAt: string;
    };
  };
  message: string;
}

export async function updateUser(
  userId: string,
  data: UpdateUserDTO,
  token: string
): Promise<UpdateUserResponse> {
  const response = await api.put<UpdateUserResponse>(`/users/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
