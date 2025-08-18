"use client";

import {
  ErrorAction,
  ErrorHandlerResult,
  StandardErrorResponse,
} from "@/utils/errorHandler/types";
import {
  ArrowClockwise,
  Bug,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";

interface ErrorToastProps {
  error: StandardErrorResponse;
  result: ErrorHandlerResult;
  isVisible: boolean;
  onClose: () => void;
  onAction?: (action: ErrorAction) => void;
  autoClose?: boolean;
  duration?: number;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({
  error,
  result,
  isVisible,
  onClose,
  onAction,
  autoClose = true,
  duration = 5000,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isVisible || !autoClose) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 100);
        if (newProgress <= 0) {
          handleClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible, autoClose, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleAction = (action: ErrorAction) => {
    onAction?.(action);
    handleClose();
  };

  const getIcon = () => {
    const iconProps = { size: 20, weight: "bold" as const };

    switch (error.category) {
      case "validation":
        return <WarningIcon {...iconProps} className="text-amber-500" />;
      case "authentication":
      case "authorization":
        return <XCircleIcon {...iconProps} className="text-red-500" />;
      case "not-found":
        return <InfoIcon {...iconProps} className="text-blue-500" />;
      case "external-service":
      case "internal":
        return <Bug {...iconProps} className="text-red-500" />;
      default:
        return <XCircleIcon {...iconProps} className="text-red-500" />;
    }
  };

  const getColorClasses = () => {
    switch (error.category) {
      case "validation":
        return {
          bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
          progress: "bg-amber-400",
          text: "text-amber-800 dark:text-amber-200",
        };
      case "authentication":
      case "authorization":
        return {
          bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
          progress: "bg-red-400",
          text: "text-red-800 dark:text-red-200",
        };
      case "not-found":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
          progress: "bg-blue-400",
          text: "text-blue-800 dark:text-blue-200",
        };
      default:
        return {
          bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
          progress: "bg-red-400",
          text: "text-red-800 dark:text-red-200",
        };
    }
  };

  const colors = getColorClasses();

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 w-96 max-w-[calc(100vw-2rem)] ${
        colors.bg
      } border rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 backdrop-blur-sm z-50 overflow-hidden ${
        isClosing ? "animate-slide-out-right" : "animate-slide-in-right"
      }`}
    >
      {/* Progress bar */}
      {autoClose && (
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full ${colors.progress} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className={`font-semibold text-sm ${colors.text}`}>
                {result.title}
              </h4>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <XIcon size={16} className="text-gray-500 dark:text-gray-400" />
              </button>
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
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-div-green text-white hover:bg-emerald-600 rounded-lg transition-colors"
                >
                  Fazer login
                </button>
              )}

              {result.action === "redirect-payment" && (
                <button
                  onClick={() => handleAction("redirect-payment")}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
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
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast Manager Component
interface ToastManagerProps {
  toasts: Array<{
    id: string;
    error: StandardErrorResponse;
    result: ErrorHandlerResult;
  }>;
  onClose: (id: string) => void;
  onAction?: (id: string, action: ErrorAction) => void;
}

export const ToastManager: React.FC<ToastManagerProps> = ({
  toasts,
  onClose,
  onAction,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            transform: `translateY(${index * 8}px)`,
            zIndex: 1000 - index,
          }}
        >
          <ErrorToast
            error={toast.error}
            result={toast.result}
            isVisible={true}
            onClose={() => onClose(toast.id)}
            onAction={(action) => onAction?.(toast.id, action)}
          />
        </div>
      ))}
    </div>
  );
};
