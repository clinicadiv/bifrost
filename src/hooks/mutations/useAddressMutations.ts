"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useReactQueryErrorHandler } from "@/hooks/useReactQueryErrorHandler";
import { queryKeys } from "@/lib/query-keys";
import {
  createAddress,
  deleteAddress,
  updateAddress,
} from "@/services/http/addresses";
import { Address } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Interfaces para mutations
interface CreateAddressParams {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  type?: "residential" | "commercial";
  isDefault?: boolean;
}

interface UpdateAddressParams extends CreateAddressParams {
  addressId: string;
}

/**
 * Hook para criar novo endereço
 */
export function useCreateAddress() {
  const queryClient = useQueryClient();
  const { handleMutationError, createOptimisticUpdate } =
    useReactQueryErrorHandler();
  const { user, token } = useAuthStore();

  return useMutation({
    mutationFn: async (params: CreateAddressParams) => {
      if (!user?.id || !token) throw new Error("User not authenticated");
      return createAddress(user.id, params, token);
    },

    onMutate: async (newAddress) => {
      if (!user?.id) return;

      // Optimistic update - adicionar endereço temporário
      return createOptimisticUpdate(
        queryKeys.addressesByUser(user.id),
        (oldData: any) => {
          if (!oldData?.data?.addresses) return oldData;

          const tempAddress = {
            id: `temp-${Date.now()}`,
            ...newAddress,
            userId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            ...oldData,
            data: {
              ...oldData.data,
              addresses: [...oldData.data.addresses, tempAddress],
            },
          };
        },
        true // Rollback on error
      );
    },

    onError: handleMutationError,

    onSettled: () => {
      if (user?.id) {
        queryClient.invalidateQueries(queryKeys.addressesByUser(user.id));
      }
    },
  });
}

/**
 * Hook para atualizar endereço existente
 */
export function useUpdateAddress() {
  const queryClient = useQueryClient();
  const { handleMutationError, createOptimisticUpdate } =
    useReactQueryErrorHandler();
  const { user, token } = useAuthStore();

  return useMutation({
    mutationFn: async (params: UpdateAddressParams) => {
      if (!token) throw new Error("Token required");
      const { addressId, ...updateData } = params;
      return updateAddress(addressId, updateData, token);
    },

    onMutate: async (updatedAddress) => {
      if (!user?.id) return;

      // Optimistic update - atualizar endereço
      return createOptimisticUpdate(
        queryKeys.addressesByUser(user.id),
        (oldData: any) => {
          if (!oldData?.data?.addresses) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              addresses: oldData.data.addresses.map((addr: Address) =>
                addr.id === updatedAddress.addressId
                  ? {
                      ...addr,
                      ...updatedAddress,
                      updatedAt: new Date().toISOString(),
                    }
                  : addr
              ),
            },
          };
        },
        true // Rollback on error
      );
    },

    onError: handleMutationError,

    onSettled: () => {
      if (user?.id) {
        queryClient.invalidateQueries(queryKeys.addressesByUser(user.id));
      }
    },
  });
}

/**
 * Hook para deletar endereço
 */
export function useDeleteAddress() {
  const queryClient = useQueryClient();
  const { handleMutationError, createOptimisticUpdate } =
    useReactQueryErrorHandler();
  const { user, token } = useAuthStore();

  return useMutation({
    mutationFn: async (addressId: string) => {
      if (!token) throw new Error("Token required");
      return deleteAddress(addressId, token);
    },

    onMutate: async (addressId) => {
      if (!user?.id) return;

      // Optimistic update - remover endereço
      return createOptimisticUpdate(
        queryKeys.addressesByUser(user.id),
        (oldData: any) => {
          if (!oldData?.data?.addresses) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              addresses: oldData.data.addresses.filter(
                (addr: Address) => addr.id !== addressId
              ),
            },
          };
        },
        true // Rollback on error
      );
    },

    onError: handleMutationError,

    onSettled: () => {
      if (user?.id) {
        queryClient.invalidateQueries(queryKeys.addressesByUser(user.id));
      }
    },
  });
}

/**
 * Hook combinado para todas as operações de endereço
 *
 * Simplifica o uso nas páginas
 */
export function useAddressOperations() {
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  return {
    // Mutations
    createAddress: createAddress.mutate,
    createAddressAsync: createAddress.mutateAsync,
    updateAddress: updateAddress.mutate,
    updateAddressAsync: updateAddress.mutateAsync,
    deleteAddress: deleteAddress.mutate,
    deleteAddressAsync: deleteAddress.mutateAsync,

    // Loading states
    isCreating: createAddress.isPending,
    isUpdating: updateAddress.isPending,
    isDeleting: deleteAddress.isPending,
    isLoading:
      createAddress.isPending ||
      updateAddress.isPending ||
      deleteAddress.isPending,

    // Error states
    createError: createAddress.error,
    updateError: updateAddress.error,
    deleteError: deleteAddress.error,

    // Reset functions
    resetCreateError: createAddress.reset,
    resetUpdateError: updateAddress.reset,
    resetDeleteError: deleteAddress.reset,
  };
}
