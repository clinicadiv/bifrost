import {
  ErrorAction,
  ErrorCategory,
  ErrorCategoryConfig,
  ErrorCode,
  StandardErrorResponse,
} from "./types";

/**
 * Classificador de erros baseado nas especificações da API
 * Mapeia erros RFC7807 para configurações de tratamento
 */
export class ErrorClassifier {
  private static readonly categoryConfigs: Record<
    ErrorCategory,
    ErrorCategoryConfig
  > = {
    validation: {
      category: "validation",
      httpStatus: 400,
      description: "Dados de entrada inválidos",
      defaultAction: "highlight-field",
      retryable: false,
      showToUser: true,
      logLevel: "warn",
    },
    authentication: {
      category: "authentication",
      httpStatus: 401,
      description: "Falha na autenticação",
      defaultAction: "redirect-login",
      retryable: false,
      showToUser: true,
      logLevel: "warn",
    },
    authorization: {
      category: "authorization",
      httpStatus: 403,
      description: "Permissões insuficientes",
      defaultAction: "show-modal",
      retryable: false,
      showToUser: true,
      logLevel: "warn",
    },
    "not-found": {
      category: "not-found",
      httpStatus: 404,
      description: "Recurso não encontrado",
      defaultAction: "show-modal",
      retryable: false,
      showToUser: true,
      logLevel: "warn",
    },
    conflict: {
      category: "conflict",
      httpStatus: 409,
      description: "Conflito de dados",
      defaultAction: "show-modal",
      retryable: false,
      showToUser: true,
      logLevel: "warn",
    },
    "business-rule": {
      category: "business-rule",
      httpStatus: 422,
      description: "Regra de negócio violada",
      defaultAction: "show-modal",
      retryable: false,
      showToUser: true,
      logLevel: "warn",
    },
    "rate-limit": {
      category: "rate-limit",
      httpStatus: 429,
      description: "Limite de requisições",
      defaultAction: "retry",
      retryable: true,
      showToUser: true,
      logLevel: "warn",
    },
    payment: {
      category: "payment",
      httpStatus: 402,
      description: "Erros de pagamento",
      defaultAction: "redirect-payment",
      retryable: false,
      showToUser: true,
      logLevel: "error",
    },
    "external-service": {
      category: "external-service",
      httpStatus: 502,
      description: "Falha em serviço externo",
      defaultAction: "retry",
      retryable: true,
      showToUser: true,
      logLevel: "error",
    },
    internal: {
      category: "internal",
      httpStatus: 500,
      description: "Erro interno do servidor",
      defaultAction: "report-bug",
      retryable: false,
      showToUser: true,
      logLevel: "error",
    },
  };

  private static readonly codeToCategory: Record<ErrorCode, ErrorCategory> = {
    // Validação
    REQUIRED_FIELD: "validation",
    INVALID_FORMAT: "validation",
    INVALID_LENGTH: "validation",
    INVALID_VALUE: "validation",
    INVALID_RANGE: "validation",

    // Autenticação
    INVALID_CREDENTIALS: "authentication",
    TOKEN_EXPIRED: "authentication",
    TOKEN_INVALID: "authentication",
    LOGIN_REQUIRED: "authentication",

    // Autorização
    INSUFFICIENT_PERMISSIONS: "authorization",
    SUBSCRIPTION_REQUIRED: "authorization",
    PLAN_RESTRICTION: "authorization",

    // Recursos
    USER_NOT_FOUND: "not-found",
    APPOINTMENT_NOT_FOUND: "not-found",
    SERVICE_NOT_FOUND: "not-found",

    // Conflitos
    DUPLICATE_EMAIL: "conflict",
    APPOINTMENT_CONFLICT: "conflict",
    RESOURCE_ALREADY_EXISTS: "conflict",

    // Regras de Negócio
    PLAN_LIMIT_EXCEEDED: "business-rule",
    DEPENDENT_LIMIT_REACHED: "business-rule",
    INSUFFICIENT_BALANCE: "business-rule",

    // Pagamento
    PAYMENT_FAILED: "payment",
    PAYMENT_DECLINED: "payment",
    INSUFFICIENT_FUNDS: "payment",

    // Sistema
    INTERNAL_SERVER_ERROR: "internal",
    SERVICE_UNAVAILABLE: "external-service",
    DATABASE_ERROR: "internal",
  };

