import { api } from "@/services/api";
import { DependentResponse, UpdateDependentDTO } from "@/types";

/**
 * Atualiza os dados de um dependente
 * @param id - ID do dependente
 * @param data - Dados a serem atualizados
 * @param token - Token de autenticação
 * @returns Promise com a resposta da API
 */
export async function updateDependent(
  id: string,
  data: UpdateDependentDTO,
  token: string
): Promise<DependentResponse> {
  try {
    const response = await api.put(`/dependents/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    throw {
      ...(error && typeof error === "object"
        ? error
        : { message: String(error) }),
      context: {
        operation: "updateDependent",
        endpoint: `/dependents/${id}`,
        method: "PUT",
        dependentId: id,
        data,
      },
    };
  }
}
