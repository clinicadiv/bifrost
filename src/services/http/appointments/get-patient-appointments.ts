import { api } from "../../api";

export interface AppointmentResponse {
  id: string;
  medicalId: string;
  patientId: string;
  appointmentDate: string; // Formato: "2024-01-15"
  appointmentTime: string; // Formato: "14:30:00"
  asaasPaymentId?: string;
  billingType?: string;
  consultationType: string;
  copayAmount?: number;
  createdAt: string;
  googleEventId?: string;
  medical: {
    id: string;
    cpf: string;
    userName: string;
    type: string;
    medicalId: string;
    meetLink?: string;
    notes?: string;
    originalAmount?: number;
  };
  patient: {
    id: string;
    email: string;
    name: string;
    phone: string;
    patientId: string;
    paymentDueDate?: string;
    paymentId?: string;
  };
  paymentStatus: string;
  planDiscountAmount?: number;
  serviceId: string;
  status: string;
  subscriptionId?: string;
  updatedAt: string;
  userId?: string;
  amount?: number;
  payment?: boolean;
  urlMeet?: string;
  notes?: string;
}

export interface GetPatientAppointmentsResponse {
  success: boolean;
  data: AppointmentResponse[];
  message: string;
  timestamp: string;
}

export async function getPatientAppointments(
  patientId: string,
  token: string
): Promise<GetPatientAppointmentsResponse> {
  const response = await api.get<GetPatientAppointmentsResponse>(
    `/appointments/patient/${patientId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
