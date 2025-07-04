import { Psychologist } from "@/types";
import { api } from "../../api";

interface FindPsychologistsProps {
  startDate: string;
  endDate: string;
}

interface FindPsychologistsResponse {
  count: number;
  data: Psychologist[];
  success: boolean;
}

export const findPsychologists = async ({
  startDate,
  endDate,
}: FindPsychologistsProps) => {
  const response = await api.get<FindPsychologistsResponse>(
    "medical/psychologists",
    {
      params: {
        startDate,
        endDate,
      },
    }
  );

  return response.data.data;
};
