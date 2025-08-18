"use client";

import { errorHandler } from "@/utils/errorHandler/ErrorHandler";
import { StandardErrorResponse } from "@/utils/errorHandler/types";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorModal } from "./ErrorModal";

interface Props {
  children: ReactNode;
  fallback?: (error: StandardErrorResponse, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: StandardErrorResponse | null;
  errorId: string | null;
}

/**
 * Error Boundary que captura erros React e os processa através do sistema de erro
 */
export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private readonly maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Gera um ID único para este erro
    const errorId = `boundary_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Normaliza o erro JavaScript para StandardErrorResponse
    const standardError: StandardErrorResponse = {
      type: "https://api.clinica.com/errors/internal/react-error",
      title: "Erro na aplicação",
      status: 500,
      detail: error.message || "Erro desconhecido na interface",
      instance: window.location.pathname,
      code: "REACT_ERROR",
      category: "internal",
      requestId: errorId,
      timestamp: new Date().toISOString(),
      metadata: {
        retryable: true,
      },
      context: {
        userAgent: navigator.userAgent,
        endpoint: window.location.href,
        method: "RENDER",
      },
    };

    return {
      hasError: true,
      error: standardError,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Processa o erro através do sistema centralizado
    if (this.state.error) {
      const result = errorHandler.handleError(this.state.error);

      // Log estruturado do erro React
      console.error("[ErrorBoundary] React Error:", {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        retryCount: this.retryCount,
        result,
      });
    }

    // Chama callback customizado se fornecido
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorId: null,
      });
    }
  };

  private handleReset = () => {
    this.retryCount = 0;
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const result = errorHandler.handleError(this.state.error);

      // Se há um fallback customizado, usa ele
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Fallback padrão com modal de erro
      return (
        <>
          {this.props.children}
          <ErrorModal
            error={this.state.error}
            result={result}
            isOpen={true}
            onClose={this.handleReset}
            onAction={(action) => {
              if (action === "retry") {
                this.handleRetry();
              } else if (action === "report-bug") {
                // TODO: Implementar relatório de bug
                console.log("Reportar bug:", this.state.error);
              }
            }}
          />
        </>
      );
    }

    return this.props.children;
  }
}

// HOC para envolver componentes com Error Boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, "children">
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

// Error Boundary específico para páginas
interface PageErrorBoundaryProps extends Props {
  pageTitle?: string;
}

export const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({
  children,
  pageTitle,
  ...props
}) => {
  const customFallback = (error: StandardErrorResponse, retry: () => void) => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
          Erro na página{pageTitle ? `: ${pageTitle}` : ""}
        </h2>

        <p className="text-gray-600 dark:text-slate-400 mb-6">
          Ocorreu um erro inesperado. Nossa equipe foi notificada.
        </p>

        <div className="space-y-3">
          <button
            onClick={retry}
            className="w-full px-4 py-3 bg-div-green text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Tentar novamente
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            Voltar ao início
          </button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">
              Detalhes técnicos
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 dark:bg-slate-700 rounded-lg text-xs overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );

  return (
    <ErrorBoundary {...props} fallback={customFallback}>
      {children}
    </ErrorBoundary>
  );
};
