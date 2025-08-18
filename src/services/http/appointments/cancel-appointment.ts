import { api } from "@/services/api";

export interface CancelAppointmentResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    status: string;
    cancelledAt: string;
  };
}

export const cancelAppointment = async (
  appointmentId: string,
  token: string
): Promise<CancelAppointmentResponse> => {
  try {
    const response = await api.patch<CancelAppointmentResponse>(
      `/appointments/${appointmentId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    // Handle different types of errors
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Erro ao cancelar consulta",
      };
    } else if (error && typeof error === "object" && "message" in error) {
      const errorWithMessage = error as { message: string };
      return {
        success: false,
        message: errorWithMessage.message,
      };
    } else {
      return {
        success: false,
        message: "Erro desconhecido ao cancelar consulta",
      };
    }
  }
};
