"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import {
  deleteAllNotifications,
  deleteNotification as deleteNotificationAPI,
  getUserNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  NotificationResponse,
} from "@/services/http/notifications";
import {
  BellIcon,
  CheckCircleIcon,
  CheckIcon,
  InfoIcon,
  TrashIcon,
  WarningIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  timestamp: Date;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: {
    refresh: () => void;
    decrement: (amount?: number) => void;
    reset: () => void;
  };
}

export const NotificationDropdown = ({
  isOpen,
  onClose,
  onUnreadCountChange,
}: NotificationDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user, token } = useAuthStore();

  // Função para obter o ícone baseado no tipo da notificação
  const getNotificationIcon = (type: Notification["type"]) => {
    const iconProps = { size: 18, weight: "bold" as const };

    switch (type) {
      case "success":
        return <CheckCircleIcon {...iconProps} className="text-emerald-500" />;
      case "error":
        return <XCircleIcon {...iconProps} className="text-red-500" />;
      case "warning":
        return <WarningIcon {...iconProps} className="text-amber-500" />;
      case "info":
      default:
        return <InfoIcon {...iconProps} className="text-blue-500" />;
    }
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  // Adicionando novos states para controlar operações individuais
  const [markingAsRead, setMarkingAsRead] = useState<Set<string>>(new Set());
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const [deletingNotifications, setDeletingNotifications] = useState<
    Set<string>
  >(new Set());
  const [deletingAllNotifications, setDeletingAllNotifications] =
    useState(false);

  // Função para buscar notificações do backend
  const fetchNotifications = async () => {
    if (!user || !token) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await getUserNotifications(user.id, token);

      if (response.success) {
        // Converter as notificações do backend para o formato local
        const formattedNotifications: Notification[] =
          response.data.results.map((notification: NotificationResponse) => ({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            isRead: notification.isRead,
            timestamp: new Date(notification.timestamp),
          }));

        setNotifications(formattedNotifications);
      } else {
        setError("Erro ao carregar notificações");
      }
    } catch (err) {
      console.error("Erro ao buscar notificações:", err);
      setError("Erro ao carregar notificações");
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para buscar notificações quando o componente monta ou quando user/token mudam
  useEffect(() => {
    if (isOpen && user && token) {
      fetchNotifications();
    }
  }, [isOpen, user, token]);

  // Efeito para configurar revalidação automática a cada 15 segundos
  useEffect(() => {
    if (isOpen && user && token) {
      // Limpar intervalo anterior se existir
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Configurar novo intervalo
      intervalRef.current = setInterval(() => {
        fetchNotifications();
      }, 15000); // 15 segundos

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isOpen, user, token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    // Limpar intervalo quando fechar
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const markAsRead = async (id: string) => {
    if (!user || !token) return;

    setMarkingAsRead((prev) => new Set([...prev, id]));
    try {
      await markNotificationRead(id, token, true);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
      // Atualizar contador de não lidas
      onUnreadCountChange?.decrement(1);
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
    } finally {
      setMarkingAsRead((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Nova função para marcar como não lida
  const markAsUnread = async (id: string) => {
    if (!user || !token) return;

    setMarkingAsRead((prev) => new Set([...prev, id]));
    try {
      await markNotificationRead(id, token, false);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: false }
            : notification
        )
      );
      // Atualizar contador - como não há incremento direto, usar refresh
      onUnreadCountChange?.refresh();
    } catch (err) {
      console.error("Erro ao marcar notificação como não lida:", err);
    } finally {
      setMarkingAsRead((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user || !token) return;

    setMarkingAllAsRead(true);
    try {
      await markAllNotificationsRead(user.id, token);
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      // Zerar contador de não lidas
      onUnreadCountChange?.reset();
    } catch (err) {
      console.error("Erro ao marcar todas as notificações como lidas:", err);
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const clearAllNotifications = async () => {
    if (!user || !token) return;

    setDeletingAllNotifications(true);
    try {
      await deleteAllNotifications(user.id, token);
      setNotifications([]);
      onUnreadCountChange?.reset();
    } catch (err) {
      console.error("Erro ao limpar todas as notificações:", err);
    } finally {
      setDeletingAllNotifications(false);
    }
  };

  const deleteNotificationById = async (id: string) => {
    if (!user || !token) return;

    // Verificar se a notificação estava não lida para decrementar contador
    const notification = notifications.find((n) => n.id === id);
    const wasUnread = notification && !notification.isRead;

    setDeletingNotifications((prev) => new Set([...prev, id]));
    try {
      await deleteNotificationAPI(id, token);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      // Decrementar contador apenas se a notificação estava não lida
      if (wasUnread) {
        onUnreadCountChange?.decrement(1);
      }
    } catch (err) {
      console.error("Erro ao remover notificação:", err);
    } finally {
      setDeletingNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Agora";
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;

    return timestamp.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-0 top-full mt-2 w-96 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 z-50 overflow-hidden ${
        isClosing ? "animate-menu-close" : "animate-menu-open"
      }`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200/50 dark:border-slate-700/50 bg-gradient-to-r from-div-green/5 to-emerald-500/5 dark:from-div-green/10 dark:to-emerald-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-div-green to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-div-green/25">
              <BellIcon size={18} weight="bold" className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                Notificações
              </h3>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-700 dark:text-slate-400">
                  {unreadCount} não lida{unreadCount > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors duration-200"
          >
            <XIcon size={16} className="text-gray-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={markingAllAsRead}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-div-green hover:bg-div-green/10 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {markingAllAsRead ? (
                  <div className="w-3 h-3 border border-div-green border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CheckIcon size={12} />
                )}
                Marcar todas como lidas
              </button>
            )}
            <button
              onClick={clearAllNotifications}
              disabled={deletingAllNotifications}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingAllNotifications ? (
                <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <TrashIcon size={12} />
              )}
              Limpar todas
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading && notifications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-2 border-div-green border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 dark:text-slate-400 text-sm">
              Carregando notificações...
            </p>
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center">
            <XCircleIcon size={48} className="mx-auto text-red-500 mb-4" />
            <h4 className="text-lg font-medium text-gray-800 dark:text-slate-100 mb-2">
              Erro ao carregar
            </h4>
            <p className="text-gray-700 dark:text-slate-400 text-sm mb-4">
              {error}
            </p>
            <button
              onClick={fetchNotifications}
              className="px-4 py-2 bg-div-green text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200"
            >
              Tentar novamente
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <BellIcon
              size={48}
              className="mx-auto text-gray-400 dark:text-slate-500 mb-4"
            />
            <h4 className="text-lg font-medium text-gray-800 dark:text-slate-100 mb-2">
              Nenhuma notificação
            </h4>
            <p className="text-gray-700 dark:text-slate-400 text-sm">
              Você está em dia! Não há notificações pendentes.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200/50 dark:divide-slate-700/50">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-slate-700/80 transition-all duration-200 group relative ${
                  !notification.isRead
                    ? "bg-div-green/5 dark:bg-div-green/10 border-l-4 border-div-green"
                    : ""
                } animate-menu-item-${Math.min(index + 1, 4)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-800 dark:text-slate-100 text-sm">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-div-green rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-slate-500 mt-2">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {notification.isRead ? (
                      <button
                        onClick={() => markAsUnread(notification.id)}
                        disabled={markingAsRead.has(notification.id)}
                        className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-600 dark:text-amber-500 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        title="Marcar como não lida"
                      >
                        {markingAsRead.has(notification.id) ? (
                          <div className="w-3.5 h-3.5 border border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <BellIcon size={14} />
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        disabled={markingAsRead.has(notification.id)}
                        className="p-1.5 hover:bg-div-green/10 text-div-green rounded-lg transition-colors duration-200 disabled:opacity-50"
                        title="Marcar como lida"
                      >
                        {markingAsRead.has(notification.id) ? (
                          <div className="w-3.5 h-3.5 border border-div-green border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <CheckIcon size={14} />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotificationById(notification.id)}
                      disabled={deletingNotifications.has(notification.id)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      title="Remover notificação"
                    >
                      {deletingNotifications.has(notification.id) ? (
                        <div className="w-3.5 h-3.5 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <TrashIcon size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200/50 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/50">
          <button className="w-full text-center text-sm font-medium text-div-green hover:text-emerald-600 dark:text-div-green dark:hover:text-emerald-400 transition-colors duration-200">
            Ver todas as notificações
          </button>
        </div>
      )}
    </div>
  );
};
