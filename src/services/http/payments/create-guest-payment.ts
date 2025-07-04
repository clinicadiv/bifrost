import { api } from "../../api";
import { CreatePaymentResponse } from "./create-payment";

export interface CreateGuestPaymentData {
  appointmentId: string;
  billingType: "PIX" | "CREDIT_CARD";
  cpfCnpj: string;
  dueDate: string;
  patient?: {
    name: string;
    email: string;
    document: string;
    phone: string;
  };
  creditCardData?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement?: string;
    phone: string;
  };
}

export async function createGuestPayment(
  data: CreateGuestPaymentData
): Promise<CreatePaymentResponse> {
  const response = await api.post<CreatePaymentResponse>(
    "/payments/guest",
    data
  );

  return response.data;
}
