import { api } from "../../api";
import { Address } from "./create-address";

export interface GetUserAddressesData {
  success: boolean;
  addresses: Address[];
  message: string;
}

export interface GetUserAddressesResponse {
  success: boolean;
  data: GetUserAddressesData;
  timestamp: string;
}

export async function getUserAddresses(
  userId: string,
  token: string
): Promise<GetUserAddressesResponse> {
  const response = await api.get<GetUserAddressesResponse>(
    `/addresses/user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
