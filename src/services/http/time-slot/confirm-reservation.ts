import { api } from "@/services/api";

interface ConfirmReservationResponse {
  success: boolean;
  data: {
    id: string;
    medicalId: string;
    patientId: string;
    appointmentDate: string;
    appointmentTime: string;
    notes: string;
    status: string;
    payment: boolean;
    serviceId: string;
    asaasPaymentId: string | null;
    paymentStatus: string;
    amount: number;
    billingType: string | null;
    paymentDate: string | null;
    paymentDueDate: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string | null;
  };
  message: string;
}

export async function confirmReservation(
  reservationId: string
): Promise<ConfirmReservationResponse> {
  const response = await api.post<ConfirmReservationResponse>(
    `/time-slots/confirm/${reservationId}`
  );

  return response.data;
}
