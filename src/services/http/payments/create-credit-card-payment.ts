import { api } from "@/services/api";

interface CustomerProps {
  name: string;
  email: string;
  document: string;
  phone: string;
}

interface CreditCardProps {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

interface CreditCardHolderProps {
  name: string;
  email: string;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
  phone: string;
  mobilePhone: string;
}

interface CreateCreditCardProps {
  appointmentId: string;
  customer: CustomerProps;
  creditCard: CreditCardProps;
  creditCardHolder: CreditCardHolderProps;
  description: string;
}

interface CreateCreditCardResponse {
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
    creditCardData: {
      installments: number;
      installmentValue: number;
    };
  };
  message: string;
}

export async function createCreditCardPayment(
  data: CreateCreditCardProps
): Promise<CreateCreditCardResponse> {
  const response = await api.post<CreateCreditCardResponse>(
    "/payments/credit-card",
    data
  );

  return response.data;
}
