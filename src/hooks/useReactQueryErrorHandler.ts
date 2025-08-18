"use client";

import { ErrorContext } from "@/utils/errorHandler/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useErrorHandler } from "./useErrorHandler";

/**
 * Hook especializado para integrar React Query com nosso sistema de Error Handler
 *
 * Fornece callbacks otimizados para usar em queries e mutations
 */
export function useReactQueryErrorHandler() {
  const { handleError: baseHandleError, withRetry } = useErrorHandler({
    showModal: true,
    showToast: false,
    autoRetry: false, // React Query já gerencia retry
  });
  const queryClient = useQueryClient();

  // Handler para queries
  const handleQueryError = useCallback(
    (error: any, queryKey?: unknown[], context?: ErrorContext) => {
      // Contexto adicional para queries
      const queryContext: ErrorContext = {
        ...context,
        endpoint: extractEndpointFromError(error),
      };

      // Log específico para queries
      if (process.env.NODE_ENV === "development") {
        console.group(`[ReactQuery] Query Error`);
        console.log("Query Key:", queryKey);
        console.log("Error:", error);
        console.log("Context:", queryContext);
        console.groupEnd();
      }

      return baseHandleError(error, queryContext);
    },
    [baseHandleError]
  );

  // Handler para mutations
  const handleMutationError = useCallback(
    (error: any, variables?: any, context?: ErrorContext) => {
      // Contexto adicional para mutations
      const mutationContext: ErrorContext = {
        ...context,
        endpoint: extractEndpointFromError(error),
      };

      // Log específico para mutations
      if (process.env.NODE_ENV === "development") {
        console.group(`[ReactQuery] Mutation Error`);
        console.log("Variables:", variables);
        console.log("Error:", error);
        console.log("Context:", mutationContext);
        console.groupEnd();
      }

      return baseHandleError(error, mutationContext);
    },
    [baseHandleError]
  );

  // Handler para retry customizado em queries
  const shouldRetryQuery = useCallback((failureCount: number, error: any) => {
    // Usa a mesma lógica do nosso error handler
    const axiosError = error as any;
    const status = axiosError?.response?.status;
    const errorCode = axiosError?.code;

    // Não retry em erros de client (4xx) exceto timeout e rate limit
    if (status >= 400 && status < 500) {
      if (status === 408 || status === 429) {
        return failureCount < 2;
      }
      return false;
    }

    // Não retry em erros de network específicos
    if (errorCode === "NETWORK_ERROR" || errorCode === "ECONNABORTED") {
      return failureCount < 1;
    }

    // Retry em erros de servidor até 3 vezes
    return failureCount < 3;
  }, []);

  // Invalidar queries relacionadas a um usuário
  const invalidateUserQueries = useCallback(
    (userId: string) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return JSON.stringify(query.queryKey).includes(userId);
        },
      });
    },
    [queryClient]
  );

  // Invalidar queries por padrão
  const invalidateQueriesByPattern = useCallback(
    (pattern: string) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return JSON.stringify(query.queryKey).includes(pattern);
        },
      });
    },
    [queryClient]
  );

  // Limpar cache de usuário (ex: logout)
  const clearUserCache = useCallback(
    (userId: string) => {
      queryClient.removeQueries({
        predicate: (query) => {
          return JSON.stringify(query.queryKey).includes(userId);
        },
      });
    },
    [queryClient]
  );

  // Optimistic update helper
  const createOptimisticUpdate = useCallback(
    <T>(
      queryKey: unknown[],
      updater: (old: T | undefined) => T,
      rollback?: (context: any) => void
    ) => {
      return {
        onMutate: async (variables: any) => {
          // Cancel ongoing queries
          await queryClient.cancelQueries({ queryKey });

          // Snapshot previous value
          const previousData = queryClient.getQueryData<T>(queryKey);

          // Optimistically update
          queryClient.setQueryData<T>(queryKey, updater);

          return { previousData, variables };
        },

        onError: (error: any, variables: any, context: any) => {
          // Rollback on error
          if (context?.previousData) {
            queryClient.setQueryData(queryKey, context.previousData);
          }

          if (rollback) {
            rollback(context);
          }

          handleMutationError(error, variables);
        },

        onSettled: () => {
          // Always refetch after mutation
          queryClient.invalidateQueries({ queryKey });
        },
      };
    },
    [queryClient, handleMutationError]
  );

  return {
    // Error handlers
    handleQueryError,
    handleMutationError,
    shouldRetryQuery,

    // Cache management
    invalidateUserQueries,
    invalidateQueriesByPattern,
    clearUserCache,

    // Utilities
    createOptimisticUpdate,

    // Direct access to base handler
    withRetry,
  };
}

// Utility para extrair endpoint do erro
function extractEndpointFromError(error: any): string | undefined {
  if (error?.config?.url) {
    return error.config.url;
  }

  if (error?.request?.responseURL) {
    return error.request.responseURL;
  }

  return undefined;
}

// Hook simplificado para uso comum
export function useQueryErrorHandler() {
  const { handleQueryError, shouldRetryQuery } = useReactQueryErrorHandler();

  return {
    onError: handleQueryError,
    retry: shouldRetryQuery,
  };
}

// Hook simplificado para mutations
export function useMutationErrorHandler() {
  const { handleMutationError } = useReactQueryErrorHandler();

  return {
    onError: handleMutationError,
  };
}
