import { Service } from "@/types";
import { api } from "../../api";

interface GetServicesResponse {
  count: number;
  data: Service[];
  success: boolean;
}

export const findServices = async () => {
  const response = await api.get<GetServicesResponse>("services");

  return response.data.data;
};
