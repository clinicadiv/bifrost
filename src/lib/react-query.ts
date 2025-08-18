import { DefaultOptions, QueryClient } from "@tanstack/react-query";

// Configuração otimizada para o sistema
const queryConfig: DefaultOptions = {
  queries: {
    // Cache e Stale Time
    staleTime: 5 * 60 * 1000, // 5 minutos - dados ficam "frescos"
    gcTime: 10 * 60 * 1000, // 10 minutos - tempo no cache após não usar

    // Refetch Behavior
    refetchOnWindowFocus: false, // Não refetch ao focar na janela
    refetchOnReconnect: "always", // Sempre refetch ao reconectar
    refetchOnMount: true, // Refetch ao montar se stale

    // Retry Configuration
    retry: (failureCount, error) => {
      // Integração inteligente com error handler
      const axiosError = error as any;
      const status = axiosError?.response?.status;
      const errorCode = axiosError?.code;

      // Não retry em erros de client (4xx) exceto 408, 429
      if (status >= 400 && status < 500) {
        // Retry apenas em timeout e rate limit
        if (status === 408 || status === 429) {
          return failureCount < 2;
        }
        return false;
      }

      // Não retry em erros de network específicos
      if (errorCode === "NETWORK_ERROR" || errorCode === "ECONNABORTED") {
        return failureCount < 1;
      }

      // Retry em erros de servidor (5xx) até 3 vezes
      return failureCount < 3;
    },

    retryDelay: (attemptIndex) => {
      // Backoff exponencial: 1s, 2s, 4s
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
  },

  mutations: {
    // Mutations não fazem retry por padrão para evitar duplicações
    retry: false,

    // Timeout para mutations (operações críticas)
    networkMode: "online",
  },
};

// Singleton do QueryClient
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,

  // Logger customizado integrado com o sistema
  logger: {
    log: (message) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[ReactQuery] ${message}`);
      }
    },
    warn: (message) => {
      console.warn(`[ReactQuery] ${message}`);
    },
    error: (message) => {
      console.error(`[ReactQuery] ${message}`);
    },
  },
});

// Configuração de cache persistence (opcional para futuro)
export const persistOptions = {
  maxAge: 1000 * 60 * 60 * 24, // 24 horas
  buster: "1.0.0", // Versão para invalidar cache antigo
};

// Utilities para gerenciar cache
export const cacheUtils = {
  // Limpar todo o cache
  clearAll: () => {
    queryClient.clear();
  },

  // Limpar cache de um usuário específico
  clearUserCache: (userId: string) => {
    queryClient.removeQueries({
      predicate: (query) => {
        return JSON.stringify(query.queryKey).includes(userId);
      },
    });
  },

  // Invalidar queries por padrão
  invalidateByPattern: (pattern: string) => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        return JSON.stringify(query.queryKey).includes(pattern);
      },
    });
  },

  // Debug: mostrar status do cache
  debugCache: () => {
    if (process.env.NODE_ENV === "development") {
      const queries = queryClient.getQueryCache().getAll();
      console.table(
        queries.map((query) => ({
          key: JSON.stringify(query.queryKey),
          status: query.state.status,
          dataUpdatedAt: new Date(
            query.state.dataUpdatedAt
          ).toLocaleTimeString(),
          isStale: query.isStale(),
          observers: query.getObserversCount(),
        }))
      );
    }
  },
};
