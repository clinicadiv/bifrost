"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
// import { useQueryErrorHandler } from "@/hooks/useReactQueryErrorHandler"; // Removido temporariamente
import { queryKeys } from "@/lib/query-keys";
import {
  checkDependentLimit,
  getDependentById,
  getDependentsByUser,
  getDependentStatistics,
  getDependentsWithFilters,
  getMyDependents,
} from "@/services/http/dependents";
import { Dependent, DependentFilters } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para buscar todos os dependentes do usuário logado
 */
export function useMyDependents() {
  const { token } = useAuthStore();
  // const { onError, retry } = useQueryErrorHandler(); // Temporariamente removido

  return useQuery({
    queryKey: queryKeys.dependentsMyList(),

    queryFn: async () => {
      if (!token) {
        throw new Error("Token required");
      }

      const response = await getMyDependents(token);

      if (!response.success) {
        throw new Error(response.message || "Failed to load dependents");
      }

      return response.data;
    },

    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    // onError, // Temporariamente removido
    // retry, // Temporariamente removido
    refetchOnWindowFocus: true,

    // Organizar dados por status
    select: (
      response: {
        subscriptionId: string;
        currentDependents: number;
        dependents: Dependent[];
        maxDependents: number;
        planName: string;
        planType: string;
      }[]
    ) => {
      // Extrair todos os dependentes de todas as assinaturas
      const allDependents = response.flatMap(
        (subscription) => subscription.dependents
      );

      const active = allDependents.filter((dep) => dep.status);
      const inactive = allDependents.filter((dep) => !dep.status);

      // Ordenar por data de criação (mais recente primeiro)
      const sortByDate = (a: Dependent, b: Dependent) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      return {
        all: allDependents.sort(sortByDate),
        active: active.sort(sortByDate),
        inactive: inactive.sort(sortByDate),
        total: allDependents.length,
        activeCount: active.length,
        inactiveCount: inactive.length,
        subscriptions: response, // Manter dados das assinaturas para referência
      };
    },
  });
}

/**
 * Hook para buscar dependentes com filtros e paginação
 */
export function useDependentsWithFilters(filters: DependentFilters) {
  const { token } = useAuthStore();
  // const { onError, retry } = useQueryErrorHandler(); // Temporariamente removido

  return useQuery({
    queryKey: queryKeys.dependentsList(filters),

    queryFn: async () => {
      if (!token) {
        throw new Error("Token required");
      }

      const response = await getDependentsWithFilters(filters, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to load dependents");
      }

      return response.data;
    },

    enabled: !!token,
    staleTime: 3 * 60 * 1000, // 3 minutos (dados com filtros podem mudar mais)
    gcTime: 8 * 60 * 1000,
    // onError, // Temporariamente removido
    // retry, // Temporariamente removido
    // keepPreviousData: true, // Removido no React Query v5 // Para paginação suave
  });
}

/**
 * Hook para buscar dependentes por ID do usuário
 */
export function useDependentsByUser(userId: string) {
  const { token } = useAuthStore();
  // const { onError, retry } = useQueryErrorHandler(); // Temporariamente removido

  return useQuery({
    queryKey: queryKeys.dependentsByUser(userId),

    queryFn: async () => {
      if (!token) {
        throw new Error("Token required");
      }

      const response = await getDependentsByUser(userId, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to load user dependents");
      }

      return response.data;
    },

    enabled: !!token && !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    // onError, // Temporariamente removido
    // retry, // Temporariamente removido
  });
}

/**
 * Hook para buscar um dependente específico por ID
 */
export function useDependentById(id: string) {
  const { token } = useAuthStore();
  // const { onError, retry } = useQueryErrorHandler(); // Temporariamente removido

  return useQuery({
    queryKey: queryKeys.dependentDetail(id),

    queryFn: async () => {
      if (!token) {
        throw new Error("Token required");
      }

      const response = await getDependentById(id, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to load dependent");
      }

      return response.data;
    },

    enabled: !!token && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos (dados específicos mudam menos)
    gcTime: 15 * 60 * 1000,
    // onError, // Temporariamente removido
    // retry, // Temporariamente removido
  });
}

/**
 * Hook para buscar estatísticas dos dependentes
 */
export function useDependentStatistics(userId: string) {
  const { token } = useAuthStore();
  // const { onError, retry } = useQueryErrorHandler(); // Temporariamente removido

  return useQuery({
    queryKey: queryKeys.dependentStatistics(userId),

    queryFn: async () => {
      if (!token) {
        throw new Error("Token required");
      }

      const response = await getDependentStatistics(userId, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to load statistics");
      }

      return response.data;
    },

    enabled: !!token && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutos (estatísticas podem mudar frequentemente)
    gcTime: 5 * 60 * 1000,
    // onError, // Temporariamente removido
    // retry, // Temporariamente removido
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook para verificar limite de dependentes
 */
export function useDependentLimitCheck(subscriptionId: string) {
  const { token } = useAuthStore();
  // const { onError, retry } = useQueryErrorHandler(); // Temporariamente removido

  return useQuery({
    queryKey: queryKeys.dependentLimitCheck(subscriptionId),

    queryFn: async () => {
      if (!token) {
        throw new Error("Token required");
      }

      const response = await checkDependentLimit(subscriptionId, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to check limit");
      }

      return response.data;
    },

    enabled: !!token && !!subscriptionId,
    staleTime: 1 * 60 * 1000, // 1 minuto (limite pode mudar rapidamente)
    gcTime: 3 * 60 * 1000,
    // onError, // Temporariamente removido
    // retry, // Temporariamente removido
  });
}

/**
 * Hook combinado para operações de dependentes
 * Simplifica o uso nas páginas
 */
export function useDependentsOperations(userId?: string) {
  const myDependents = useMyDependents();
  const statistics = useDependentStatistics(userId || "");

  return {
    // Dados principais
    dependents: myDependents.data?.all || [],
    activeDependents: myDependents.data?.active || [],
    inactiveDependents: myDependents.data?.inactive || [],

    // Contadores
    totalCount: myDependents.data?.total || 0,
    activeCount: myDependents.data?.activeCount || 0,
    inactiveCount: myDependents.data?.inactiveCount || 0,

    // Dados das assinaturas
    subscriptions: myDependents.data?.subscriptions || [],

    // Estatísticas
    statistics: statistics.data,

    // Estados de loading - separados para melhor controle
    isLoading: myDependents.isPending, // Apenas dependentes para mostrar estado vazio mais rápido
    isLoadingStatistics: statistics.isPending,
    isLoadingAll: myDependents.isPending || statistics.isPending, // Loading geral
    isRefetching: myDependents.isRefetching || statistics.isRefetching,
    isFetching: myDependents.isFetching || statistics.isFetching,

    // Estados de erro
    error: myDependents.error || statistics.error,
    hasError: !!myDependents.error || !!statistics.error,

    // Funções de refetch
    refetch: () => {
      myDependents.refetch();
      statistics.refetch();
    },
    refetchDependents: myDependents.refetch,
    refetchStatistics: statistics.refetch,

    // Metadados
    dataUpdatedAt: Math.max(
      myDependents.dataUpdatedAt || 0,
      statistics.dataUpdatedAt || 0
    ),
    isStale: myDependents.isStale || statistics.isStale,
  };
}
