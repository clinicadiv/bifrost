"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useQueryErrorHandler } from "@/hooks/useReactQueryErrorHandler";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook de exemplo para testar a configuração do React Query
 *
 * Este hook demonstra:
 * - Como usar query keys
 * - Integração com error handler
 * - Conditional queries
 * - TypeScript inference
 */
export function useExampleQuery() {
  const { user, token } = useAuthStore();
  const { onError, retry } = useQueryErrorHandler();

  return useQuery({
    // Query key usando nossa factory
    queryKey: queryKeys.userProfile(user?.id || ""),

    // Query function
    queryFn: async () => {
      if (!user?.id || !token) {
        throw new Error("User not authenticated");
      }

      // Simular uma API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        lastUpdated: new Date().toISOString(),
      };
    },

    // Só executa se tiver user e token
    enabled: !!user?.id && !!token,

    // Integração com nosso error handler
    onError,
    retry,

    // Cache por 5 minutos
    staleTime: 5 * 60 * 1000,

    // Transformar dados se necessário
    select: (data) => ({
      ...data,
      displayName: data.name || data.email,
      isActive: true,
    }),
  });
}

// Hook simples para testar DevTools
export function useTestQuery() {
  return useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        message: "React Query está funcionando!",
        timestamp: new Date().toISOString(),
        random: Math.random(),
      };
    },
    refetchInterval: 10000, // Refetch a cada 10s para ver no DevTools
  });
}
