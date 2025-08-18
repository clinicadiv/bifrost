"use client";

import {
  ErrorAction,
  ErrorHandlerResult,
  StandardErrorResponse,
} from "@/utils/errorHandler/types";
import {
  ArrowClockwise,
  Bug,
  Copy,
  InfoIcon,
  LinkSimple,
  WarningIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import React, { useEffect, useRef } from "react";

interface ErrorModalProps {
  error: StandardErrorResponse;
  result: ErrorHandlerResult;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (action: ErrorAction) => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  error,
  result,
  isOpen,
  onClose,
  onAction,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleAction = (action: ErrorAction) => {
    onAction?.(action);
    onClose();
  };

  const copyErrorDetails = async () => {
    const details = {
      code: error.code,
      category: error.category,
      status: error.status,
      message: error.title,
      detail: error.detail,
      timestamp: error.timestamp,
      requestId: error.requestId,
      instance: error.instance,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(details, null, 2));
      // TODO: Show success feedback
    } catch (err) {
      console.error("Erro ao copiar detalhes:", err);
    }
  };

  const getIcon = () => {
    const iconProps = { size: 48, weight: "duotone" as const };

    switch (error.category) {
      case "validation":
        return (
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <WarningIcon {...iconProps} className="text-amber-500" />
          </div>
        );
      case "authentication":
      case "authorization":
        return (
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <XCircleIcon {...iconProps} className="text-red-500" />
          </div>
        );
      case "not-found":
        return (
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <InfoIcon {...iconProps} className="text-blue-500" />
          </div>
        );
      case "external-service":
      case "internal":
        return (
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Bug {...iconProps} className="text-red-500" />
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <XCircleIcon {...iconProps} className="text-gray-500" />
          </div>
        );
    }
  };

  const getSuggestions = () => {
    if (error.suggestions && Array.isArray(error.suggestions)) {
      return error.suggestions;
    }

    // Sugestões padrão baseadas na categoria
    switch (error.category) {
      case "validation":
        return [
          "Verifique os dados informados",
          "Certifique-se de que todos os campos obrigatórios estão preenchidos",
        ];
      case "authentication":
        return ["Faça login novamente", "Verifique suas credenciais"];
      case "authorization":
        return [
          "Entre em contato com o suporte se precisar de mais permissões",
          "Verifique se sua assinatura está ativa",
        ];
      case "rate-limit":
        return [
          "Aguarde alguns minutos antes de tentar novamente",
          "Evite fazer muitas requisições em pouco tempo",
        ];
      case "payment":
        return [
          "Verifique os dados do cartão",
          "Certifique-se de que há limite disponível",
        ];
      case "external-service":
        return [
          "Tente novamente em alguns minutos",
          "Verifique sua conexão com a internet",
        ];
      default:
        return [
          "Tente novamente",
          "Entre em contato com o suporte se o problema persistir",
        ];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/25 dark:shadow-black/40 border border-gray-200/50 dark:border-slate-700/50 animate-scale-in"
        >
          {/* Header */}
          <div className="relative p-6 text-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <XIcon size={20} className="text-gray-500 dark:text-gray-400" />
            </button>

            <div className="flex justify-center mb-4">{getIcon()}</div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
              {result.title}
            </h3>

            <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
              {result.message}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            {/* Suggestions */}
            {getSuggestions().length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
                  O que você pode fazer:
                </h4>
                <ul className="space-y-2">
                  {getSuggestions().map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-div-green rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-slate-300">
                        {suggestion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Error Details (Development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                    Detalhes técnicos
                  </h4>
                  <button
                    onClick={copyErrorDetails}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    title="Copiar detalhes"
                  >
                    <Copy
                      size={14}
                      className="text-gray-600 dark:text-slate-400"
                    />
                  </button>
                </div>
                <div className="space-y-1 text-xs font-mono text-gray-600 dark:text-slate-400">
                  <div>Código: {error.code}</div>
                  <div>Status: {error.status}</div>
                  <div>Categoria: {error.category}</div>
                  {error.requestId && <div>Request ID: {error.requestId}</div>}
                  {error.timestamp && <div>Timestamp: {error.timestamp}</div>}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {/* Primary Actions */}
              <div className="flex gap-3">
                {result.retryable && (
                  <button
                    onClick={() => handleAction("retry")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-div-green text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
                  >
                    <ArrowClockwise size={16} />
                    Tentar novamente
                  </button>
                )}

                {result.action === "redirect-login" && (
                  <button
                    onClick={() => handleAction("redirect-login")}
                    className="flex-1 px-4 py-3 bg-div-green text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
                  >
                    Fazer login
                  </button>
                )}

                {result.action === "redirect-payment" && (
                  <button
                    onClick={() => handleAction("redirect-payment")}
                    className="flex-1 px-4 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Ver planos
                  </button>
                )}

                {!result.retryable &&
                  result.action !== "redirect-login" &&
                  result.action !== "redirect-payment" && (
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-3 bg-div-green text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
                    >
                      Entendi
                    </button>
                  )}
              </div>

              {/* Custom Actions */}
              {result.context?.customActions &&
                result.context.customActions.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {result.context.customActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`px-4 py-2.5 font-medium rounded-xl transition-colors ${
                          action.type === "primary"
                            ? "bg-div-green text-white hover:bg-emerald-600"
                            : action.type === "danger"
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

              {/* Documentation Link */}
              {error.documentation && (
                <button
                  onClick={() => window.open(error.documentation, "_blank")}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition-colors"
                >
                  <LinkSimple size={14} />
                  Ver documentação
                </button>
              )}

              {/* Support Contact */}
              {error.supportContact && (
                <p className="text-xs text-center text-gray-600 dark:text-slate-400">
                  Precisa de ajuda? Entre em contato: {error.supportContact}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
