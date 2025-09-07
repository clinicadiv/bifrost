import { api } from "@/services/api";
import { ValidateDependentForPlanDTO } from "@/types";

/**
 * Valida se um dependente pode ser adicionado ao plano
 * @param data - Dados do dependente para validação
 * @param token - Token de autenticação
 * @returns Promise com a resposta da validação
 */
export async function validateDependentForPlan(
  data: ValidateDependentForPlanDTO,
  token: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post("/dependents/validate", data, {
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
        operation: "validateDependentForPlan",
        endpoint: "/dependents/validate",
        method: "POST",
        data,
      },
    };
  }
}
