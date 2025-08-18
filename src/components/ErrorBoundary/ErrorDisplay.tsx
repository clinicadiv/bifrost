"use client";

import { useErrorHandler } from "@/hooks/useErrorHandler";
import React from "react";
import { ErrorModal } from "./ErrorModal";
import { ToastManager } from "./ErrorToast";

/**
 * Componente principal que gerencia a exibição de erros
 * Deve ser colocado no root da aplicação
 */
export const ErrorDisplay: React.FC = () => {
  const { toasts, modalError, handleAction, removeToast, clearModal } =
    useErrorHandler();

  return (
    <>
      {/* Toast Manager */}
      <ToastManager
        toasts={toasts}
        onClose={removeToast}
        onAction={(id, action) => {
          const toast = toasts.find((t) => t.id === id);
          if (toast) {
            handleAction(action, toast.error);
          }
          removeToast(id);
        }}
      />

      {/* Modal de Erro */}
      {modalError && (
        <ErrorModal
          error={modalError.error}
          result={modalError.result}
          isOpen={true}
          onClose={clearModal}
          onAction={(action) => {
            handleAction(action, modalError.error);
            clearModal();
          }}
        />
      )}
    </>
  );
};
