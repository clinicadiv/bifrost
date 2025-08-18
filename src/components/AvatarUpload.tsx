"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Camera, Trash, User, X } from "@phosphor-icons/react";
import { useCallback, useRef, useState } from "react";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onFileSelect?: (file: File | null) => void;
  onRemoveAvatar?: () => void;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  showRemoveButton?: boolean;
  className?: string;
}

export const AvatarUpload = ({
  currentAvatar,
  onFileSelect,
  onRemoveAvatar,
  disabled = false,
  size = "medium",
  showRemoveButton = true,
  className = "",
}: AvatarUploadProps) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determinar tamanhos baseado na prop size
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-16 h-16 text-xs";
      case "large":
        return "w-32 h-32 text-lg";
      default:
        return "w-24 h-24 text-sm";
    }
  };

  const validateFile = (file: File): string | null => {
    // Validar tamanho (5MB máximo)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return "Arquivo muito grande. Tamanho máximo: 5MB";
    }

    // Validar tipo de arquivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return "Tipo de arquivo não permitido. Use: JPG, JPEG, PNG ou GIF";
    }

    return null;
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setError(null);

      if (!file) {
        return;
      }

      // Validar arquivo
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Notificar componente pai
      if (onFileSelect) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleRemoveAvatar = useCallback(() => {
    setPreviewUrl(null);
    setError(null);

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Notificar componentes pai
    if (onFileSelect) {
      onFileSelect(null);
    }
    if (onRemoveAvatar) {
      onRemoveAvatar();
    }
  }, [onFileSelect, onRemoveAvatar]);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Determinar qual imagem mostrar (prioridade: preview > current > placeholder)
  const displayImage = previewUrl || currentAvatar;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-col gap-2">
        <label
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Foto de Perfil
        </label>

        <div className="flex items-center gap-4">
          {/* Avatar container */}
          <div
            className={`relative ${getSizeClasses()} rounded-full overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
              disabled
                ? theme === "dark"
                  ? "border-gray-600 cursor-not-allowed"
                  : "border-gray-300 cursor-not-allowed"
                : isHovering
                ? "border-primary-dark shadow-lg"
                : theme === "dark"
                ? "border-gray-600 hover:border-gray-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={handleClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <User
                  weight="fill"
                  className={`w-1/2 h-1/2 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>
            )}

            {/* Overlay de hover */}
            {isHovering && !disabled && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Camera weight="fill" className="w-1/3 h-1/3 text-white" />
              </div>
            )}

            {/* Badge de preview */}
            {previewUrl && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleClick}
              disabled={disabled}
              className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                disabled
                  ? theme === "dark"
                    ? "bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Camera className="w-4 h-4 inline mr-2" />
              {displayImage ? "Alterar" : "Adicionar"}
            </button>

            {showRemoveButton && (displayImage || currentAvatar) && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={disabled}
                className={`px-3 py-2 rounded-lg border border-red-300 transition-colors duration-200 ${
                  disabled
                    ? "bg-red-100 text-red-400 cursor-not-allowed"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                <Trash className="w-4 h-4 inline mr-2" />
                Remover
              </button>
            )}
          </div>
        </div>

        {/* Input oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Mensagem de ajuda */}
        <p
          className={`text-xs ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
        </p>

        {/* Erro */}
        {error && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg ${
              theme === "dark"
                ? "bg-red-900/30 border border-red-800"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <X className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
