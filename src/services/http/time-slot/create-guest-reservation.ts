import { api } from "../../api";

interface CreateReservationData {
  medicalId: string;
  reservationDate: string;
  reservationTime: string;
  serviceId: string;
  durationMinutes: number;
}

interface CreateGuestReservationResponse {
  success: boolean;
  data: {
    id: string;
    medicalId: string;
    patientId: string | null;
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

export async function createGuestReservation(
  data: CreateReservationData
): Promise<CreateGuestReservationResponse> {
  const response = await api.post<CreateGuestReservationResponse>(
    "/time-slots/reserve-guest",
    data
  );

  return response.data;
}
