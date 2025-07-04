import { Psychologist } from "@/types";
import { api } from "../../api";

interface FindPsychiatristsProps {
  startDate: string;
  endDate: string;
}

interface FindPsychiatristsResponse {
  count: number;
  data: Psychologist[];
  success: boolean;
}

export const findPsychiatrists = async ({
  startDate,
  endDate,
}: FindPsychiatristsProps) => {
  const response = await api.get<FindPsychiatristsResponse>(
    "medical/psychiatrists",
    {
      params: {
        startDate,
        endDate,
      },
    }
  );

  return response.data.data;
};
