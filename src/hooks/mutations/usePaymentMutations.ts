"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useReactQueryErrorHandler } from "@/hooks/useReactQueryErrorHandler";
import { queryKeys } from "@/lib/query-keys";
import { createCreditCardPayment } from "@/services/http/payments/create-credit-card-payment";
import { createPayment } from "@/services/http/payments/create-payment";
import { createPixPayment } from "@/services/http/payments/create-pix-payment";
import { getInstallments } from "@/services/http/payments/get-installments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Interfaces para mutations
interface CreatePixPaymentParams {
  appointmentId: string;
  amount: number;
  description?: string;
}

interface CreateCreditCardPaymentParams {
  appointmentId: string;
  amount: number;
  installments: number;
  cardData: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  billingAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

interface CreatePaymentParams {
  appointmentId: string;
  paymentMethod: "PIX" | "CREDIT_CARD";
  amount: number;
  installments?: number;
  cardData?: CreateCreditCardPaymentParams["cardData"];
  billingAddress?: CreateCreditCardPaymentParams["billingAddress"];
}

/**
 * Hook para buscar opções de parcelamento
 */
export function useInstallmentOptions(amount: number) {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.paymentInstallments(amount),

    queryFn: async () => {
      if (!token) throw new Error("Token required");
      return getInstallments(amount, token);
    },

    enabled: !!token && amount > 0,

    // Cache por 5 minutos (dados estáveis)
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,

    // Transformar dados para facilitar uso
    select: (data) => {
      if (!data.success) {
        return {
          installments: [],
          maxInstallments: 1,
          hasInstallmentOptions: false,
        };
      }

      const installments = data.data?.installments || [];

      return {
        installments,
        maxInstallments: installments.length,
        hasInstallmentOptions: installments.length > 1,
        // Organizar por número de parcelas
        installmentMap: installments.reduce((acc, inst) => {
          acc[inst.installmentNumber] = inst;
          return acc;
        }, {} as Record<number, any>),
      };
    },
  });
}

/**
 * Hook para criar pagamento PIX
 */
export function useCreatePixPayment() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { user, token } = useAuthStore();

  return useMutation({
    mutationFn: async (params: CreatePixPaymentParams) => {
      if (!token) throw new Error("Token required");
      return createPixPayment(params, token);
    },

    onSuccess: (data, variables) => {
      // Invalidar appointments do usuário
      if (user?.id) {
        queryClient.invalidateQueries(queryKeys.appointmentsByUser(user.id));
      }

      // Invalidar dados do appointment específico
      queryClient.invalidateQueries(
        queryKeys.appointmentDetail(variables.appointmentId)
      );
    },

    onError: handleMutationError,
  });
}

/**
 * Hook para criar pagamento com cartão de crédito
 */
export function useCreateCreditCardPayment() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { user, token } = useAuthStore();

  return useMutation({
    mutationFn: async (params: CreateCreditCardPaymentParams) => {
      if (!token) throw new Error("Token required");
      return createCreditCardPayment(params, token);
    },

    onSuccess: (data, variables) => {
      // Invalidar appointments do usuário
      if (user?.id) {
        queryClient.invalidateQueries(queryKeys.appointmentsByUser(user.id));
      }

      // Invalidar dados do appointment específico
      queryClient.invalidateQueries(
        queryKeys.appointmentDetail(variables.appointmentId)
      );
    },

    onError: handleMutationError,
  });
}

/**
 * Hook para criar pagamento genérico
 */
export function useCreatePayment() {
  const queryClient = useQueryClient();
  const { handleMutationError } = useReactQueryErrorHandler();
  const { user, token } = useAuthStore();

  return useMutation({
    mutationFn: async (params: CreatePaymentParams) => {
      if (!token) throw new Error("Token required");
      return createPayment(params, token);
    },

    onSuccess: (data, variables) => {
      // Invalidar appointments do usuário
      if (user?.id) {
        queryClient.invalidateQueries(queryKeys.appointmentsByUser(user.id));
      }

      // Invalidar dados do appointment específico
      queryClient.invalidateQueries(
        queryKeys.appointmentDetail(variables.appointmentId)
      );

      // Invalidar opções de parcelamento se foi cartão
      if (variables.paymentMethod === "CREDIT_CARD") {
        queryClient.invalidateQueries(
          queryKeys.paymentInstallments(variables.amount)
        );
      }
    },

    onError: handleMutationError,
  });
}

/**
 * Hook combinado para todas as operações de pagamento
 *
 * Simplifica o uso nas páginas
 */
export function usePaymentOperations() {
  const createPixPayment = useCreatePixPayment();
  const createCreditCardPayment = useCreateCreditCardPayment();
  const createPayment = useCreatePayment();

  return {
    // Mutations
    createPixPayment: createPixPayment.mutate,
    createPixPaymentAsync: createPixPayment.mutateAsync,
    createCreditCardPayment: createCreditCardPayment.mutate,
    createCreditCardPaymentAsync: createCreditCardPayment.mutateAsync,
    createPayment: createPayment.mutate,
    createPaymentAsync: createPayment.mutateAsync,

    // Loading states
    isCreatingPixPayment: createPixPayment.isPending,
    isCreatingCreditCardPayment: createCreditCardPayment.isPending,
    isCreatingPayment: createPayment.isPending,
    isLoading:
      createPixPayment.isPending ||
      createCreditCardPayment.isPending ||
      createPayment.isPending,

    // Error states
    pixPaymentError: createPixPayment.error,
    creditCardPaymentError: createCreditCardPayment.error,
    paymentError: createPayment.error,

    // Success data
    pixPaymentData: createPixPayment.data,
    creditCardPaymentData: createCreditCardPayment.data,
    paymentData: createPayment.data,

    // Reset functions
    resetPixPaymentError: createPixPayment.reset,
    resetCreditCardPaymentError: createCreditCardPayment.reset,
    resetPaymentError: createPayment.reset,
  };
}
