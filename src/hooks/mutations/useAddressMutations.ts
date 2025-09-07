import { useAuthStore } from "@/hooks/useAuthStore";
import { useReactQueryErrorHandler } from "@/hooks/useReactQueryErrorHandler";
import { queryKeys } from "@/lib/query-keys";
import type {
  CreateAddressData,
  UpdateAddressData,
} from "@/services/http/addresses";
import {
  createAddress,
  deleteAddress,
  updateAddress,
} from "@/services/http/addresses";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook para criar um novo endereço
 */
export function useCreateAddress() {
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();
  const { handleMutationError } = useReactQueryErrorHandler();

  return useMutation({
    mutationFn: async (params: CreateAddressData) => {
      if (!user?.id || !token) throw new Error("User not authenticated");
      return createAddress(params, token);
    },

    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.addressesByUser(user.id),
        });
      }
    },

    onError: (error) => {
      handleMutationError(error, {
        endpoint: "/api/addresses",
      });
    },
  });
}

/**
 * Hook para atualizar um endereço existente
 */
export function useUpdateAddress() {
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();
  const { handleMutationError } = useReactQueryErrorHandler();

  return useMutation({
    mutationFn: async (params: UpdateAddressData & { id: string }) => {
      if (!user?.id || !token) throw new Error("User not authenticated");
      return updateAddress(params.id, params, token);
    },

    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.addressesByUser(user.id),
        });
      }
    },

    onError: (error) => {
      handleMutationError(error, {
        endpoint: "/api/addresses",
      });
    },
  });
}

/**
 * Hook para deletar um endereço
 */
export function useDeleteAddress() {
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();
  const { handleMutationError } = useReactQueryErrorHandler();

  return useMutation({
    mutationFn: async (addressId: string) => {
      if (!user?.id || !token) throw new Error("User not authenticated");
      return deleteAddress(addressId, token);
    },

    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.addressesByUser(user.id),
        });
      }
    },

    onError: (error) => {
      handleMutationError(error, {
        endpoint: "/api/addresses",
      });
    },
  });
}

/**
 * Hook que agrupa todas as operações de endereços
 */
export function useAddressOperations() {
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

  return {
    // Mutations
    createAddress: createAddressMutation.mutateAsync,
    updateAddress: updateAddressMutation.mutateAsync,
    deleteAddress: deleteAddressMutation.mutateAsync,

    // Funções assíncronas
    createAddressAsync: createAddressMutation.mutateAsync,
    updateAddressAsync: updateAddressMutation.mutateAsync,
    deleteAddressAsync: deleteAddressMutation.mutateAsync,

    // Estados
    isCreating: createAddressMutation.isPending,
    isUpdating: updateAddressMutation.isPending,
    isDeleting: deleteAddressMutation.isPending,
  };
}
