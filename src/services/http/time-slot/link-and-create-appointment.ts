import { api } from "../../api";

interface LinkAndCreateAppointmentResponse {
  success: boolean;
  data: {
    reservation: {
      id: string;
      medicalId: string;
      patientId: string;
      reservationDate: string;
      reservationTime: string;
      status: string;
      expiresAt: string;
      serviceId: string;
      createdAt: string;
      updatedAt: string;
    };
    appointment: {
      id: string;
      medicalId: string;
      patientId: string;
      appointmentDate: string;
      appointmentTime: string;
      notes: string | null;
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
      patient: {
        id: string;
        name: string;
        email: string;
        phone: string;
      };
    };
  };
  message: string;
}

export async function linkAndCreateAppointment(
  reservationId: string,
  patientId: string
) {
  const response = await api.post<LinkAndCreateAppointmentResponse>(
    "/time-slots/link-and-create-appointment",
    {
      reservationId,
      patientId,
    }
  );

  return response.data;
}
