import { ErrorClassifier } from "./ErrorClassifier";
import { RetryManager } from "./RetryManager";
import {
  ErrorContext,
  ErrorHandlerResult,
  ErrorState,
  RetryConfig,
  StandardErrorResponse,
} from "./types";

/**
 * Classe principal para tratamento centralizado de erros
 * Implementa o padrão RFC7807 e integra com o sistema de retry
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private retryManager: RetryManager;
  private state: ErrorState;
  private listeners: Array<
    (error: StandardErrorResponse, result: ErrorHandlerResult) => void
  > = [];
  private loggerFn?: (level: string, message: string, error?: any) => void;

  private constructor() {
    this.retryManager = new RetryManager();
    this.state = {
      currentError: null,
      isRetrying: false,
      retryAttempts: 0,
      lastRetryAt: null,
      history: [],
    };
  }

  /**
   * Obtém a instância singleton do ErrorHandler
   */
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Configura função de logging personalizada
   */
  public setLogger(
    loggerFn: (level: string, message: string, error?: any) => void
  ): void {
    this.loggerFn = loggerFn;
  }

  /**
   * Adiciona listener para eventos de erro
   */
  public addListener(
    listener: (error: StandardErrorResponse, result: ErrorHandlerResult) => void
  ): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Processa um erro e retorna como deve ser tratado
   */
  public handleError(error: any, context?: ErrorContext): ErrorHandlerResult {
    const standardError = this.normalizeError(error);

    // Atualiza estado
    this.updateState(standardError);

    // Classifica o erro
    const classification = ErrorClassifier.classify(standardError);
    const action = context?.customActions?.length
      ? "show-modal"
      : ErrorClassifier.getDefaultAction(standardError);
    const message = ErrorClassifier.getUserMessage(standardError);

    const result: ErrorHandlerResult = {
      handled: true,
      action,
      message,
      title: standardError.title || classification.description,
      retryable: ErrorClassifier.isRetryable(standardError),
      context,
      metadata: {
        retryAfter: ErrorClassifier.getRetryAfter(standardError),
        retryAttempts: this.state.retryAttempts,
        maxRetries: this.retryManager.getConfig().maxAttempts,
      },
    };

    // Log do erro
    this.logError(standardError, classification.logLevel);

    // Notifica listeners
    this.notifyListeners(standardError, result);

    return result;
  }

  /**
   * Executa uma função com retry automático
   */
  public async withRetry<T>(
    fn: () => Promise<T>,
    context?: ErrorContext
  ): Promise<T> {
    const requestId = `req_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    try {
      this.state.isRetrying = true;

      return await this.retryManager.withRetry(
        fn,
        requestId,
        (attempt, maxAttempts) => {
          this.state.retryAttempts = attempt;
          context?.onRetry?.();
        }
      );
    } catch (error) {
      const result = this.handleError(error, context);
      const enhancedError =
        error && typeof error === "object"
          ? { ...error, handlerResult: result }
          : { error, handlerResult: result };
      throw enhancedError;
    } finally {
      this.state.isRetrying = false;
      this.state.retryAttempts = 0;
    }
  }

  /**
   * Trata erros de validação de formulário
   */
  public handleValidationErrors(
    error: StandardErrorResponse,
    formId?: string
  ): Record<string, string> {
    const fieldErrors: Record<string, string> = {};

    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((fieldError) => {
        if (fieldError.field) {
          fieldErrors[fieldError.field] =
            fieldError.message || ErrorClassifier.getUserMessage(error);
        }
      });
    } else if (error.detail && formId) {
      // Se não tem erros específicos por campo, aplica ao formulário geral
      fieldErrors[formId] = error.detail;
    }

    return fieldErrors;
  }

  /**
   * Verifica se deve mostrar um erro para o usuário
   */
  public shouldShowToUser(error: StandardErrorResponse): boolean {
    const classification = ErrorClassifier.classify(error);
    return classification.showToUser;
  }

  /**
   * Obtém sugestões de ação para um erro
   */
  public getSuggestions(error: StandardErrorResponse): string[] {
    if (error.suggestions && Array.isArray(error.suggestions)) {
      return error.suggestions;
    }

    const suggestions: string[] = [];
    const classification = ErrorClassifier.classify(error);

    switch (classification.category) {
      case "validation":
        suggestions.push("Verifique os dados informados");
        suggestions.push(
          "Certifique-se de que todos os campos obrigatórios estão preenchidos"
        );
        break;

      case "authentication":
        suggestions.push("Faça login novamente");
        suggestions.push("Verifique suas credenciais");
        break;

      case "authorization":
        suggestions.push(
          "Entre em contato com o suporte se precisar de mais permissões"
        );
        suggestions.push("Verifique se sua assinatura está ativa");
        break;

      case "rate-limit":
        suggestions.push("Aguarde alguns minutos antes de tentar novamente");
        suggestions.push("Evite fazer muitas requisições em pouco tempo");
        break;

      case "payment":
        suggestions.push("Verifique os dados do cartão");
        suggestions.push("Certifique-se de que há limite disponível");
        break;

      case "external-service":
        suggestions.push("Tente novamente em alguns minutos");
        suggestions.push("Verifique sua conexão com a internet");
        break;

      default:
        suggestions.push("Tente novamente");
        if (error.supportContact) {
          suggestions.push(`Entre em contato: ${error.supportContact}`);
        }
    }

    return suggestions;
  }

  /**
   * Obtém o estado atual do sistema de erros
   */
  public getState(): ErrorState {
    return { ...this.state };
  }

  /**
   * Limpa o estado atual de erro
   */
  public clearError(): void {
    this.state.currentError = null;
  }

  /**
   * Configura o retry manager
   */
  public configureRetry(config: Partial<RetryConfig>): void {
    this.retryManager.updateConfig(config);
  }

  /**
   * Cancela todos os retries pendentes
   */
  public cancelRetries(): void {
    this.retryManager.cancelAllRetries();
  }

  /**
   * Normaliza diferentes tipos de erro para o padrão RFC7807
   */
  private normalizeError(error: any): StandardErrorResponse {
    // Se já é um StandardErrorResponse
    if (error && typeof error === "object" && error.type && error.title) {
      return error as StandardErrorResponse;
    }

    // Se é um erro do Axios
    if (error?.response?.data) {
      const data = error.response.data;

      // Se o backend já retorna no formato RFC7807
      if (data.type && data.title) {
        return {
          ...data,
          status: data.status || error.response.status,
          instance: data.instance || error.config?.url || "",
        };
      }

      // Converte formato customizado para RFC7807
      return {
        type: `https://api.clinica.com/errors/${data.category || "unknown"}/${
          data.code || "unknown"
        }`,
        title: data.message || data.title || "Erro desconhecido",
        status: error.response.status,
        detail: data.detail || data.message || error.message,
        instance: error.config?.url || "",
        code: data.code || "UNKNOWN_ERROR",
        category:
          data.category || this.getCategoryFromStatus(error.response.status),
        requestId: data.requestId || `req_${Date.now()}`,
        timestamp: data.timestamp || new Date().toISOString(),
        errors: data.errors,
        metadata: data.metadata,
        context: data.context,
        suggestions: data.suggestions,
        documentation: data.documentation,
        supportContact: data.supportContact,
      };
    }

    // Erro JavaScript padrão
    return {
      type: "https://api.clinica.com/errors/internal/javascript-error",
      title: "Erro interno",
      status: 500,
      detail: error?.message || "Erro desconhecido",
      instance: "",
      code: "INTERNAL_SERVER_ERROR",
      category: "internal",
      requestId: `req_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Atualiza o estado interno
   */
  private updateState(error: StandardErrorResponse): void {
    this.state.currentError = error;
    this.state.history.unshift(error);

    // Mantém apenas os últimos 10 erros no histórico
    if (this.state.history.length > 10) {
      this.state.history = this.state.history.slice(0, 10);
    }
  }

  /**
   * Determina categoria baseada no status HTTP
   */
  private getCategoryFromStatus(status: number): string {
    const statusMap: Record<number, string> = {
      400: "validation",
      401: "authentication",
      403: "authorization",
      404: "not-found",
      409: "conflict",
      422: "business-rule",
      429: "rate-limit",
      500: "internal",
      502: "external-service",
      503: "external-service",
      504: "external-service",
    };

    return statusMap[status] || "internal";
  }

  /**
   * Log estruturado do erro
   */
  private logError(error: StandardErrorResponse, level: string): void {
    const logData = {
      type: error.type,
      code: error.code,
      category: error.category,
      status: error.status,
      message: error.title,
      detail: error.detail,
      requestId: error.requestId,
      timestamp: error.timestamp,
      instance: error.instance,
    };

    if (this.loggerFn) {
      this.loggerFn(level, `Error ${error.code || error.status}`, logData);
    } else {
      const logMethod =
        level === "error"
          ? console.error
          : level === "warn"
          ? console.warn
          : console.info;
      logMethod(
        `[ErrorHandler] ${error.code || error.status}: ${error.title}`,
        logData
      );
    }
  }

  /**
   * Notifica todos os listeners sobre o erro
   */
  private notifyListeners(
    error: StandardErrorResponse,
    result: ErrorHandlerResult
  ): void {
    this.listeners.forEach((listener) => {
      try {
        listener(error, result);
      } catch (err) {
        console.error("[ErrorHandler] Erro no listener:", err);
      }
    });
  }
}

// Exporta instância singleton para uso direto
export const errorHandler = ErrorHandler.getInstance();
