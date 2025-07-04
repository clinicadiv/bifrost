import { api } from "../../api";

interface GetInstallmentsResponse {
  success: true;
  data: {
    originalAmount: number;
    installmentOptions: {
      installments: number;
      installmentValue: number;
      totalAmount: number;
      totalInterest: number;
      label: string;
      recommended: boolean;
    }[];
    summary: {
      maxInstallments: number;
      interestRate: string;
      interestType: string;
    };
  };
}

export async function getInstallments(
  amount: number
): Promise<GetInstallmentsResponse> {
  const response = await api.get<GetInstallmentsResponse>(
    `/payments/installments?amount=${amount}`
  );

  return response.data;
}
