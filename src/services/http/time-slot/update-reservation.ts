import { api } from "../../api";

export async function updateReservation(
  reservationId: string,
  status: "RESERVED" | "CANCELLED" | "CONFIRMED" | "EXPIRED"
) {
  const response = await api.patch(`/time-slots/${reservationId}/status`, {
    status,
  });

  return response.data;
}
