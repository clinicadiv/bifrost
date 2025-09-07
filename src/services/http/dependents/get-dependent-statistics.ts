import { api } from "@/services/api";
import { DependentStatisticsResponse } from "@/types";

/**
 * Busca estatísticas dos dependentes do usuário
 * @param userId - ID do usuário
 * @param token - Token de autenticação
 * @returns Promise com as estatísticas
 */
export async function getDependentStatistics(
  userId: string,
  token: string
): Promise<DependentStatisticsResponse> {
  try {
    const response = await api.get(`/dependents/statistics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        userId,
      },
    });

    return response.data;
  } catch (error: unknown) {
    throw {
      ...(error && typeof error === "object"
        ? error
        : { message: String(error) }),
      context: {
        operation: "getDependentStatistics",
        endpoint: `/dependents/statistics`,
        method: "GET",
        userId,
      },
    };
  }
}
