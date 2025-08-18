"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useReactQueryErrorHandler } from "@/hooks/useReactQueryErrorHandler";
import { queryKeys } from "@/lib/query-keys";
import { cancelReservation } from "@/services/http/time-slot/cancel-reservation";
import { confirmReservation } from "@/services/http/time-slot/confirm-reservation";
import { createGuestReservation } from "@/services/http/time-slot/create-guest-reservation";
import { createReservation } from "@/services/http/time-slot/create-reservation";
import { createUserAndLink } from "@/services/http/time-slot/create-user-and-link";
import { updateReservation } from "@/services/http/time-slot/update-reservation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Interfaces para mutations
interface CreateReservationParams {
  professionalId: string;
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

interface CreateGuestReservationParams extends CreateReservationParams {
  guestData: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
}

interface CreateUserAndLinkParams extends CreateReservationParams {
  userData: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    password: string;
  };
}

interface UpdateReservationParams {
  reservationId: string;
  professionalId?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  notes?: string;
}

/**
 * Hook para criar reserva (usuário autenticado)
 */
export function useCreateReservation() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { user, token } = useAuthStore();

  return useMutation({
    mutationFn: async (params: CreateReservationParams) => {
      if (!user?.id || !token) throw new Error("User not authenticated");

      // Converter params para o formato esperado pela API
      const reservationData = {
        medicalId: params.professionalId,
        patientId: user.id,
        reservationDate: params.appointmentDate,
        reservationTime: params.appointmentTime,
        serviceId: params.serviceId,
        durationMinutes: 15, // Duração padrão
      };

      return createReservation(reservationData);
    },

    onSuccess: (data, variables) => {
      // Invalidar queries de disponibilidade
      queryClient.invalidateQueries(
        queryKeys.timeSlotAvailability({
          professionalId: variables.professionalId,
          serviceId: variables.serviceId,
          date: variables.appointmentDate,
        })
      );

      // Invalidar appointments do usuário
      if (user?.id) {
        queryClient.invalidateQueries(queryKeys.appointmentsByUser(user.id));
      }
    },

    onError: handleMutationError,
  });
}

/**
 * Hook para criar reserva como convidado
 */
export function useCreateGuestReservation() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async (params: CreateGuestReservationParams) => {
      if (!token) throw new Error("Token required");

      // Converter params para o formato esperado pela API
      const reservationData = {
        medicalId: params.professionalId,
        reservationDate: params.appointmentDate,
        reservationTime: params.appointmentTime,
        serviceId: params.serviceId,
        durationMinutes: 15, // Duração padrão
      };

      return createGuestReservation(reservationData);
    },

    onSuccess: (data, variables) => {
      // Invalidar queries de disponibilidade
      queryClient.invalidateQueries(
        queryKeys.timeSlotAvailability({
          professionalId: variables.professionalId,
          serviceId: variables.serviceId,
          date: variables.appointmentDate,
        })
      );
    },

    onError: handleMutationError,
  });
}

/**
 * Hook para criar usuário e vincular reserva
 */
export function useCreateUserAndLink() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async (params: CreateUserAndLinkParams) => {
      if (!token) throw new Error("Token required");
      return createUserAndLink(params, token);
    },

    onSuccess: (data, variables) => {
      // Invalidar queries de disponibilidade
      queryClient.invalidateQueries(
        queryKeys.timeSlotAvailability({
          professionalId: variables.professionalId,
          serviceId: variables.serviceId,
          date: variables.appointmentDate,
        })
      );

      // Se criou usuário, invalidar dados do usuário
      queryClient.invalidateQueries(queryKeys.userProfile());
    },

    onError: handleMutationError,
  });
}

/**
 * Hook para confirmar reserva
 */
export function useConfirmReservation() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { user, token } = useAuthStore();

  return useMutation({
    mutationFn: async (reservationId: string) => {
      if (!token) throw new Error("Token required");
      return confirmReservation(reservationId, token);
    },

    onSuccess: () => {
      // Invalidar appointments do usuário
      if (user?.id) {
        queryClient.invalidateQueries(queryKeys.appointmentsByUser(user.id));
      }

      // Invalidar todas as queries de disponibilidade (pode afetar múltiplos slots)
      queryClient.invalidateQueries(queryKeys.timeSlots);
    },

    onError: handleMutationError,
  });
}

