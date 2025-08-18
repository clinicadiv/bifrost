import { getUnreadNotificationsCount } from "@/services/http/notifications";
import { useEffect, useState } from "react";
import { useAuthStore } from "./useAuthStore";

export const useUnreadNotifications = () => {
  const { user, token } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnreadCount = async () => {
    if (!user || !token) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await getUnreadNotificationsCount(user.id, token);

      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      } else {
        setError("Erro ao carregar contador de notificações");
      }
    } catch (err) {
      console.error("Erro ao buscar contador de notificações:", err);
      setError("Erro ao carregar contador de notificações");
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar o contador (útil após marcar notificações como lidas)
  const refreshUnreadCount = () => {
    fetchUnreadCount();
  };

  // Função para decrementar o contador localmente (otimização)
  const decrementUnreadCount = (amount: number = 1) => {
    setUnreadCount((prev) => Math.max(0, prev - amount));
  };

  // Função para zerar o contador localmente
  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  // Buscar contador inicial quando o usuário estiver disponível
  useEffect(() => {
    fetchUnreadCount();
  }, [user, token]);

  // Atualizar contador a cada 30 segundos quando usuário estiver logado
  useEffect(() => {
    if (!user || !token) return;

    const interval = setInterval(fetchUnreadCount, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [user, token]);

  return {
    unreadCount,
    isLoading,
    error,
    refreshUnreadCount,
    decrementUnreadCount,
    resetUnreadCount,
  };
};
