import { deleteAvatar, uploadAvatar } from "@/services/http/user";
import { useCallback, useState } from "react";
import { useAuthStore } from "./useAuthStore";

interface UseAvatarUploadProps {
  onSuccess?: (avatar: string) => void;
  onError?: (error: string) => void;
}

export const useAvatarUpload = ({
  onSuccess,
  onError,
}: UseAvatarUploadProps = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token, updateUserData } = useAuthStore();

  const uploadUserAvatar = useCallback(
    async (file: File) => {
      if (!user || !token) {
        const errorMsg = "Usuário não autenticado";
        setError(errorMsg);
        if (onError) onError(errorMsg);
        return null;
      }

      setIsUploading(true);
      setError(null);

      try {
        const response = await uploadAvatar(user.id, file, token);

        if (response.success) {
          // Atualizar o usuário no store com a nova URL do avatar
          await updateUserData({ avatar: response.data.avatar });

          console.log(
            "✅ Avatar atualizado com sucesso:",
            response.data.avatar
          );

          if (onSuccess) {
            onSuccess(response.data.avatar);
          }

          return response.data.avatar;
        } else {
          throw new Error(response.message || "Erro no upload do avatar");
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Erro desconhecido no upload";
        console.error("❌ Erro no upload do avatar:", error);
        setError(errorMsg);

        if (onError) {
          onError(errorMsg);
        }

        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [user, token, updateUserData, onSuccess, onError]
  );

  const removeUserAvatar = useCallback(async () => {
    if (!user || !token) {
      const errorMsg = "Usuário não autenticado";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return false;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await deleteAvatar(user.id, token);

      if (response.success) {
        // Atualizar o usuário no store removendo a URL do avatar
        await updateUserData({ avatar: null });

        console.log("✅ Avatar removido com sucesso");

        if (onSuccess) {
          onSuccess("");
        }

        return true;
      } else {
        throw new Error(response.message || "Erro ao remover avatar");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao remover avatar";
      console.error("❌ Erro ao remover avatar:", error);
      setError(errorMsg);

      if (onError) {
        onError(errorMsg);
      }

      return false;
    } finally {
      setIsUploading(false);
    }
  }, [user, token, updateUserData, onSuccess, onError]);

  return {
    uploadUserAvatar,
    removeUserAvatar,
    isUploading,
    error,
  };
};
