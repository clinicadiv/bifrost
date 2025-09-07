import { api } from "@/services/api";

/**
 * Remove um dependente (soft delete)
 * @param id - ID do dependente
 * @param token - Token de autenticação
 * @returns Promise com a resposta da API
 */
export async function deleteDependent(
  id: string,
  token: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(`/dependents/${id}`, {
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
        operation: "deleteDependent",
        endpoint: `/dependents/${id}`,
        method: "DELETE",
        dependentId: id,
      },
    };
  }
}
