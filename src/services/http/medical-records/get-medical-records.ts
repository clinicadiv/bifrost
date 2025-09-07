import { api } from "@/services/api";

export interface MedicalRecordDocument {
  id: string;
  appointmentId: string;
  medicalRecordId: string;
  name: string;
  size: string;
  s3DocumentUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecordPrescription {
  id: string;
  medicalRecordId: string;
  name: string;
  size: string;
  prescriptionType: "BRANCA" | "AMARELA" | "AZUL";
  trackingCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecordMedical {
  id: string;
  name: string;
  type: "psychologist" | "psychiatrist";
  crp?: string;
  crm?: string;
}

export interface MedicalRecordPatient {
  id: string;
  name: string;
  email: string;
}

export interface MedicalRecordAppointment {
  id: string;
  medicalId: string;
  patientId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
  status: string;
  payment: boolean;
  serviceId: string;
  meetLink: string;
  asaasPaymentId: string;
  paymentStatus: string;
  amount: number;
  billingType: string;
  paymentDate: string;
  paymentDueDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  patient: MedicalRecordPatient;
}

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  userId: string;
  medicalId: string;
  appointmentDateTime: string;
  description: string;
  observedSymptoms: string[];
  diagnosis: string;
  treatmentPlan: string;
  clinicalObservations: string;
  createdAt: string;
  updatedAt: string;
  medical: MedicalRecordMedical;
  appointment: MedicalRecordAppointment;
  documents: MedicalRecordDocument[];
  prescriptions: MedicalRecordPrescription[];
}

export interface GetMedicalRecordsResponse {
  success: boolean;
  page: number;
  limit: number;
  offset: number;
  total: number;
  results: MedicalRecord[];
}

export interface GetMedicalRecordsApiResponse {
  success: boolean;
  data: GetMedicalRecordsResponse;
  message: string;
}

export interface GetMedicalRecordsParams {
  page?: number;
  limit?: number;
}

export const getMedicalRecords = async (
  userId: string,
  token: string,
  params: GetMedicalRecordsParams = {}
): Promise<GetMedicalRecordsResponse> => {
  const { page = 1, limit = 10 } = params;

  const response = await api.get<GetMedicalRecordsApiResponse>(
    `/medical-records/user/${userId}`,
    {
      params: {
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
};
