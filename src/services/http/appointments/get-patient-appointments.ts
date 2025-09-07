import { api } from "../../api";

export interface AppointmentResponse {
  id: string;
  medicalId: string;
  patientId: string;
  appointmentDate: string; // Formato: "2025-08-22"
  appointmentTime: string; // Formato: "15:00"
  asaasPaymentId?: string | null;
  billingType?: string | null;
  consultationType: string; // "PSYCHOLOGICAL"
  copayAmount?: number | null;
  createdAt: string;
  googleEventId?: string | null;
  amount: number; // 40
  medical: {
    id: string;
    crp: string;
    medicalId: string;
    type: string; // "psychologist"
    userName: string;
  };
  meetLink: string; // "https://meet.google.com/ghb-aays-ckz"
  notes?: string | null;
  originalAmount: number; // 150
  patient: {
    id: string;
    email: string;
    name: string;
    phone: string;
    patientId: string;
  };
  payment: boolean;
  paymentDate?: string | null;
  paymentDueDate?: string | null;
  paymentStatus: string; // "PENDING"
  planDiscountAmount: number; // 110
  serviceId: string; // "psychological-consultation"
  status: string; // "SCHEDULED"
  subscriptionId?: string | null;
  updatedAt: string;
  userId?: string | null;
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
