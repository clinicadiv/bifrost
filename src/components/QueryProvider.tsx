"use client";

import { queryClient } from "@/lib/react-query";
import {
  attachQueryClientToWindow,
  devtoolsConfig,
} from "@/lib/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Anexar query client ao window para debug (apenas em dev)
  useEffect(() => {
    attachQueryClientToWindow(queryClient);
  }, []);

  const isDev = process.env.NODE_ENV === "development";
  const config = isDev ? devtoolsConfig.development : devtoolsConfig.production;

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* React Query DevTools */}
      <ReactQueryDevtools
        initialIsOpen={config.initialIsOpen}
        position={config.position}
        buttonPosition={config.buttonPosition}
        panelProps={config.panelProps}
        toggleButtonProps={config.toggleButtonProps}
      />
    </QueryClientProvider>
  );
}
