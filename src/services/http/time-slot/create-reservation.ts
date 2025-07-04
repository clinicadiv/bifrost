import { api } from "../../api";

interface CreateReservationData {
  medicalId: string;
  patientId: string;
  reservationDate: string;
  reservationTime: string;
  serviceId: string;
  durationMinutes: number;
}

interface CreateReservationResponse {
  success: boolean;
  data: {
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
    medical: {
      id: string;
      name: string;
      email: string;
    };
  };
  message: string;
  expiresIn: number;
  requiresAuth: boolean;
}

export async function createReservation(
  data: CreateReservationData
): Promise<CreateReservationResponse> {
  const response = await api.post<CreateReservationResponse>(
    "/time-slots/reserve",
    data
  );

  return response.data;
}
