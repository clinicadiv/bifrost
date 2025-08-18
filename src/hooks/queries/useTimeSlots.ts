"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useQueryErrorHandler } from "@/hooks/useReactQueryErrorHandler";
import { queryKeys } from "@/lib/query-keys";
import { checkAvailability } from "@/services/http/time-slot/check-availability";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook React Query para verificar disponibilidade de horários
 *
 * Benefícios:
 * - Cache automático de disponibilidade
 * - Revalidação inteligente
 * - Error handling integrado
 * - Loading states automáticos
 */
export function useTimeSlotAvailability(params: {
  professionalId?: string;
  serviceId?: string;
  date?: string;
}) {
  const { token } = useAuthStore();
  const { onError, retry } = useQueryErrorHandler();

  return useQuery({
    queryKey: queryKeys.timeSlotAvailability(params),

    queryFn: async () => {
      if (!token) throw new Error("Token required");
      if (!params.professionalId || !params.serviceId || !params.date) {
        throw new Error("Missing required parameters");
      }

      return checkAvailability({
        professionalId: params.professionalId,
        serviceId: params.serviceId,
        date: params.date,
        token,
      });
    },

    enabled:
      !!token && !!params.professionalId && !!params.serviceId && !!params.date,

    // Cache curto para disponibilidade (dados mudam frequentemente)
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos

    onError,
    retry,

    // Transformar dados para facilitar uso
    select: (data) => {
      if (!data.success) {
        return {
          availableSlots: [],
          hasAvailableSlots: false,
          totalSlots: 0,
        };
      }

      const slots = data.data?.availableSlots || [];

      return {
        availableSlots: slots,
        hasAvailableSlots: slots.length > 0,
        totalSlots: slots.length,
        // Organizar por período
        morningSlots: slots.filter((slot) => {
          const hour = parseInt(slot.time.split(":")[0]);
          return hour < 12;
        }),
        afternoonSlots: slots.filter((slot) => {
          const hour = parseInt(slot.time.split(":")[0]);
          return hour >= 12 && hour < 18;
        }),
        eveningSlots: slots.filter((slot) => {
          const hour = parseInt(slot.time.split(":")[0]);
          return hour >= 18;
        }),
      };
    },

    // Refetch quando janela ganha foco (dados podem ter mudado)
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

/**
 * Hook para buscar horários disponíveis de múltiplos profissionais
 */
export function useMultipleTimeSlotAvailability(
  requests: Array<{
    professionalId: string;
    serviceId: string;
    date: string;
  }>
) {
  const { token } = useAuthStore();
  const { onError, retry } = useQueryErrorHandler();

  return useQuery({
    queryKey: queryKeys.multipleTimeSlotAvailability(requests),

    queryFn: async () => {
      if (!token) throw new Error("Token required");

      // Fazer múltiplas chamadas em paralelo
      const promises = requests.map((request) =>
        checkAvailability({
          ...request,
          token,
        })
      );

      const results = await Promise.all(promises);

      return results.map((result, index) => ({
        ...requests[index],
        result,
        availableSlots: result.success ? result.data?.availableSlots || [] : [],
      }));
    },

    enabled:
      !!token &&
      requests.length > 0 &&
      requests.every((req) => req.professionalId && req.serviceId && req.date),

    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos

    onError,
    retry,
  });
}
