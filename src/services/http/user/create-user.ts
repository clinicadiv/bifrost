import { api } from "../../api";

interface CreateUserDTO {
  name: string;
  email: string;
  phone: string;
}

interface CreateUserResponse {
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
      createdAt: string;
      updatedAt: string;
    };
  };
  message: string;
}

export async function createUser(
  data: CreateUserDTO
): Promise<CreateUserResponse> {
  const response = await api.post<CreateUserResponse>("/users", data);

  return response.data;
}
