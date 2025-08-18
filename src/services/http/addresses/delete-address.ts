import { api } from "../../api";

export interface DeleteAddressResponse {
  success: boolean;
  message: string;
}

export async function deleteAddress(
  addressId: string,
  token: string
): Promise<DeleteAddressResponse> {
  const response = await api.delete<DeleteAddressResponse>(
    `/addresses/${addressId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