  private static readonly statusToCategory: Record<number, ErrorCategory> = {
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

  /**
   * Classifica um erro baseado no código ou status HTTP
   */
  public static classify(error: StandardErrorResponse): ErrorCategoryConfig {
    // Primeiro tenta classificar pelo código específico
    if (error.code && this.codeToCategory[error.code as ErrorCode]) {
      const category = this.codeToCategory[error.code as ErrorCode];
      return this.categoryConfigs[category];
    }

    // Depois tenta pelo category se disponível
    if (
      error.category &&
      this.categoryConfigs[error.category as ErrorCategory]
    ) {
      return this.categoryConfigs[error.category as ErrorCategory];
    }

    // Por último, classifica pelo status HTTP
    if (error.status && this.statusToCategory[error.status]) {
      const category = this.statusToCategory[error.status];
      return this.categoryConfigs[category];
    }

    // Fallback para erro interno
    return this.categoryConfigs.internal;
  }

  /**
   * Verifica se um erro é retryable baseado na metadata ou classificação
   */
  public static isRetryable(error: StandardErrorResponse): boolean {
    // Primeiro verifica a metadata específica
    if (error.metadata?.retryable !== undefined) {
      return error.metadata.retryable;
    }

    // Depois verifica pela classificação
    const config = this.classify(error);
    return config.retryable;
  }

  /**
   * Obtém o tempo de retry baseado na metadata ou padrões
   */
  public static getRetryAfter(error: StandardErrorResponse): number {
    // Verifica header Retry-After ou metadata
    if (error.metadata?.retryAfter) {
      return error.metadata.retryAfter * 1000; // converte para ms
    }

    // Padrões por categoria
    const config = this.classify(error);
    if (config.category === "rate-limit") {
      return 60000; // 1 minuto para rate limit
    }
    if (config.category === "external-service") {
      return 5000; // 5 segundos para serviços externos
    }

    return 1000; // 1 segundo padrão
  }

  /**
   * Determina a ação padrão para um erro
   */
  public static getDefaultAction(error: StandardErrorResponse): ErrorAction {
    const config = this.classify(error);

    // Ações específicas por código
    if (error.code) {
      switch (error.code as ErrorCode) {
        case "TOKEN_EXPIRED":
        case "LOGIN_REQUIRED":
          return "redirect-login";

        case "SUBSCRIPTION_REQUIRED":
        case "PLAN_RESTRICTION":
          return "redirect-payment";

        case "REQUIRED_FIELD":
        case "INVALID_FORMAT":
        case "INVALID_VALUE":
          return "highlight-field";

        case "PAYMENT_FAILED":
        case "PAYMENT_DECLINED":
          return "redirect-payment";

        default:
          return config.defaultAction;
      }
    }

    return config.defaultAction;
  }

  /**
   * Gera mensagem user-friendly baseada no erro
   */
  public static getUserMessage(error: StandardErrorResponse): string {
    // Se já tem uma mensagem user-friendly, usa ela
    if (
      error.title &&
      !error.title.includes("Error") &&
      !error.title.includes("Exception")
    ) {
      return error.title;
    }

    // Mensagens específicas por código
    if (error.code) {
      const messages: Record<string, string> = {
        REQUIRED_FIELD: "Este campo é obrigatório",
        INVALID_FORMAT: "Formato inválido",
        INVALID_EMAIL: "Email inválido",
        INVALID_CREDENTIALS: "Email ou senha incorretos",
        TOKEN_EXPIRED: "Sua sessão expirou. Faça login novamente",
        INSUFFICIENT_PERMISSIONS: "Você não tem permissão para esta ação",
        USER_NOT_FOUND: "Usuário não encontrado",
        DUPLICATE_EMAIL: "Este email já está em uso",
        PLAN_LIMIT_EXCEEDED: "Limite do plano atingido",
        PAYMENT_FAILED: "Falha no pagamento",
        SERVICE_UNAVAILABLE: "Serviço temporariamente indisponível",
      };

      if (messages[error.code]) {
        return messages[error.code];
      }
    }

    // Mensagens padrão por categoria
    const config = this.classify(error);
    const defaultMessages: Record<ErrorCategory, string> = {
      validation: "Dados inválidos. Verifique os campos e tente novamente",
      authentication: "Erro de autenticação. Faça login novamente",
      authorization: "Você não tem permissão para esta ação",
      "not-found": "Recurso não encontrado",
      conflict: "Conflito nos dados. Verifique as informações",
      "business-rule": "Operação não permitida pelas regras de negócio",
      "rate-limit": "Muitas tentativas. Aguarde um momento e tente novamente",
      payment: "Erro no pagamento. Verifique os dados e tente novamente",
      "external-service":
        "Serviço temporariamente indisponível. Tente novamente",
      internal: "Erro interno. Nossa equipe foi notificada",
    };

    return defaultMessages[config.category] || "Ocorreu um erro inesperado";
  }

  /**
   * Obtém configuração de uma categoria específica
   */
  public static getCategoryConfig(
    category: ErrorCategory
  ): ErrorCategoryConfig {
    return this.categoryConfigs[category];
  }

  /**
   * Lista todas as categorias disponíveis
   */
  public static getAllCategories(): ErrorCategory[] {
    return Object.keys(this.categoryConfigs) as ErrorCategory[];
  }
}
