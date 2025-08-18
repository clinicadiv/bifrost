"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useQueryErrorHandler } from "@/hooks/useReactQueryErrorHandler";
import { queryKeys } from "@/lib/query-keys";
import { getUserAddresses } from "@/services/http/addresses";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook React Query para endereços do usuário
 *
 * Benefícios:
 * - Cache automático dos endereços
 * - Revalidação inteligente
 * - Error handling integrado
 * - Loading states automáticos
 */
export function useAddresses(userId: string) {
  const { token } = useAuthStore();
  const { onError, retry } = useQueryErrorHandler();

  return useQuery({
    queryKey: queryKeys.addressesByUser(userId),

    queryFn: async () => {
      if (!token) throw new Error("Token required");
      return getUserAddresses(userId, token);
    },

    enabled: !!userId && !!token,

    // Cache otimizado para endereços (mudam raramente)
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos

    onError,
    retry,

    // Transformar dados para facilitar uso
    select: (data) => {
      if (!data.success || !data.data.success) {
        return {
          addresses: [],
          total: 0,
          hasAddresses: false,
        };
      }

      const addresses = Array.isArray(data.data.addresses)
        ? data.data.addresses
        : [];

      return {
        addresses,
        total: addresses.length,
        hasAddresses: addresses.length > 0,
        // Separar por tipo se necessário
        residenciais: addresses.filter((addr) => addr.type === "residential"),
        comerciais: addresses.filter((addr) => addr.type === "commercial"),
        // Endereço principal
        principal: addresses.find((addr) => addr.isDefault) || addresses[0],
      };
    },

    // Não refetch automaticamente (dados estáveis)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/**
 * Hook para buscar endereço específico por ID
 */
export function useAddress(addressId: string) {
  const { user, token } = useAuthStore();
  const addresses = useAddresses(user?.id || "");

  return {
    ...addresses,
    address: addresses.data?.addresses.find((addr) => addr.id === addressId),
    isLoading: addresses.isLoading,
    error: addresses.error,
  };
}

/**
 * Hook para verificar se usuário tem endereços
 */
export function useHasAddresses(userId: string) {
  const addresses = useAddresses(userId);

  return {
    ...addresses,
    hasAddresses: addresses.data?.hasAddresses || false,
    isEmpty: !addresses.data?.hasAddresses && !addresses.isLoading,
  };
}
