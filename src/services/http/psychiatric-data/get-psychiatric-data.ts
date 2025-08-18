import { GetPsychiatricDataResponse } from "@/types";
import { api } from "../../api";

export async function getPsychiatricData(
  userId: string,
  token: string
): Promise<GetPsychiatricDataResponse> {
  const response = await api.get<GetPsychiatricDataResponse>(
    `/psychiatric-data/user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
