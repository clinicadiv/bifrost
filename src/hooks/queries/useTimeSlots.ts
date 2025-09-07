import { useAuthStore } from "@/hooks/useAuthStore";
import {
  checkAvailability,
  type CheckAvailabilityResponse,
} from "@/services/http/time-slot/check-availability";
import { useQuery } from "@tanstack/react-query";

interface UseTimeSlotAvailabilityParams {
  medicalId?: string;
  date?: string;
  timeSlot?: string;
}

/**
 * Hook para verificar disponibilidade de horário específico
 */
export function useTimeSlotAvailability(params: UseTimeSlotAvailabilityParams) {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: [
      "time-slots",
      "availability",
      {
        medicalId: params.medicalId,
        date: params.date,
        timeSlot: params.timeSlot,
      },
    ],

    queryFn: async (): Promise<CheckAvailabilityResponse> => {
      if (!token) throw new Error("Token required");
      if (!params.medicalId || !params.date || !params.timeSlot) {
        throw new Error(
          "Missing required parameters: medicalId, date, timeSlot"
        );
      }

      return checkAvailability({
        medicalId: params.medicalId,
        date: params.date,
        timeSlot: params.timeSlot,
      });
    },

    enabled:
      !!token && !!params.medicalId && !!params.date && !!params.timeSlot,

    // Cache por 2 minutos (dados mudam frequentemente)
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,

    select: (data: CheckAvailabilityResponse) => ({
      available: data.available,
      reason: data.reason,
      isAvailable: data.available,
      message: data.available
        ? "Horário disponível"
        : data.reason || "Horário não disponível",
    }),
  });
}

/**
 * Hook simplificado para verificar múltiplos horários
 * Nota: Esta é uma implementação básica. Para casos mais complexos,
 * considere usar React Query em paralelo ou uma API específica.
 */
export function useMultipleTimeSlotAvailability(
  requests: Array<{ medicalId: string; date: string; timeSlot: string }>
) {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ["time-slots", "multiple-availability", requests],

    queryFn: async () => {
      if (!token) throw new Error("Token required");

      // Verificar cada horário sequencialmente
      // Em uma implementação real, você poderia ter uma API que aceita múltiplas verificações
      const results = await Promise.all(
        requests.map(async (request) => {
          try {
            const result = await checkAvailability(request);
            return {
              ...request,
              result,
              available: result.available,
              reason: result.reason,
            };
          } catch {
            return {
              ...request,
              result: { available: false, reason: "Erro na verificação" },
              available: false,
              reason: "Erro na verificação",
            };
          }
        })
      );

      return results;
    },

    enabled:
      !!token &&
      requests.length > 0 &&
      requests.every((req) => req.medicalId && req.date && req.timeSlot),

    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
