import {
  CreatePsychiatricDataDTO,
  CreatePsychiatricDataResponse,
} from "@/types";
import { api } from "../../api";

export async function createPsychiatricData(
  data: CreatePsychiatricDataDTO,
  token: string
): Promise<CreatePsychiatricDataResponse> {
  const response = await api.post<CreatePsychiatricDataResponse>(
    "/psychiatric-data",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
