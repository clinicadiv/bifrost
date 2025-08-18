import { NoActivePlanResponse, UserBenefitsResponse } from "@/types";
import { api } from "../../api";

export async function getUserBenefits(
  userId: string,
  token: string
): Promise<UserBenefitsResponse | NoActivePlanResponse> {
  const response = await api.get<UserBenefitsResponse | NoActivePlanResponse>(
    `/user-subscriptions/benefits/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
