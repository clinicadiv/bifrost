import { api } from "../../api";

export interface DocumentUploadData {
  text?: string;
  files: File[];
  appointmentId: string;
  userId: string;
  medicalRecordId?: string;
}

export interface DocumentData {
  id: string;
  appointmentId: string;
  userId: string;
  appointmentDate: string;
  category: string | null;
  createdAt: string;
  description: string;
  fileKey: string;
  fileSize: number;
  fileUrl: string;
  mimeType: string;
  updatedAt: string;
}

export interface UserData {
  id: string;
  name: string;
  userId: string;
}

export interface UploadResult {
  success: boolean;
  filename: string;
  document: DocumentData;
  user: UserData;
}

export interface UploadSummary {
  totalFiles: number;
  successCount: number;
  errorCount: number;
}

export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  data: UploadSummary;
  results: UploadResult[];
}

/**
 * Upload múltiplo de documentos
 *
 * Pontos importantes:
 * - Nome do campo de arquivos: Deve ser exatamente "files"
 * - Máximo de arquivos: 5 por requisição
 * - Tamanho máximo: 10MB por arquivo
 * - Tipos permitidos: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, GIF
 * - appointmentId e userId são obrigatórios
 * - medicalRecordId é opcional
 */
export async function uploadMultipleDocuments(
  data: DocumentUploadData,
  token: string
): Promise<DocumentUploadResponse> {
  // Validações
  if (!data.files || data.files.length === 0) {
    throw new Error("Pelo menos um arquivo deve ser selecionado");
  }

  if (data.files.length > 5) {
    throw new Error("Máximo de 5 arquivos por requisição");
  }

  if (!data.appointmentId) {
    throw new Error("appointmentId é obrigatório");
  }

  if (!data.userId) {
    throw new Error("userId é obrigatório");
  }

  // Validar tamanho dos arquivos (10MB = 10 * 1024 * 1024 bytes)
  const maxSize = 10 * 1024 * 1024;
  for (const file of data.files) {
    if (file.size > maxSize) {
      throw new Error(`Arquivo ${file.name} excede o tamanho máximo de 10MB`);
    }
  }

  // Validar tipos de arquivo permitidos
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

  for (const file of data.files) {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `Tipo de arquivo não permitido: ${file.name}. Tipos permitidos: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, GIF`
      );
    }
  }

  // Criar FormData
  const formData = new FormData();

  // Adicionar texto se fornecido
  if (data.text) {
    formData.append("text", data.text);
  }

  // Adicionar arquivos (campo deve se chamar exatamente "files")
  data.files.forEach((file) => {
    formData.append("files", file);
  });

  // Adicionar dados obrigatórios
  formData.append("appointmentId", data.appointmentId);
  formData.append("userId", data.userId);

  // Adicionar medicalRecordId se fornecido
  if (data.medicalRecordId) {
    formData.append("medicalRecordId", data.medicalRecordId);
  }

  const response = await api.post<DocumentUploadResponse>(
    "/documents/upload-multiple",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
