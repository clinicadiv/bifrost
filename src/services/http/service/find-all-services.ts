import { api } from "../../api";

interface FindAllServicesResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    description: string;
    consultationType: "PSYCHOLOGICAL" | "PSYCHIATRIC";
    status: boolean;
    pricing: {
      originalPrice: number;
      finalPrice: number;
      hasDiscount: boolean;
      planInfo: {
        planName: string;
        copayAmount: number;
        remainingSessions: number;
      };
    };
  }[];
  userHasPlan: boolean;
  message: string;
}

export async function findAllServices(
  userId: string,
  token: string
): Promise<FindAllServicesResponse> {
  const response = await api.get<FindAllServicesResponse>(
    `/services-pricing?userId=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
