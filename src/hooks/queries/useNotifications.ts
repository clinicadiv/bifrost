"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import {
  useQueryErrorHandler,
  useReactQueryErrorHandler,
} from "@/hooks/useReactQueryErrorHandler";
import { queryKeys } from "@/lib/query-keys";
import {
  deleteAllNotifications,
  deleteNotification,
  getUnreadCount,
  getUserNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/http/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook para notificações do usuário com polling automático
 */
export function useNotifications(
  userId: string,
  params?: {
    page?: number;
    limit?: number;
    read?: boolean;
  }
) {
  const { token } = useAuthStore();
  const { onError, retry } = useQueryErrorHandler();

  return useQuery({
    queryKey: queryKeys.notificationsList(userId, params),

    queryFn: async () => {
      if (!token) throw new Error("Token required");
      // Nota: A API atual não suporta paginação, implementar se necessário
      return getUserNotifications(userId, token);
    },

    enabled: !!userId && !!token,

    // Polling para notificações em tempo real
    refetchInterval: 30000, // 30 segundos
    refetchIntervalInBackground: false, // Só quando ativo

    // Cache mais curto para dados em tempo real
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos

    onError,
    retry,
  });
}

/**
 * Hook para contador de notificações não lidas (polling mais frequente)
 */
export function useUnreadNotificationsCount(userId: string) {
  const { token } = useAuthStore();
  const { onError, retry } = useQueryErrorHandler();

  return useQuery({
    queryKey: queryKeys.notificationsUnreadCount(userId),

    queryFn: async () => {
      if (!token) throw new Error("Token required");
      return getUnreadCount(userId, token);
    },

    enabled: !!userId && !!token,

    // Polling mais frequente para contador
    refetchInterval: 15000, // 15 segundos
    refetchIntervalInBackground: true, // Continua em background

    staleTime: 30 * 1000, // 30 segundos
    gcTime: 2 * 60 * 1000, // 2 minutos

    onError,
    retry,
  });
}

/**
 * Mutations para operações com notificações
 */
export function useNotificationMutations() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { user, token } = useAuthStore();

  // Marcar como lida
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!token) throw new Error("Token required");
      return markNotificationRead(notificationId, token);
    },

    onSuccess: () => {
      // Invalidar queries relacionadas
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.notificationsList(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.notificationsUnreadCount(user.id),
        });
      }
    },

    onError: handleMutationError,
  });

  // Marcar todas como lidas
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!token || !user?.id) throw new Error("Token and user required");
      return markAllNotificationsRead(user.id, token);
    },

    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.notifications,
        });
      }
    },

    onError: handleMutationError,
  });

  // Deletar notificação
  const deleteNotif = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!token) throw new Error("Token required");
      return deleteNotification(notificationId, token);
    },

    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.notificationsList(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.notificationsUnreadCount(user.id),
        });
      }
    },

    onError: handleMutationError,
  });

  // Deletar todas
  const deleteAll = useMutation({
    mutationFn: async () => {
      if (!token || !user?.id) throw new Error("Token and user required");
      return deleteAllNotifications(user.id, token);
    },

    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.notifications,
        });
      }
    },

    onError: handleMutationError,
  });

  return {
    markAsRead: markAsRead.mutate,
    markAsReadAsync: markAsRead.mutateAsync,
    isMarkingAsRead: markAsRead.isPending,

    markAllAsRead: markAllAsRead.mutate,
    markAllAsReadAsync: markAllAsRead.mutateAsync,
    isMarkingAllAsRead: markAllAsRead.isPending,

    deleteNotification: deleteNotif.mutate,
    deleteNotificationAsync: deleteNotif.mutateAsync,
    isDeletingNotification: deleteNotif.isPending,

    deleteAllNotifications: deleteAll.mutate,
    deleteAllNotificationsAsync: deleteAll.mutateAsync,
    isDeletingAll: deleteAll.isPending,

    isLoading:
      markAsRead.isPending ||
      markAllAsRead.isPending ||
      deleteNotif.isPending ||
      deleteAll.isPending,
  };
}
