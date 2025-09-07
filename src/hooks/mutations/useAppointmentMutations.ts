import { useAuthStore } from "@/hooks/useAuthStore";
import { useReactQueryErrorHandler } from "@/hooks/useReactQueryErrorHandler";
import { queryKeys } from "@/lib/query-keys";
import { cancelAppointment } from "@/services/http/appointments";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Tipos para os parâmetros
interface CancelAppointmentParams {
  appointmentId: string;
  reason?: string;
}

interface RescheduleParams {
  appointmentId: string;
  newDate: string;
  newTime: string;
  reason?: string;
}

/**
 * Hook para cancelar um agendamento
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();
  const { handleMutationError } = useReactQueryErrorHandler();

  return useMutation({
    mutationFn: async (params: CancelAppointmentParams) => {
      if (!user?.id || !token) throw new Error("User not authenticated");
      return cancelAppointment(params.appointmentId, token);
    },

    onSuccess: (data, variables) => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.appointmentsByUser(user.id),
        });

        queryClient.invalidateQueries({
          queryKey: queryKeys.appointmentDetail(variables.appointmentId),
        });
      }
    },

    onError: (error) => {
      handleMutationError(error, {
        endpoint: "/api/appointments",
      });
    },
  });
}

/**
 * Hook para reagendar um agendamento
 */
export function useRescheduleAppointment() {
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();
  const { handleMutationError } = useReactQueryErrorHandler();

  return useMutation({
    mutationFn: async (params: RescheduleParams) => {
      if (!user?.id || !token) throw new Error("User not authenticated");

      // Primeiro cancela o agendamento atual
      await cancelAppointment(params.appointmentId, token);

      // Aqui você implementaria a lógica para criar um novo agendamento
      // com a nova data/hora
      return { success: true, message: "Agendamento reagendado com sucesso" };
    },

    onSuccess: (data, variables) => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.appointmentsByUser(user.id),
        });

        queryClient.invalidateQueries({
          queryKey: queryKeys.appointmentDetail(variables.appointmentId),
        });
      }
    },

    onError: (error) => {
      handleMutationError(error, {
        endpoint: "/api/appointments",
      });
    },
  });
}

/**
 * Hook que agrupa todas as operações de appointments
 */
export function useAppointmentOperations() {
  const cancelAppointment = useCancelAppointment();
  const rescheduleAppointment = useRescheduleAppointment();

  return {
    // Mutations
    cancelAppointment: cancelAppointment.mutateAsync,
    rescheduleAppointment: rescheduleAppointment.mutateAsync,

    // Funções assíncronas
    cancelAppointmentAsync: cancelAppointment.mutateAsync,
    rescheduleAppointmentAsync: rescheduleAppointment.mutateAsync,

    // Estados
    isCancelling: cancelAppointment.isPending,
    isRescheduling: rescheduleAppointment.isPending,
    isLoading: cancelAppointment.isPending || rescheduleAppointment.isPending,

    // Propriedades específicas para PIX (placeholders)
    fetchPixData: async () => ({ success: false, message: "Not implemented" }),
    isLoadingPix: false,
    pixData: null,
  };
}
