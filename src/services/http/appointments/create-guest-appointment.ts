import { api } from "../../api";

export interface CreateGuestAppointmentData {
  medicalId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  amount: number;
  guestUserData: {
    document?: string;
    phone?: string;
    whatsappPhone?: string;
    zipCode?: string;
    street?: string;
    number?: number;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

export interface GuestAppointment {
  id: string;
  patientId: string;
  medicalId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  medical: {
    id: string;
    name: string;
    email: string;
  };
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface CreateGuestAppointmentResponse {
  success: boolean;
  data: GuestAppointment;
  isGuestUser: boolean;
}

export async function createGuestAppointment(
  data: CreateGuestAppointmentData
): Promise<CreateGuestAppointmentResponse> {
  const response = await api.post<CreateGuestAppointmentResponse>(
    "/appointments/guest",
    data
  );

  return response.data;
}
