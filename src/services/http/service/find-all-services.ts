import { api } from "../../api";

interface FindAllServicesResponse {
  success: boolean;
  data: {
    success: boolean;
    data: {
      id: string;
      name: string;
      description: string;
      price: number;
      createdAt: string;
      updatedAt: string;
    }[];
    count: number;
  };
}

export async function findAllServices(): Promise<FindAllServicesResponse> {
  const response = await api.get<FindAllServicesResponse>("/services");

  return response.data;
}
