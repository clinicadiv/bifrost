import { api } from "@/services/api";
import { DependentsListResponse } from "@/types";

/**
 * Busca dependentes por ID do usuário
 * @param userId - ID do usuário
 * @param token - Token de autenticação
 * @returns Promise com a lista de dependentes
 */
export async function getDependentsByUser(
  userId: string,
  token: string
): Promise<DependentsListResponse> {
  try {
    const response = await api.get(`/dependents/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: unknown) {
    throw {
      ...(error && typeof error === "object"
        ? error
        : { message: String(error) }),
      context: {
        operation: "getDependentsByUser",
        endpoint: `/dependents/user/${userId}`,
        method: "GET",
        userId,
      },
    };
  }
}
