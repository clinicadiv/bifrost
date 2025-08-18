import {
  DocumentUploadResponse,
  uploadMultipleDocuments,
} from "@/services/http/documents";
import { useCallback, useState } from "react";

interface UseDocumentUploadProps {
  onSuccess?: (response: DocumentUploadResponse) => void;
  onError?: (error: string) => void;
}

export const useDocumentUpload = ({
  onSuccess,
  onError,
}: UseDocumentUploadProps = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [error, setError] = useState<string | null>(null);

  const uploadDocuments = useCallback(
    async (
      files: File[],
      appointmentId: string,
      userId: string,
      token: string,
      options?: {
        text?: string;
        medicalRecordId?: string;
      }
    ) => {
      if (files.length === 0) {
        return null; // Sem arquivos para upload
      }

      setIsUploading(true);
      setError(null);
      setUploadProgress({});

      try {
        const uploadData = {
          files,
          appointmentId,
          userId,
          text: options?.text,
          medicalRecordId: options?.medicalRecordId,
        };

        const response = await uploadMultipleDocuments(uploadData, token);

        // Debug: Log da estrutura completa da resposta
        console.log(
          "🔍 Resposta completa do upload:",
          JSON.stringify(response, null, 2)
        );

        if (response.success) {
          console.log(
            `✅ Upload realizado com sucesso: ${
              response.data?.successCount || 0
            } de ${response.data?.totalFiles || 0} arquivos`
          );

          // Log dos arquivos enviados
          if (response.results && Array.isArray(response.results)) {
            response.results.forEach((doc, index) => {
              if (doc.success) {
                console.log(
                  `📁 Arquivo ${index + 1}: ${
                    doc.filename
                  } - Upload realizado com sucesso`
                );
              } else {
                console.error(
                  `❌ Erro no arquivo ${index + 1}: ${
                    doc.filename
                  } - Falha no upload`
                );
              }
            });
          } else {
            console.log(
              "📁 Upload concluído - detalhes dos arquivos não disponíveis"
            );
          }

          if (onSuccess) {
            onSuccess(response);
          }

          return response;
        } else {
          throw new Error(response.message || "Erro no upload");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido no upload";
        console.error("❌ Erro no upload de documentos:", errorMessage);

        setError(errorMessage);

        if (onError) {
          onError(errorMessage);
        }

        throw err;
      } finally {
        setIsUploading(false);
        setUploadProgress({});
      }
    },
    [onSuccess, onError]
  );

  const reset = useCallback(() => {
    setIsUploading(false);
    setError(null);
    setUploadProgress({});
  }, []);

  return {
    uploadDocuments,
    isUploading,
    uploadProgress,
    error,
    reset,
  };
};
