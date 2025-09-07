import { useAuthStore } from "@/hooks/useAuthStore";
import { useReactQueryErrorHandler } from "@/hooks/useReactQueryErrorHandler";
import { queryKeys } from "@/lib/query-keys";
import {
  createDependent,
  deleteDependent,
  reactivateDependent,
  updateDependent,
  validateDependentForPlan,
} from "@/services/http/dependents";
import type {
  CreateDependentDTO,
  UpdateDependentDTO,
  ValidateDependentForPlanDTO,
} from "@/types/Dependent";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook para criar dependente
 */
export function useCreateDependent() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { token } = useAuthStore();
  // user não utilizado neste hook

  return useMutation({
    mutationFn: async (data: CreateDependentDTO) => {
      if (!token) throw new Error("Token required");
      return createDependent(data, token);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.dependentsMyList(),
      });
    },

    onError: (error) => {
      handleMutationError(error, {
        endpoint: "/api/dependents",
      });
    },
  });
}

/**
 * Hook para atualizar dependente
 */
export function useUpdateDependent() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async (variables: { id: string; data: UpdateDependentDTO }) => {
      if (!token) throw new Error("Token required");
      return updateDependent(variables.id, variables.data, token);
    },

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.dependentDetail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.dependentsMyList(),
      });
    },

    onError: (error) => {
      handleMutationError(error, {
        endpoint: "/api/dependents",
      });
    },
  });
}

/**
 * Hook para deletar dependente
 */
export function useDeleteDependent() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async (dependentId: string) => {
      if (!token) throw new Error("Token required");
      return deleteDependent(dependentId, token);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.dependentsMyList(),
      });
    },

    onError: (error) => {
      handleMutationError(error, {
        endpoint: "/api/dependents",
      });
    },
  });
}

/**
 * Hook para reativar dependente
 */
export function useReactivateDependent() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async (dependentId: string) => {
      if (!token) throw new Error("Token required");
      return reactivateDependent(dependentId, token);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.dependentsMyList(),
      });
    },

    onError: (error) => {
      handleMutationError(error, {
        endpoint: "/api/dependents",
      });
    },
  });
}

/**
 * Hook para validar dependente para plano
 */
export function useValidateDependentForPlan() {
  const { handleMutationError } = useReactQueryErrorHandler();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async (data: ValidateDependentForPlanDTO) => {
      if (!token) throw new Error("Token required");
      return validateDependentForPlan(data, token);
    },

    onError: (error) => {
      handleMutationError(error, {
        endpoint: "/api/dependents",
      });
    },
  });
}
