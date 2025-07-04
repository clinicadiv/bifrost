import { api } from "../../api";

export interface CreatePaymentData {
  appointmentId: string;
  billingType: "PIX" | "CREDIT_CARD" | "BOLETO";
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

export interface PaymentResponse {
  id: string;
  object: string;
  dateCreated: string;
  customer: string;
  paymentLink: string;
  value: number;
  netValue: number;
  originalValue?: number;
  interestValue?: number;
  description: string;
  billingType: string;
  status: string;
  pixTransaction?: {
    encodedImage: string;
    payload: string;
    expirationDate: string;
  };
  invoiceUrl?: string;
  bankSlipUrl?: string;
  transactionReceiptUrl?: string;
  dueDate: string;
  originalDueDate: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  installmentNumber?: number;
  externalReference?: string;
  discount?: {
    value: number;
    limitDate?: string;
    dueDateLimitDays: number;
    type: string;
  };
  fine?: {
    value: number;
    type: string;
  };
  interest?: {
    value: number;
    type: string;
  };
  deleted: boolean;
  postalService: boolean;
  anticipated: boolean;
  anticipable: boolean;
}

export interface CreatePaymentResponse {
  success: boolean;
  data: PaymentResponse;
  message?: string;
}

export async function createPayment(
  data: CreatePaymentData
): Promise<CreatePaymentResponse> {
  const response = await api.post<CreatePaymentResponse>("/payments", data);

  return response.data;
}
