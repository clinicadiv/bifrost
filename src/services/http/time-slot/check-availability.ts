import { api } from "../../api";

export interface CheckAvailabilityParams {
  medicalId: string;
  date: string; // YYYY-MM-DD format
  timeSlot: string; // HH:mm:ss format
}

export interface CheckAvailabilityResponse {
  available: boolean;
  reason?: string;
}

export async function checkAvailability({
  medicalId,
  date,
  timeSlot,
}: CheckAvailabilityParams): Promise<CheckAvailabilityResponse> {
  const response = await api.get<CheckAvailabilityResponse>(
    "/time-slots/availability",
    {
      params: {
        medicalId,
        date,
        timeSlot,
      },
    }
  );

  return response.data;
}
