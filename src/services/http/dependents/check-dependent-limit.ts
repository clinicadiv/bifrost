import { api } from "@/services/api";
import { DependentLimitCheckResponse } from "@/types";

/**
 * Verifica o limite de dependentes para uma assinatura
 * @param subscriptionId - ID da assinatura
 * @param token - Token de autenticação
 * @returns Promise com informações sobre o limite
 */
export async function checkDependentLimit(
  subscriptionId: string,
  token: string
): Promise<DependentLimitCheckResponse> {
  try {
    const response = await api.get(
      `/dependents/limit-check/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    throw {
      ...(error && typeof error === "object"
        ? error
        : { message: String(error) }),
      context: {
        operation: "checkDependentLimit",
        endpoint: `/api/dependents/limit-check/${subscriptionId}`,
        method: "GET",
        subscriptionId,
      },
    };
  }
}
