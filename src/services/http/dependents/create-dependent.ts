import { api } from "@/services/api";
import { CreateDependentDTO, DependentResponse } from "@/types";

/**
 * Cria um novo dependente
 * @param data - Dados do dependente a ser criado
 * @param token - Token de autenticação
 * @returns Promise com a resposta da API
 */
export async function createDependent(
  data: CreateDependentDTO,
  token: string
): Promise<DependentResponse> {
  try {
    const response = await api.post("/dependents", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    // Re-throw com informações estruturadas para o error handler
    throw {
      ...(error && typeof error === "object"
        ? error
        : { message: String(error) }),
      context: {
        operation: "createDependent",
        endpoint: "/dependents",
        method: "POST",
        data,
      },
    };
  }
}
