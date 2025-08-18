import { api } from "../../api";

interface FindAllServicesResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    description: string;
    consultationType: "PSYCHOLOGICAL" | "PSYCHIATRIC";
    pricing: {
      originalPrice: number;
      yourPrice: number;
      savings: number;
    };
    status: boolean;
  }[];
}

export async function findAllServices(
  userId: string
): Promise<FindAllServicesResponse> {
  const response = await api.get<FindAllServicesResponse>(
    `/services?userId=${userId}`
  );

  return response.data;
}
