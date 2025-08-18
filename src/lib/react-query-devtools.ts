"use client";

import { lazy } from "react";

// DevTools para produção (carregamento lazy)
export const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

// Hook para controlar DevTools
export function useDevTools() {
  const isDev = process.env.NODE_ENV === "development";
  const showDevtools =
    isDev || process.env.NEXT_PUBLIC_SHOW_DEVTOOLS === "true";

  return {
    isDev,
    showDevtools,

    // Função para mostrar/esconder DevTools via console
    toggleDevtools: () => {
      if (typeof window !== "undefined") {
        // @ts-ignore
        window.__REACT_QUERY_DEVTOOLS_TOGGLE__ =
          // @ts-ignore
          !window.__REACT_QUERY_DEVTOOLS_TOGGLE__;
      }
    },

    // Debug queries via console
    debugQueries: () => {
      if (typeof window !== "undefined") {
        // @ts-ignore
        const queryClient = window.__REACT_QUERY_CLIENT__;
        if (queryClient) {
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
              cacheTime: query.cacheTime,
              staleTime: query.options.staleTime,
            }))
          );
        }
      }
    },
  };
}

// Configurações dos DevTools
export const devtoolsConfig = {
  // Configuração para desenvolvimento
  development: {
    initialIsOpen: false,
    position: "bottom-right" as const,
    buttonPosition: "bottom-right" as const,
    panelProps: {
      style: {
        zIndex: 99999,
      },
    },
    closeButtonProps: {
      style: {
        fontSize: "12px",
      },
    },
    toggleButtonProps: {
      style: {
        fontSize: "12px",
        padding: "4px 8px",
        backgroundColor: "#0891b2",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      },
    },
  },

  // Configuração para produção (se habilitado)
  production: {
    initialIsOpen: false,
    position: "bottom-left" as const,
    buttonPosition: "bottom-left" as const,
    panelProps: {
      style: {
        zIndex: 99999,
        opacity: 0.9,
      },
    },
  },
};

// Utility para adicionar query client ao window (debug)
export function attachQueryClientToWindow(queryClient: any) {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    // @ts-ignore
    window.__REACT_QUERY_CLIENT__ = queryClient;

    // Adicionar helpers globais
    // @ts-ignore
    window.debugQueries = () => {
      const queries = queryClient.getQueryCache().getAll();
      console.table(
        queries.map((query) => ({
          key: JSON.stringify(query.queryKey),
          status: query.state.status,
          data: query.state.data,
          error: query.state.error,
          isStale: query.isStale(),
          observers: query.getObserversCount(),
        }))
      );
    };

    // @ts-ignore
    window.clearQueryCache = () => {
      queryClient.clear();
      console.log("Query cache cleared");
    };

    // @ts-ignore
    window.invalidateAll = () => {
      queryClient.invalidateQueries();
      console.log("All queries invalidated");
    };

    console.log(
      "%c🚀 React Query Debug Tools Available",
      "color: #0891b2; font-weight: bold; font-size: 14px;"
    );
    console.log("Available commands:");
    console.log("- window.debugQueries() - Show all queries");
    console.log("- window.clearQueryCache() - Clear cache");
    console.log("- window.invalidateAll() - Invalidate all queries");
  }
}
