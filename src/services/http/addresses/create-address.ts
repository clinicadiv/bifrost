import { api } from "../../api";

export interface CreateAddressData {
  userId: string;
  title: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country?: string;
  isDefault?: boolean;
}

export interface Address {
  id: string;
  userId: string;
  title: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressResponse {
  success: boolean;
  data: Address;
  message: string;
}

export async function createAddress(
  data: CreateAddressData
): Promise<CreateAddressResponse> {
  const response = await api.post<CreateAddressResponse>("/addresses", data);

  return response.data;
}
