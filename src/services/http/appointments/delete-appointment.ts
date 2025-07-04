import { api } from "../../api";

export async function deleteAppointment(appointmentId: string) {
  const response = await api.delete(`/appointments/${appointmentId}`);

  return response.data;
}