/**
 * Hook para cancelar reserva
 */
export function useCancelReservation() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { user, token } = useAuthStore();

  return useMutation({
    mutationFn: async (reservationId: string) => {
      if (!token) throw new Error("Token required");
      return cancelReservation(reservationId, token);
    },

    onSuccess: () => {
      // Invalidar appointments do usuário
      if (user?.id) {
        queryClient.invalidateQueries(queryKeys.appointmentsByUser(user.id));
      }

      // Invalidar todas as queries de disponibilidade
      queryClient.invalidateQueries(queryKeys.timeSlots);
    },

    onError: handleMutationError,
  });
}

/**
 * Hook para atualizar reserva
 */
export function useUpdateReservation() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { user, token } = useAuthStore();

  return useMutation({
    mutationFn: async (params: UpdateReservationParams) => {
      if (!token) throw new Error("Token required");
      const { reservationId, ...updateData } = params;
      return updateReservation(reservationId, updateData, token);
    },

    onSuccess: (data, variables) => {
      // Invalidar appointments do usuário
      if (user?.id) {
        queryClient.invalidateQueries(queryKeys.appointmentsByUser(user.id));
      }

      // Invalidar queries de disponibilidade afetadas
      if (variables.professionalId && variables.appointmentDate) {
        queryClient.invalidateQueries(
          queryKeys.timeSlotAvailability({
            professionalId: variables.professionalId,
            date: variables.appointmentDate,
          })
        );
      } else {
        // Se não sabemos quais foram afetadas, invalidar todas
        queryClient.invalidateQueries(queryKeys.timeSlots);
      }
    },

    onError: handleMutationError,
  });
}

/**
 * Hook combinado para todas as operações de time slot
 *
 * Simplifica o uso nas páginas
 */
export function useTimeSlotOperations() {
  const createReservation = useCreateReservation();
  const createGuestReservation = useCreateGuestReservation();
  const createUserAndLink = useCreateUserAndLink();
  const confirmReservation = useConfirmReservation();
  const cancelReservation = useCancelReservation();
  const updateReservation = useUpdateReservation();

  return {
    // Mutations
    createReservation: createReservation.mutate,
    createReservationAsync: createReservation.mutateAsync,
    createGuestReservation: createGuestReservation.mutate,
    createGuestReservationAsync: createGuestReservation.mutateAsync,
    createUserAndLink: createUserAndLink.mutate,
    createUserAndLinkAsync: createUserAndLink.mutateAsync,
    confirmReservation: confirmReservation.mutate,
    confirmReservationAsync: confirmReservation.mutateAsync,
    cancelReservation: cancelReservation.mutate,
    cancelReservationAsync: cancelReservation.mutateAsync,
    updateReservation: updateReservation.mutate,
    updateReservationAsync: updateReservation.mutateAsync,

    // Loading states
    isCreatingReservation: createReservation.isPending,
    isCreatingGuestReservation: createGuestReservation.isPending,
    isCreatingUserAndLink: createUserAndLink.isPending,
    isConfirming: confirmReservation.isPending,
    isCancelling: cancelReservation.isPending,
    isUpdating: updateReservation.isPending,
    isLoading:
      createReservation.isPending ||
      createGuestReservation.isPending ||
      createUserAndLink.isPending ||
      confirmReservation.isPending ||
      cancelReservation.isPending ||
      updateReservation.isPending,

    // Error states
    createError: createReservation.error,
    createGuestError: createGuestReservation.error,
    createUserAndLinkError: createUserAndLink.error,
    confirmError: confirmReservation.error,
    cancelError: cancelReservation.error,
    updateError: updateReservation.error,

    // Reset functions
    resetCreateError: createReservation.reset,
    resetCreateGuestError: createGuestReservation.reset,
    resetCreateUserAndLinkError: createUserAndLink.reset,
    resetConfirmError: confirmReservation.reset,
    resetCancelError: cancelReservation.reset,
    resetUpdateError: updateReservation.reset,
  };
}
