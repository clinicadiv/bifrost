"use client";

import {
  ErrorAction,
  ErrorHandlerResult,
  StandardErrorResponse,
} from "@/utils/errorHandler/types";
import {
  ArrowClockwise,
  InfoIcon,
  WarningIcon,
  X,
  XCircleIcon,
} from "@phosphor-icons/react";
import React from "react";

interface ErrorInlineProps {
  error: StandardErrorResponse;
  result: ErrorHandlerResult;
  onClose?: () => void;
  onAction?: (action: ErrorAction) => void;
  variant?: "default" | "compact" | "field";
  className?: string;
}

export const ErrorInline: React.FC<ErrorInlineProps> = ({
  error,
  result,
  onClose,
  onAction,
  variant = "default",
  className = "",
}) => {
  const handleAction = (action: ErrorAction) => {
    onAction?.(action);
  };

  const getIcon = () => {
    const iconProps = {
      size: variant === "compact" ? 16 : 18,
      weight: "bold" as const,
    };

    switch (error.category) {
      case "validation":
        return <WarningIcon {...iconProps} className="text-amber-500" />;
      case "authentication":
      case "authorization":
        return <XCircleIcon {...iconProps} className="text-red-500" />;
      case "not-found":
        return <InfoIcon {...iconProps} className="text-blue-500" />;
      default:
        return <XCircleIcon {...iconProps} className="text-red-500" />;
    }
  };

  const getColorClasses = () => {
    switch (error.category) {
      case "validation":
        return {
          bg: "bg-amber-50 dark:bg-amber-900/20",
          border: "border-amber-200 dark:border-amber-800",
          text: "text-amber-800 dark:text-amber-200",
        };
      case "authentication":
      case "authorization":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-800 dark:text-red-200",
        };
      case "not-found":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-800 dark:text-blue-200",
        };
      default:
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-800 dark:text-red-200",
        };
    }
  };

  const colors = getColorClasses();

  // Variant: Field (para erros de validação em campos específicos)
  if (variant === "field") {
    return (
      <div className={`flex items-center gap-2 mt-1 ${className}`}>
        {getIcon()}
        <span className={`text-sm ${colors.text}`}>{result.message}</span>
      </div>
    );
  }

  // Variant: Compact (versão mais compacta)
  if (variant === "compact") {
    return (
      <div
        className={`flex items-center justify-between ${colors.bg} ${colors.border} border rounded-lg px-3 py-2 ${className}`}
      >
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className={`text-sm font-medium ${colors.text}`}>
            {result.message}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {result.retryable && (
            <button
              onClick={() => handleAction("retry")}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
              title="Tentar novamente"
            >
              <ArrowClockwise size={14} className={colors.text} />
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
            >
              <X size={14} className={colors.text} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Variant: Default (versão completa)
  return (
    <div
      className={`${colors.bg} ${colors.border} border rounded-xl p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`font-semibold text-sm ${colors.text}`}>
              {result.title}
            </h4>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={16} className="text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>

          <p className={`text-sm mt-1 ${colors.text} opacity-90`}>
            {result.message}
          </p>

          {/* Error details for development */}
          {process.env.NODE_ENV === "development" && error.code && (
            <p className="text-xs mt-2 opacity-60 font-mono">
              {error.code} • {error.status}
            </p>
          )}

          {/* Action buttons */}
          {(result.retryable || result.context?.customActions) && (
            <div className="flex items-center gap-2 mt-3">
              {result.retryable && (
                <button
                  onClick={() => handleAction("retry")}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white/80 dark:bg-black/20 hover:bg-white dark:hover:bg-black/30 rounded-lg transition-colors"
                >
                  <ArrowClockwise size={12} />
                  Tentar novamente
                </button>
              )}

              {result.action === "redirect-login" && (
                <button
                  onClick={() => handleAction("redirect-login")}
                  className="px-3 py-1.5 text-xs font-medium bg-div-green text-white hover:bg-emerald-600 rounded-lg transition-colors"
                >
                  Fazer login
                </button>
              )}

              {result.action === "redirect-payment" && (
                <button
                  onClick={() => handleAction("redirect-payment")}
                  className="px-3 py-1.5 text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Ver planos
                </button>
              )}

              {result.context?.customActions?.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    action.type === "primary"
                      ? "bg-div-green text-white hover:bg-emerald-600"
                      : action.type === "danger"
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-white/80 dark:bg-black/20 hover:bg-white dark:hover:bg-black/30"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para erros de validação em formulários
interface FormErrorProps {
  errors: Record<string, string>;
  fieldName?: string;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  errors,
  fieldName,
  className = "",
}) => {
  if (fieldName) {
    const error = errors[fieldName];
    if (!error) return null;

    return (
      <div className={`flex items-center gap-2 mt-1 ${className}`}>
        <WarningIcon size={16} weight="bold" className="text-red-500" />
        <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
      </div>
    );
  }

  // Mostra todos os erros
  const errorEntries = Object.entries(errors);
  if (errorEntries.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {errorEntries.map(([field, message]) => (
        <div key={field} className="flex items-center gap-2">
          <WarningIcon size={16} weight="bold" className="text-red-500" />
          <span className="text-sm text-red-600 dark:text-red-400">
            <span className="font-medium capitalize">{field}:</span> {message}
          </span>
        </div>
      ))}
    </div>
  );
};
