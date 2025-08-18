"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useQueryErrorHandler } from "@/hooks/useReactQueryErrorHandler";
import { queryKeys } from "@/lib/query-keys";
import { getUserBenefits } from "@/services/http/user-subscriptions";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook React Query para benefícios do usuário
 *
 * Benefícios mudam com pouca frequência, então pode ter cache mais longo
 */
export function useUserBenefits(userId: string) {
  const { token } = useAuthStore();
  const { onError, retry } = useQueryErrorHandler();

  return useQuery({
    queryKey: queryKeys.userBenefits(userId),

    queryFn: async () => {
      if (!token) throw new Error("Token required");
      return getUserBenefits(userId, token);
    },

    enabled: !!userId && !!token,

    // Cache mais longo para benefícios (mudam raramente)
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 60 * 60 * 1000, // 1 hora

    onError,
    retry,

    // Não refetch automaticamente (dados estáveis)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/**
 * Hook para verificar se usuário tem benefício específico
 */
export function useHasBenefit(userId: string, benefitType: string) {
  const benefits = useUserBenefits(userId);

  return {
    ...benefits,
    hasBenefit:
      benefits.data?.benefits?.some(
        (benefit: any) => benefit.type === benefitType && benefit.active
      ) || false,
  };
}

/**
 * Hook para benefícios ativos apenas
 */
export function useActiveBenefits(userId: string) {
  const benefits = useUserBenefits(userId);

  return {
    ...benefits,
    activeBenefits:
      benefits.data?.benefits?.filter((benefit: any) => benefit.active) || [],
  };
}
