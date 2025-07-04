import { api } from "../../api";
import { Address } from "./create-address";

export interface GetUserAddressesResponse {
  success: boolean;
  data: Address[];
}

export async function getUserAddresses(
  userId: string
): Promise<GetUserAddressesResponse> {
  const response = await api.get<GetUserAddressesResponse>(
    `/addresses/user/${userId}`
  );

  return response.data;
}
