"use client";

import { useEffect, useState } from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
}

export const LoadingOverlay = ({
  isVisible,
  message = "Processando...",
  subMessage = "Aguarde um momento",
}: LoadingOverlayProps) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      {/* Loading content */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 mx-4 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          {/* Spinner */}
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-400 opacity-20"></div>
          </div>

          {/* Main message */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {message}
            {dots}
          </h3>

          {/* Sub message */}
          <p className="text-gray-600 text-sm mb-4">{subMessage}</p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full animate-pulse w-3/4"></div>
          </div>

          {/* Status text */}
          <p className="text-xs text-gray-500">
            Por favor, não feche esta janela
          </p>
        </div>
      </div>
    </div>
  );
};
