"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Upload, X } from "@phosphor-icons/react";
import { useCallback, useState } from "react";

export interface SelectedFile {
  file: File;
  preview?: string;
  id: string;
}

interface DocumentUploadProps {
  onFilesChange?: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  description?: string;
}

export const DocumentUpload = ({
  onFilesChange,
  maxFiles = 5,
  disabled = false,
  description,
}: DocumentUploadProps) => {
  const { theme } = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Tipos de arquivo permitidos
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
  ];

  // Função para formatar tamanho do arquivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Função para obter ícone do arquivo
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return "🖼️";
    } else if (file.type === "application/pdf") {
      return "📄";
    } else if (file.type.includes("word")) {
      return "📝";
    } else if (file.type === "text/plain") {
      return "📄";
    }
    return "📁";
  };

  // Função para validar arquivo
  const validateFile = (file: File): string | null => {
    // Verificar tipo
    if (!allowedTypes.includes(file.type)) {
      return `Tipo de arquivo não permitido: ${file.name}`;
    }

    // Verificar tamanho (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return `Arquivo muito grande: ${file.name} (máximo 10MB)`;
    }

    return null;
  };

  // Função para processar arquivos selecionados
  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const errors: string[] = [];
      const validFiles: SelectedFile[] = [];

      // Verificar limite de arquivos
      if (selectedFiles.length + fileArray.length > maxFiles) {
        errors.push(`Máximo de ${maxFiles} arquivos permitidos`);
        return { validFiles: [], errors };
      }

      fileArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(error);
        } else {
          const newFile: SelectedFile = {
            file,
            id: `${file.name}-${Date.now()}-${Math.random()}`,
          };

          // Criar preview para imagens
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
              newFile.preview = e.target?.result as string;
            };
            reader.readAsDataURL(file);
          }

          validFiles.push(newFile);
        }
      });

      return { validFiles, errors };
    },
    [selectedFiles.length, maxFiles]
  );

  // Função para adicionar arquivos
  const handleFileSelect = (files: FileList | File[]) => {
    if (disabled) return;

    const { validFiles, errors } = processFiles(files);

    if (errors.length > 0) {
      // Aqui você pode mostrar os erros usando um toast ou alert
      errors.forEach((error) => console.error(error));
      alert(errors.join("\n"));
      return;
    }

    const newSelectedFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newSelectedFiles);

    // Notificar mudança
    if (onFilesChange) {
      onFilesChange(newSelectedFiles.map((sf) => sf.file));
    }
  };

  // Função para remover arquivo
  const removeFile = (fileId: string) => {
    if (disabled) return;

    const newSelectedFiles = selectedFiles.filter((sf) => sf.id !== fileId);
    setSelectedFiles(newSelectedFiles);

    // Notificar mudança
    if (onFilesChange) {
      onFilesChange(newSelectedFiles.map((sf) => sf.file));
    }
  };

  // Handlers para drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h4
          className={`text-lg font-semibold mb-2 ${
            theme === "dark" ? "text-gray-200" : "text-gray-900"
          }`}
        >
          Documentos
        </h4>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {description ||
            "Adicione documentos, exames ou imagens que podem ajudar na consulta (opcional)"}
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive
            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
            : theme === "dark"
            ? "border-gray-600 hover:border-gray-500"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled) {
            document.getElementById("file-upload-input")?.click();
          }
        }}
      >
        <input
          id="file-upload-input"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-3">
          <div
            className={`p-3 rounded-full ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <Upload
              size={24}
              className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
            />
          </div>

          <div>
            <p
              className={`font-medium ${
                theme === "dark" ? "text-gray-200" : "text-gray-900"
              }`}
            >
              Clique para selecionar ou arraste arquivos aqui
            </p>
            <p
              className={`text-sm mt-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, GIF (máx. 10MB cada)
            </p>
          </div>

          <div
            className={`text-xs ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Máximo {maxFiles} arquivos • {selectedFiles.length}/{maxFiles}{" "}
            selecionados
          </div>
        </div>
      </div>

      {/* Lista de arquivos selecionados */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h5
            className={`font-medium ${
              theme === "dark" ? "text-gray-200" : "text-gray-900"
            }`}
          >
            Arquivos selecionados ({selectedFiles.length})
          </h5>

          <div className="space-y-2">
            {selectedFiles.map((selectedFile) => (
              <div
                key={selectedFile.id}
                className={`flex items-center gap-3 p-3 border rounded-lg ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-800"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {/* Preview ou ícone */}
                <div className="flex-shrink-0">
                  {selectedFile.preview ? (
                    <img
                      src={selectedFile.preview}
                      alt={selectedFile.file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded flex items-center justify-center text-lg ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      {getFileIcon(selectedFile.file)}
                    </div>
                  )}
                </div>

                {/* Informações do arquivo */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium truncate ${
                      theme === "dark" ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {selectedFile.file.name}
                  </p>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {formatFileSize(selectedFile.file.size)}
                  </p>
                </div>

                {/* Botão remover */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(selectedFile.id);
                  }}
                  disabled={disabled}
                  className={`p-1.5 rounded-lg transition-colors ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : theme === "dark"
                      ? "hover:bg-red-900/50 text-red-400 hover:text-red-300"
                      : "hover:bg-red-50 text-red-500 hover:text-red-600"
                  }`}
                  title="Remover arquivo"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
