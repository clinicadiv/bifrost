import { Psychologist } from "./Psychologist";

export interface CreateAppointmentWithGuestDTO {
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

export interface Appointment {
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
    phone?: string;
  };
}

export interface SelectedAppointment {
  medicalId: string;
  date: string;
  time: string;
  type: "psychologist" | "psychiatrist";
  professional: Psychologist;
}

export type ServiceType = "psychologist" | "psychiatrist" | null;
