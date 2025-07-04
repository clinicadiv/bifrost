import { api } from "@/services/api";

export async function cancelReservation(reservationId: string) {
  const response = await api.delete(`/time-slots/cancel/${reservationId}`);

  return response.data;
}
