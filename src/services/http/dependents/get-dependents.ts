import { api } from "@/services/api";
import {
  DependentFilters,
  DependentsListResponse,
  PaginatedDependentsResponse,
} from "@/types";

/**
 * Busca todos os dependentes do usuário
 * @param token - Token de autenticação
 * @returns Promise com a lista de dependentes
 */
export async function getDependents(
  token: string
): Promise<DependentsListResponse> {
  try {
    const response = await api.get("/dependents", {
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
        operation: "getDependents",
        endpoint: "/dependents",
        method: "GET",
      },
    };
  }
}

/**
 * Busca dependentes com filtros e paginação
 * @param filters - Filtros de busca
 * @param token - Token de autenticação
 * @returns Promise com a lista paginada de dependentes
 */
export async function getDependentsWithFilters(
  filters: DependentFilters,
  token: string
): Promise<PaginatedDependentsResponse> {
  try {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.status !== undefined)
      params.append("status", filters.status.toString());
    if (filters.relationship)
      params.append("relationship", filters.relationship);
    if (filters.search) params.append("search", filters.search);
    if (filters.subscriptionId)
      params.append("subscriptionId", filters.subscriptionId);
    if (filters.userId) params.append("userId", filters.userId);

    const response = await api.get(`/dependents?${params.toString()}`, {
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
        operation: "getDependentsWithFilters",
        endpoint: "/dependents",
        method: "GET",
        filters,
      },
    };
  }
}

/**
 * Busca dependentes do usuário logado
 * @param token - Token de autenticação
 * @returns Promise com a lista de dependentes
 */
export async function getMyDependents(
  token: string
): Promise<DependentsListResponse> {
  try {
    const response = await api.get("/dependents/my", {
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
        operation: "getMyDependents",
        endpoint: "/dependents/my",
        method: "GET",
      },
    };
  }
}
