import { Address } from "../../../types";
import { api } from "../../api";

export interface UpdateAddressData {
  title?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  isDefault?: boolean;
}

export interface UpdateAddressResponse {
  success: boolean;
  data: Address;
  message: string;
}

export async function updateAddress(
  addressId: string,
  data: UpdateAddressData,
  token: string
): Promise<UpdateAddressResponse> {
  const response = await api.put<UpdateAddressResponse>(
    `/addresses/${addressId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
