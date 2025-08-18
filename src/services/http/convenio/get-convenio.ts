import { GetConvenioResponse } from "@/types";
import { api } from "../../api";

export async function getConvenio(
  userId: string,
  token: string,
  month?: string
): Promise<GetConvenioResponse> {
  const currentMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM format

  const response = await api.get<GetConvenioResponse>(
    `/user-subscriptions/convenio/${userId}?month=${currentMonth}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
