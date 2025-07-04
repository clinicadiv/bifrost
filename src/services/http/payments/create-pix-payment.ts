import { api } from "@/services/api";

interface CustomerProps {
  name: string;
  email: string;
  document: string;
  phone: string;
}

interface CreatePixProps {
  appointmentId: string;
  customer: CustomerProps;
  dueDate: string;
  description: string;
}

interface CreatePixResponse {
  success: boolean;
  data: {
    id: string;
    appointmentId: string;
    asaasPaymentId: string;
    amount: number;
    method: string;
    status: string;
    dueDate: string;
    createdAt: string;
    pixData: {
      qrCode: string;
      payload: string;
      expirationDate: string;
    };
  };
  message: string;
}

export async function createPixPayment(
  data: CreatePixProps
): Promise<CreatePixResponse> {
  const response = await api.post<CreatePixResponse>("/payments/pix", data);

  return response.data;
}
