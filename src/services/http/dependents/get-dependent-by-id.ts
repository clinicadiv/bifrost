import { api } from "@/services/api";
import { DependentResponse } from "@/types";

/**
 * Busca um dependente específico por ID
 * @param id - ID do dependente
 * @param token - Token de autenticação
 * @returns Promise com os dados do dependente
 */
export async function getDependentById(
  id: string,
  token: string
): Promise<DependentResponse> {
  try {
    const response = await api.get(`/dependents/${id}`, {
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
        operation: "getDependentById",
        endpoint: `/dependents/${id}`,
        method: "GET",
        dependentId: id,
      },
    };
  }
}
