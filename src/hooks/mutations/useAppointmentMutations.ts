"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useReactQueryErrorHandler } from "@/hooks/useReactQueryErrorHandler";
import { queryKeys } from "@/lib/query-keys";
import { api } from "@/services/api";
import { cancelAppointment } from "@/services/http/appointments";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Interfaces para mutations
interface RescheduleParams {
  appointmentId: string;
  professionalId: string;
  date: string;
  time: string;
}

interface PixPaymentParams {
  asaasPaymentId: string;
}

/**
 * Hook para reagendar consultas com React Query
 *
 * Benefícios:
 * - Optimistic updates (UI atualiza instantaneamente)
 * - Rollback automático em caso de erro
 * - Cache invalidation inteligente
 * - Error handling integrado
 */
export function useRescheduleAppointment() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (params: RescheduleParams) => {
      const payload = {
        professionalId: params.professionalId,
        appointmentDate: params.date,
        appointmentTime: params.time,
      };

      const response = await api.patch(
        `/appointments/${params.appointmentId}/reschedule`,
        payload
      );

      return response.data;
    },

    onSuccess: () => {
      // Invalidar todas as queries relacionadas a appointments
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments,
      });

      // Invalidar queries específicas do usuário
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.appointmentsByUser(user.id),
        });
      }
    },

    onError: (error, variables) => {
      handleMutationError(error, variables, {
        endpoint: `/appointments/${variables.appointmentId}/reschedule`,
      });

      // Re-throw para que o modal possa capturar
      throw error;
    },
  });
}

/**
 * Hook para cancelar consultas com optimistic updates
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();
  const { handleMutationError, createOptimisticUpdate } =
    useReactQueryErrorHandler();
  const { user, token } = useAuthStore();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      if (!token) throw new Error("Token required");
      return cancelAppointment(appointmentId, token);
    },

    // Optimistic update - atualiza UI imediatamente
    ...createOptimisticUpdate(
      queryKeys.appointmentsByUser(user?.id || ""),
      (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          all: oldData.all?.map((apt: any) =>
            apt.id === appointmentId ? { ...apt, status: "Cancelada" } : apt
          ),
          upcoming: oldData.upcoming?.filter(
            (apt: any) => apt.id !== appointmentId
          ),
          past: [
            ...(oldData.past || []),
            ...(oldData.upcoming
              ?.filter((apt: any) => apt.id === appointmentId)
              .map((apt: any) => ({ ...apt, status: "Cancelada" })) || []),
          ],
        };
      }
    ),

    onSuccess: (data) => {
      // Se a resposta não foi bem-sucedida, tratar como erro
      if (!data.success) {
        throw new Error(data.message);
      }
    },
  });
}

/**
 * Hook para buscar dados do PIX
 */
export function usePixPayment() {
  const { handleMutationError } = useReactQueryErrorHandler();

  return useMutation({
    mutationFn: async (params: PixPaymentParams) => {
      const response = await api.get(`/payments/pix/${params.asaasPaymentId}`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Erro ao buscar dados do PIX");
      }

      return response.data.data;
    },

    onError: (error, variables) => {
      handleMutationError(error, variables, {
        endpoint: `/payments/pix/${variables.asaasPaymentId}`,
      });
    },
  });
}

/**
 * Hook combinado para todas as operações de appointment
 *
 * Simplifica o uso nas páginas
 */
export function useAppointmentOperations() {
  const reschedule = useRescheduleAppointment();
  const cancel = useCancelAppointment();
  const pixPayment = usePixPayment();

  return {
    // Reagendamento
    rescheduleAppointment: reschedule.mutate,
    rescheduleAppointmentAsync: reschedule.mutateAsync,
    isRescheduling: reschedule.isPending,
    rescheduleError: reschedule.error,

    // Cancelamento
    cancelAppointment: cancel.mutate,
    cancelAppointmentAsync: cancel.mutateAsync,
    isCancelling: cancel.isPending,
    cancelError: cancel.error,

    // PIX
    fetchPixData: pixPayment.mutate,
    fetchPixDataAsync: pixPayment.mutateAsync,
    isLoadingPix: pixPayment.isPending,
    pixError: pixPayment.error,
    pixData: pixPayment.data,

    // Estados globais
    isLoading: reschedule.isPending || cancel.isPending || pixPayment.isPending,
    hasError: !!reschedule.error || !!cancel.error || !!pixPayment.error,
  };
}
