import { useAuthStore } from "@/hooks/useAuthStore";
import { useReactQueryErrorHandler } from "@/hooks/useReactQueryErrorHandler";
import { queryKeys } from "@/lib/query-keys";
import {
  createPayment,
  type CreatePaymentData,
} from "@/services/http/payments";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Hooks de pagamento simplificados - funcionalidades específicas removidas temporariamente

/**
 * Hook para criar pagamento genérico
 */
export function useCreatePayment() {
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();
  const { handleMutationError } = useReactQueryErrorHandler();

  return useMutation({
    mutationFn: async (params: CreatePaymentData) => {
      if (!token) throw new Error("Token required");
      return createPayment(params);
    },

    onSuccess: (data, params: CreatePaymentData) => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.appointmentsByUser(user.id),
        });

        if (params.appointmentId) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.appointmentDetail(params.appointmentId),
          });
        }

        // Invalidação de installments removida temporariamente
      }
    },

    onError: (error) => {
      handleMutationError(error, {
        endpoint: "/api/payments",
      });
    },
  });
}
