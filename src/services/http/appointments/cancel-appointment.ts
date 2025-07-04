import { api } from "@/services/api";

export const cancelAppointment = async (appointmentId: string) => {
  const response = await api.put(`/appointments/${appointmentId}`, {
    status: "CANCELLED",
  });

  return response.data;
};
