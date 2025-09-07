import { api } from "@/services/api";
import { DependentResponse } from "@/types";

/**
 * Reativa um dependente
 * @param id - ID do dependente
 * @param token - Token de autenticação
 * @returns Promise com a resposta da API
 */
export async function reactivateDependent(
  id: string,
  token: string
): Promise<DependentResponse> {
  try {
    const response = await api.post(
      `/dependents/${id}/reactivate`,
      {},
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
        operation: "reactivateDependent",
        endpoint: `/dependents/${id}/reactivate`,
        method: "POST",
        dependentId: id,
      },
    };
  }
}
