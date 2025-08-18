import { errorHandler } from "@/utils/errorHandler/ErrorHandler";
import { StandardErrorResponse } from "@/utils/errorHandler/types";
import axios, { AxiosError, AxiosResponse } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Request interceptor - adiciona headers padrão e logging
api.interceptors.request.use(
  (config) => {
    // Adiciona timestamp para rastreamento
    config.metadata = {
      startTime: Date.now(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // Headers padrão
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    // Log da requisição em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
        headers: config.headers,
      });
    }

    return config;
  },
  (error) => {
    console.error("[API] Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - processa respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log da resposta em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      const duration = Date.now() - (response.config.metadata?.startTime || 0);
      console.log(
        `[API] ${response.status} ${response.config.method?.toUpperCase()} ${
          response.config.url
        } (${duration}ms)`,
        {
          data: response.data,
          headers: response.headers,
        }
      );
    }

    return response;
  },
  (error: AxiosError) => {
    // Processa o erro através do sistema centralizado
    const standardError = normalizeAxiosError(error);

    // Log estruturado do erro
    if (process.env.NODE_ENV === "development") {
      const duration = Date.now() - (error.config?.metadata?.startTime || 0);
      console.error(
        `[API] ${
          error.response?.status || "Network"
        } ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        } (${duration}ms)`,
        {
          error: standardError,
          originalError: error,
        }
      );
    }

    // Processa através do error handler (mas não exibe automaticamente)
    const result = errorHandler.handleError(standardError, {
      endpoint: error.config?.url,
      showToast: false, // Deixa para o componente decidir como exibir
    });

    // Adiciona o resultado do processamento ao erro
    const enhancedError = {
      ...standardError,
      handlerResult: result,
    };

    return Promise.reject(enhancedError);
  }
);

/**
 * Normaliza erros do Axios para o padrão RFC7807
 */
function normalizeAxiosError(error: AxiosError): StandardErrorResponse {
  const requestId = error.config?.metadata?.requestId || `req_${Date.now()}`;
  const timestamp = new Date().toISOString();
  const instance = error.config?.url || "";

  // Se a API já retorna no formato RFC7807
  if (error.response?.data && typeof error.response.data === "object") {
    const data = error.response.data as any;

    if (data.type && data.title) {
      return {
        ...data,
        status: data.status || error.response.status,
        instance: data.instance || instance,
        requestId: data.requestId || requestId,
        timestamp: data.timestamp || timestamp,
      };
    }

    // Converte formato customizado para RFC7807
    return {
      type: `https://api.clinica.com/errors/${
        data.category || getCategoryFromStatus(error.response.status)
      }/${data.code || "unknown"}`,
      title:
        data.message || data.title || getDefaultTitle(error.response.status),
      status: error.response.status,
      detail:
        data.detail || data.message || error.message || "Erro na requisição",
      instance,
      code: data.code || getDefaultCode(error.response.status),
      category: data.category || getCategoryFromStatus(error.response.status),
      requestId,
      timestamp,
      errors: data.errors,
      metadata: {
        ...data.metadata,
        retryable: isRetryableStatus(error.response.status),
      },
      context: {
        userAgent: navigator.userAgent,
        endpoint: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      },
      suggestions: data.suggestions,
      documentation: data.documentation,
      supportContact: data.supportContact,
    };
  }

  // Erro de rede ou timeout
  if (!error.response) {
    return {
      type: "https://api.clinica.com/errors/network/connection-failed",
      title: "Erro de conexão",
      status: 0,
      detail:
        error.code === "ECONNABORTED"
          ? "Tempo limite da requisição excedido"
          : "Não foi possível conectar ao servidor. Verifique sua conexão.",
      instance,
      code: error.code === "ECONNABORTED" ? "TIMEOUT" : "NETWORK_ERROR",
      category: "external-service",
      requestId,
      timestamp,
      metadata: {
        retryable: true,
        retryAfter: 5,
      },
      context: {
        userAgent: navigator.userAgent,
        endpoint: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      },
    };
  }

  // Erro HTTP sem dados estruturados
  return {
    type: `https://api.clinica.com/errors/http/${error.response.status}`,
    title: getDefaultTitle(error.response.status),
    status: error.response.status,
    detail: error.message || `Erro HTTP ${error.response.status}`,
    instance,
    code: getDefaultCode(error.response.status),
    category: getCategoryFromStatus(error.response.status),
    requestId,
    timestamp,
    metadata: {
      retryable: isRetryableStatus(error.response.status),
    },
    context: {
      userAgent: navigator.userAgent,
      endpoint: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    },
  };
}

/**
 * Mapeia status HTTP para categoria de erro
 */
function getCategoryFromStatus(status: number): string {
  const statusMap: Record<number, string> = {
    400: "validation",
    401: "authentication",
    403: "authorization",
    404: "not-found",
    409: "conflict",
    422: "business-rule",
    429: "rate-limit",
    402: "payment",
    500: "internal",
    502: "external-service",
    503: "external-service",
    504: "external-service",
  };

  return statusMap[status] || "internal";
}

/**
 * Gera código de erro padrão baseado no status
 */
function getDefaultCode(status: number): string {
  const codeMap: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "UNPROCESSABLE_ENTITY",
    429: "TOO_MANY_REQUESTS",
    402: "PAYMENT_REQUIRED",
    500: "INTERNAL_SERVER_ERROR",
    502: "BAD_GATEWAY",
    503: "SERVICE_UNAVAILABLE",
    504: "GATEWAY_TIMEOUT",
  };

  return codeMap[status] || "UNKNOWN_ERROR";
}

/**
 * Gera título padrão baseado no status
 */
function getDefaultTitle(status: number): string {
  const titleMap: Record<number, string> = {
    400: "Dados inválidos",
    401: "Não autorizado",
    403: "Acesso negado",
    404: "Recurso não encontrado",
    409: "Conflito nos dados",
    422: "Dados não processáveis",
    429: "Muitas tentativas",
    402: "Pagamento necessário",
    500: "Erro interno",
    502: "Serviço indisponível",
    503: "Serviço indisponível",
    504: "Tempo limite excedido",
  };

  return titleMap[status] || "Erro desconhecido";
}

/**
 * Verifica se um status HTTP é retryable
 */
function isRetryableStatus(status: number): boolean {
  return [429, 500, 502, 503, 504].includes(status);
}

// Adiciona tipos para metadata do axios
declare module "axios" {
  interface AxiosRequestConfig {
    metadata?: {
      startTime?: number;
      requestId?: string;
    };
  }
}
