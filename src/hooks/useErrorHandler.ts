"use client";

import { errorHandler } from "@/utils/errorHandler/ErrorHandler";
import {
  ErrorAction,
  ErrorContext,
  ErrorHandlerResult,
  RetryConfig,
  StandardErrorResponse,
} from "@/utils/errorHandler/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UseErrorHandlerOptions {
  showToast?: boolean;
  showModal?: boolean;
  autoRetry?: boolean;
  retryConfig?: Partial<RetryConfig>;
  onError?: (error: StandardErrorResponse, result: ErrorHandlerResult) => void;
}

interface ErrorState {
  currentError: StandardErrorResponse | null;
  isRetrying: boolean;
  retryAttempts: number;
  history: StandardErrorResponse[];
}

interface ToastState {
  id: string;
  error: StandardErrorResponse;
  result: ErrorHandlerResult;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  // Define padrões que favorecem modal sobre toast
  const defaultOptions = {
    showToast: false,
    showModal: true,
    ...options,
  };
  const router = useRouter();
  const [errorState, setErrorState] = useState<ErrorState>({
    currentError: null,
    isRetrying: false,
    retryAttempts: 0,
    history: [],
  });

  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [modalError, setModalError] = useState<{
    error: StandardErrorResponse;
    result: ErrorHandlerResult;
  } | null>(null);

  // Configura retry se fornecido
  useEffect(() => {
    if (defaultOptions.retryConfig) {
      errorHandler.configureRetry(defaultOptions.retryConfig);
    }
  }, [defaultOptions.retryConfig]);

  // Listener para mudanças no estado do error handler
  useEffect(() => {
    const unsubscribe = errorHandler.addListener((error, result) => {
      setErrorState(errorHandler.getState());
      defaultOptions.onError?.(error, result);

      // Decide como exibir o erro baseado nas opções e no resultado
      // Prioriza modal sobre toast para melhor experiência do usuário
      if (
        result.action === "show-modal" ||
        (defaultOptions.showModal !== false &&
          result.action !== "show-toast" &&
          result.action !== "highlight-field" &&
          result.action !== "show-inline" &&
          result.action !== "redirect-login" &&
          result.action !== "redirect-payment" &&
          result.action !== "retry" &&
          result.action !== "ignore")
      ) {
        setModalError({ error, result });
      } else if (
        result.action === "show-toast" ||
        (defaultOptions.showToast === true &&
          defaultOptions.showModal === false)
      ) {
        addToast(error, result);
      }
    });

    return unsubscribe;
  }, [defaultOptions]);

  // Função para processar um erro
  const handleError = useCallback(
    (error: any, context?: ErrorContext): ErrorHandlerResult => {
      return errorHandler.handleError(error, context);
    },
    []
  );

  // Função para executar com retry automático
  const withRetry = useCallback(
    async <T>(fn: () => Promise<T>, context?: ErrorContext): Promise<T> => {
      setErrorState((prev) => ({ ...prev, isRetrying: true }));

      try {
        return await errorHandler.withRetry(fn, context);
      } finally {
        setErrorState((prev) => ({ ...prev, isRetrying: false }));
      }
    },
    []
  );

  // Função para processar erros de validação
  const handleValidationErrors = useCallback(
    (error: StandardErrorResponse, formId?: string): Record<string, string> => {
      return errorHandler.handleValidationErrors(error, formId);
    },
    []
  );

  // Gerenciamento de toasts
  const addToast = useCallback(
    (error: StandardErrorResponse, result: ErrorHandlerResult) => {
      const id = `toast_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      setToasts((prev) => [...prev, { id, error, result }]);

      // Auto-remove toast após 5 segundos se não for crítico
      if (
        !["authentication", "authorization", "payment"].includes(
          error.category || ""
        )
      ) {
        setTimeout(() => {
          removeToast(id);
        }, 5000);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Ações de erro
  const handleAction = useCallback(
    (action: ErrorAction, error?: StandardErrorResponse) => {
      switch (action) {
        case "retry":
          // Retry será tratado automaticamente pelo withRetry
          break;

        case "redirect-login":
          router.push("/login");
          break;

        case "redirect-payment":
          router.push("/planos");
          break;

        case "show-modal":
          if (error) {
            const result = errorHandler.handleError(error);
            setModalError({ error, result });
          }
          break;

        case "show-toast":
          if (error) {
            const result = errorHandler.handleError(error);
            addToast(error, result);
          }
          break;

        case "report-bug":
          // TODO: Implementar relatório de bug
          console.log("Reportar bug:", error);
          break;

        default:
          break;
      }
    },
    [router, addToast]
  );

  // Função para limpar erros
  const clearError = useCallback(() => {
    errorHandler.clearError();
    setErrorState({
      currentError: null,
      isRetrying: false,
      retryAttempts: 0,
      history: [],
    });
  }, []);

  const clearModal = useCallback(() => {
    setModalError(null);
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    // Estado
    errorState,
    toasts,
    modalError,
    isRetrying: errorState.isRetrying,

    // Funções principais
    handleError,
    withRetry,
    handleValidationErrors,

    // Ações
    handleAction,

    // Limpeza
    clearError,
    clearModal,
    clearToasts,
    removeToast,

    // Utilidades
    shouldShowToUser: errorHandler.shouldShowToUser.bind(errorHandler),
    getSuggestions: errorHandler.getSuggestions.bind(errorHandler),
    cancelRetries: errorHandler.cancelRetries.bind(errorHandler),
  };
}

// Hook específico para formulários
export function useFormErrorHandler() {
  const { handleError, handleValidationErrors, clearError } = useErrorHandler({
    showToast: false,
    showModal: false,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>("");

  const processFormError = useCallback(
    (error: any, formId?: string) => {
      const result = handleError(error);
      const standardError = error as StandardErrorResponse;

      if (standardError.category === "validation" && standardError.errors) {
        const errors = handleValidationErrors(standardError, formId);
        setFieldErrors(errors);
        setGeneralError("");
      } else {
        setFieldErrors({});
        setGeneralError(result.message);
      }

      return result;
    },
    [handleError, handleValidationErrors]
  );

  const clearFormErrors = useCallback(() => {
    setFieldErrors({});
    setGeneralError("");
    clearError();
  }, [clearError]);

  const clearFieldError = useCallback((fieldName: string) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    fieldErrors,
    generalError,
    processFormError,
    clearFormErrors,
    clearFieldError,
    hasErrors: Object.keys(fieldErrors).length > 0 || !!generalError,
  };
}

// Hook para retry manual
export function useRetry() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(
    async <T>(fn: () => Promise<T>, maxRetries: number = 3): Promise<T> => {
      if (retryCount >= maxRetries) {
        throw new Error("Número máximo de tentativas excedido");
      }

      setIsRetrying(true);
      setRetryCount((prev) => prev + 1);

      try {
        const result = await fn();
        setRetryCount(0); // Reset on success
        return result;
      } catch (error) {
        if (retryCount + 1 < maxRetries) {
          // Aguarda antes do próximo retry
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, retryCount))
          );
          return retry(fn, maxRetries);
        }
        throw error;
      } finally {
        setIsRetrying(false);
      }
    },
    [retryCount]
  );

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    retry,
    reset,
    isRetrying,
    retryCount,
    canRetry: retryCount < 3,
  };
}
