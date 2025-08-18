import { api } from "../../api";

interface UploadAvatarResponse {
  success: boolean;
  data: {
    avatar: string;
    message: string;
  };
  message: string;
}

interface DeleteAvatarResponse {
  success: boolean;
  message: string;
}

export async function uploadAvatar(
  userId: string,
  avatarFile: File,
  token: string
): Promise<UploadAvatarResponse> {
  // Validar arquivo
  if (!avatarFile) {
    throw new Error("Nenhum arquivo selecionado");
  }

  // Validar tamanho (5MB máximo)
  const maxSize = 5 * 1024 * 1024;
  if (avatarFile.size > maxSize) {
    throw new Error("Arquivo muito grande. Tamanho máximo: 5MB");
  }

  // Validar tipo de arquivo
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (!allowedTypes.includes(avatarFile.type)) {
    throw new Error(
      "Tipo de arquivo não permitido. Use: JPG, JPEG, PNG ou GIF"
    );
  }

  // Criar FormData
  const formData = new FormData();
  formData.append("avatar", avatarFile);

  const response = await api.post<UploadAvatarResponse>(
    `/users/${userId}/avatar`,
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

export async function deleteAvatar(
  userId: string,
  token: string
): Promise<DeleteAvatarResponse> {
  const response = await api.delete<DeleteAvatarResponse>(
    `/users/${userId}/avatar`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
