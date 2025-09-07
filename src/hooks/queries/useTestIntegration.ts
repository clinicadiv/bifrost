"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect } from "react";
import { useAppointments } from "./useAppointments";
import { useMedicalRecords } from "./useMedicalRecords";
import {
  useNotifications,
  useUnreadNotificationsCount,
} from "./useNotifications";
import { useUserBenefits } from "./useUserBenefits";

/**
 * Hook de teste para verificar integração de todos os hooks migrados
 *
 * Use este hook em uma página de teste para verificar se tudo está funcionando
 */
export function useTestIntegration() {
  const { user } = useAuthStore();
  const userId = user?.id || "";

  // Testar todos os hooks migrados
  const appointments = useAppointments();
  const medicalRecords = useMedicalRecords(userId, { page: 1, limit: 5 });
  const notifications = useNotifications(userId, { page: 1, limit: 10 });
  const unreadCount = useUnreadNotificationsCount(userId);
  const benefits = useUserBenefits(userId);

  // Status consolidado
  const isLoading =
    appointments.loading ||
    medicalRecords.isLoading ||
    notifications.isPending ||
    unreadCount.isPending ||
    benefits.isLoading;

  const hasErrors = !!(
    appointments.error ||
    medicalRecords.error ||
    notifications.error ||
    unreadCount.error ||
    benefits.error
  );

  const allDataLoaded = !!(
    appointments.appointments.length >= 0 && // Pode ser 0
    medicalRecords.medicalRecords.length >= 0 &&
    (
      notifications.data as {
        results?: Array<{
          id: string;
          title: string;
          message: string;
          read: boolean;
          createdAt: string;
        }>;
        total?: number;
      }
    )?.results &&
    unreadCount.data &&
    benefits.data
  );

  return {
    // Dados individuais
    appointments: {
      data: appointments.appointments,
      upcoming: appointments.upcomingAppointments,
      past: appointments.pastAppointments,
      loading: appointments.loading,
      error: appointments.error,
      count: appointments.appointments.length,
    },

    medicalRecords: {
      data: medicalRecords.medicalRecords,
      psychological: medicalRecords.psychologicalRecords,
      psychiatric: medicalRecords.psychiatricRecords,
      loading: medicalRecords.isLoading,
      error: medicalRecords.error,
      count: medicalRecords.medicalRecords.length,
    },

    notifications: {
      data:
        (
          notifications.data as {
            results?: Array<{
              id: string;
              title: string;
              message: string;
              read: boolean;
              createdAt: string;
            }>;
            total?: number;
          }
        )?.results || [],
      loading: notifications.isPending,
      error: notifications.error,
      count:
        (
          notifications.data as {
            results?: Array<{
              id: string;
              title: string;
              message: string;
              read: boolean;
              createdAt: string;
            }>;
            total?: number;
          }
        )?.total || 0,
    },

    unreadCount: {
      data: unreadCount.data,
      loading: unreadCount.isPending,
      error: unreadCount.error,
    },

    benefits: {
      data: benefits.data,
      loading: benefits.isPending,
      error: benefits.error,
    },

    // Status consolidado
    summary: {
      isLoading,
      hasErrors,
      allDataLoaded,
      userId,
      userAuthenticated: !!user,

      // Contadores
      totalAppointments: appointments.appointments.length,
      totalMedicalRecords: medicalRecords.medicalRecords.length,
      totalNotifications:
        (
          notifications.data as {
            results?: Array<{
              id: string;
              title: string;
              message: string;
              read: boolean;
              createdAt: string;
            }>;
            total?: number;
          }
        )?.total || 0,
      unreadNotifications: (unreadCount.data as { count?: number })?.count || 0,

      // Status das queries
      queriesStatus: {
        appointments: appointments.loading
          ? "loading"
          : appointments.error
          ? "error"
          : "success",
        medicalRecords: medicalRecords.isLoading
          ? "loading"
          : medicalRecords.error
          ? "error"
          : "success",
        notifications: notifications.isPending
          ? "loading"
          : notifications.error
          ? "error"
          : "success",
        unreadCount: unreadCount.isPending
          ? "loading"
          : unreadCount.error
          ? "error"
          : "success",
        benefits: benefits.isPending
          ? "loading"
          : benefits.error
          ? "error"
          : "success",
      },

      // Cache status (novos benefícios do React Query)
      cacheStatus: {
        appointmentsStale: appointments.isStale,
        medicalRecordsStale: medicalRecords.isStale,
        notificationsStale: notifications.isStale,
        unreadCountStale: unreadCount.isStale,
        benefitsStale: benefits.isStale,
      },

      // Last updated
      lastUpdated: {
        appointments: appointments.dataUpdatedAt,
        medicalRecords: medicalRecords.dataUpdatedAt,
        notifications: notifications.dataUpdatedAt,
        unreadCount: unreadCount.dataUpdatedAt,
        benefits: benefits.dataUpdatedAt,
      },
    },
  };
}

/**
 * Hook para debug - mostra status detalhado no console
 */
export function useDebugIntegration() {
  const integration = useTestIntegration();

  // Log automático quando dados mudam
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.group("🔍 React Query Integration Status");
      console.log("Summary:", integration.summary);
      console.log("Appointments:", integration.appointments);
      console.log("Medical Records:", integration.medicalRecords);
      console.log("Notifications:", integration.notifications);
      console.log("Benefits:", integration.benefits);
      console.groupEnd();
    }
  }, [
    integration.summary.allDataLoaded,
    integration.appointments,
    integration.benefits,
    integration.medicalRecords,
    integration.notifications,
    integration.summary,
  ]);

  return integration;
}
