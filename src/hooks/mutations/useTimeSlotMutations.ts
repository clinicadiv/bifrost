import { useAuthStore } from "@/hooks/useAuthStore";
import { useReactQueryErrorHandler } from "@/hooks/useReactQueryErrorHandler";
import { queryKeys } from "@/lib/query-keys";
import { cancelReservation } from "@/services/http/time-slot/cancel-reservation";
import { confirmReservation } from "@/services/http/time-slot/confirm-reservation";
import { createGuestReservation } from "@/services/http/time-slot/create-guest-reservation";
import { createReservation } from "@/services/http/time-slot/create-reservation";
import { updateReservation } from "@/services/http/time-slot/update-reservation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Tipos para as operações
interface CreateReservationData {
  professionalId: string;
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

interface CreateGuestReservationData extends CreateReservationData {
  guestData: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
}

interface UpdateReservationData {
  reservationId: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

/**
 * Hook para operações de time slot com React Query
 */
export function useTimeSlotOperations() {
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();
  const { handleMutationError } = useReactQueryErrorHandler();

  // Mutation para criar reserva (usuário autenticado)
  const createReservationMutation = useMutation({
    mutationFn: async (data: CreateReservationData) => {
      if (!token || !user) throw new Error("Authentication required");

      return createReservation({
        medicalId: data.professionalId,
        patientId: user.id,
        reservationDate: data.appointmentDate,
        reservationTime: data.appointmentTime,
        serviceId: data.serviceId,
        durationMinutes: 60, // Padrão de 60 minutos
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-slots"] });
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.appointmentsByUser(user.id),
        });
      }
    },
    onError: (error) => {
      handleMutationError(error, { endpoint: "/time-slots/reserve" });
    },
  });

  // Mutation para criar reserva de convidado
  const createGuestReservationMutation = useMutation({
    mutationFn: async (data: CreateGuestReservationData) => {
      return createGuestReservation({
        medicalId: data.professionalId,
        reservationDate: data.appointmentDate,
        reservationTime: data.appointmentTime,
        serviceId: data.serviceId,
        durationMinutes: 60, // Padrão de 60 minutos
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-slots"] });
    },
    onError: (error) => {
      handleMutationError(error, { endpoint: "/time-slots/reserve-guest" });
    },
  });

  // Mutation para cancelar reserva
  const cancelReservationMutation = useMutation({
    mutationFn: async (reservationId: string) => {
      return cancelReservation(reservationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-slots"] });
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.appointmentsByUser(user.id),
        });
      }
    },
    onError: (error) => {
      handleMutationError(error, { endpoint: "/time-slots/cancel" });
    },
  });

  // Mutation para confirmar reserva
  const confirmReservationMutation = useMutation({
    mutationFn: async (reservationId: string) => {
      return confirmReservation(reservationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-slots"] });
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.appointmentsByUser(user.id),
        });
      }
    },
    onError: (error) => {
      handleMutationError(error, { endpoint: "/time-slots/confirm" });
    },
  });

  // Mutation para atualizar reserva
  const updateReservationMutation = useMutation({
    mutationFn: async (data: UpdateReservationData) => {
      return updateReservation(data.reservationId, "RESERVED");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-slots"] });
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.appointmentsByUser(user.id),
        });
      }
    },
    onError: (error) => {
      handleMutationError(error, { endpoint: "/time-slots/update" });
    },
  });

  // Funções assíncronas para uso direto
  const createReservationAsync = async (data: CreateReservationData) => {
    return createReservationMutation.mutateAsync(data);
  };

  const createGuestReservationAsync = async (
    data: CreateGuestReservationData
  ) => {
    return createGuestReservationMutation.mutateAsync(data);
  };

  const cancelReservationAsync = async (reservationId: string) => {
    return cancelReservationMutation.mutateAsync(reservationId);
  };

  const confirmReservationAsync = async (reservationId: string) => {
    return confirmReservationMutation.mutateAsync(reservationId);
  };

  const updateReservationAsync = async (data: UpdateReservationData) => {
    return updateReservationMutation.mutateAsync(data);
  };

  return {
    // Mutations
    createReservationMutation,
    createGuestReservationMutation,
    cancelReservationMutation,
    confirmReservationMutation,
    updateReservationMutation,

    // Funções assíncronas
    createReservationAsync,
    createGuestReservationAsync,
    cancelReservationAsync,
    confirmReservationAsync,
    updateReservationAsync,

    // Estados
    isCreatingReservation: createReservationMutation.isPending,
    isCreatingGuestReservation: createGuestReservationMutation.isPending,
    isCancellingReservation: cancelReservationMutation.isPending,
    isConfirmingReservation: confirmReservationMutation.isPending,
    isUpdatingReservation: updateReservationMutation.isPending,
  };
}

// Hook específico para criar reserva
export function useCreateReservation() {
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();
  const { handleMutationError } = useReactQueryErrorHandler();

  return useMutation({
    mutationFn: async (data: CreateReservationData) => {
      if (!token || !user) throw new Error("Authentication required");

      return createReservation({
        medicalId: data.professionalId,
        patientId: user.id,
        reservationDate: data.appointmentDate,
        reservationTime: data.appointmentTime,
        serviceId: data.serviceId,
        durationMinutes: 60,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-slots"] });
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.appointmentsByUser(user.id),
        });
      }
    },
    onError: (error) => {
      handleMutationError(error, { endpoint: "/time-slots/reserve" });
    },
  });
}
