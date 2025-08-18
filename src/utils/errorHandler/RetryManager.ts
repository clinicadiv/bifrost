import { ErrorClassifier } from "./ErrorClassifier";
import { ErrorCode, RetryConfig, StandardErrorResponse } from "./types";

/**
 * Gerenciador de retry automático para requisições falhadas
 * Implementa backoff exponencial e limites configuráveis
 */
export class RetryManager {
  private static readonly defaultConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000, // 1 segundo
    maxDelay: 30000, // 30 segundos
    backoffMultiplier: 2,
    retryableErrors: [
      "SERVICE_UNAVAILABLE",
      "INTERNAL_SERVER_ERROR",
      "DATABASE_ERROR",
    ],
    retryableStatuses: [429, 500, 502, 503, 504],
  };

  private config: RetryConfig;
  private retryAttempts = new Map<string, number>();
  private retryTimers = new Map<string, NodeJS.Timeout>();

  constructor(config?: Partial<RetryConfig>) {
    this.config = { ...RetryManager.defaultConfig, ...config };
  }

  /**
   * Verifica se um erro deve ser retryado
   */
  public shouldRetry(error: StandardErrorResponse, requestId: string): boolean {
    const attempts = this.retryAttempts.get(requestId) || 0;

    // Verifica limite de tentativas
    if (attempts >= this.config.maxAttempts) {
      return false;
    }

    // Verifica se o erro é retryable pela classificação
    if (!ErrorClassifier.isRetryable(error)) {
      return false;
    }

    // Verifica códigos específicos retryable
    if (
      error.code &&
      this.config.retryableErrors.includes(error.code as ErrorCode)
    ) {
      return true;
    }

    // Verifica status HTTP retryable
    if (error.status && this.config.retryableStatuses.includes(error.status)) {
      return true;
    }

    return false;
  }

  /**
   * Calcula o delay para o próximo retry usando backoff exponencial
   */
  public calculateDelay(
    error: StandardErrorResponse,
    requestId: string
  ): number {
    const attempts = this.retryAttempts.get(requestId) || 0;

    // Se o erro especifica um tempo de retry, usa ele
    const retryAfter = ErrorClassifier.getRetryAfter(error);
    if (retryAfter > 0) {
      return Math.min(retryAfter, this.config.maxDelay);
    }

    // Calcula backoff exponencial
    const delay =
      this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempts);

    // Adiciona jitter para evitar thundering herd
    const jitter = Math.random() * 0.1 * delay;

    return Math.min(delay + jitter, this.config.maxDelay);
  }

  /**
   * Agenda um retry para uma requisição
   */
  public scheduleRetry<T>(
    error: StandardErrorResponse,
    requestId: string,
    retryFunction: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onFinalFailure?: (error: StandardErrorResponse) => void
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.shouldRetry(error, requestId)) {
        onFinalFailure?.(error);
        reject(error);
        return;
      }

      const delay = this.calculateDelay(error, requestId);
      const attempts = (this.retryAttempts.get(requestId) || 0) + 1;
      this.retryAttempts.set(requestId, attempts);

      console.log(
        `Agendando retry ${attempts}/${this.config.maxAttempts} em ${delay}ms para request ${requestId}`
      );

      const timer = setTimeout(async () => {
        this.retryTimers.delete(requestId);

        try {
          const result = await retryFunction();
          this.retryAttempts.delete(requestId);
          onSuccess?.(result);
          resolve(result);
        } catch (retryError) {
          // Se falhou novamente, tenta retry recursivo
          if (
            retryError &&
            typeof retryError === "object" &&
            "status" in retryError
          ) {
            try {
              const nextResult = await this.scheduleRetry(
                retryError as StandardErrorResponse,
                requestId,
                retryFunction,
                onSuccess,
                onFinalFailure
              );
              resolve(nextResult);
            } catch (finalError) {
              reject(finalError);
            }
          } else {
            onFinalFailure?.(retryError as StandardErrorResponse);
            reject(retryError);
          }
        }
      }, delay);

      this.retryTimers.set(requestId, timer);
    });
  }

  /**
   * Cancela todos os retries pendentes para uma requisição
   */
  public cancelRetry(requestId: string): void {
    const timer = this.retryTimers.get(requestId);
    if (timer) {
      clearTimeout(timer);
      this.retryTimers.delete(requestId);
    }
    this.retryAttempts.delete(requestId);
  }

  /**
   * Cancela todos os retries pendentes
   */
  public cancelAllRetries(): void {
    for (const timer of this.retryTimers.values()) {
      clearTimeout(timer);
    }
    this.retryTimers.clear();
    this.retryAttempts.clear();
  }

  /**
   * Obtém o número de tentativas para uma requisição
   */
  public getAttempts(requestId: string): number {
    return this.retryAttempts.get(requestId) || 0;
  }

  /**
   * Verifica se uma requisição está em retry
   */
  public isRetrying(requestId: string): boolean {
    return this.retryTimers.has(requestId);
  }

  /**
   * Obtém estatísticas de retry
   */
  public getStats(): {
    activeRetries: number;
    totalAttempts: number;
    averageAttempts: number;
  } {
    const activeRetries = this.retryTimers.size;
    const attempts = Array.from(this.retryAttempts.values());
    const totalAttempts = attempts.reduce((sum, count) => sum + count, 0);
    const averageAttempts =
      attempts.length > 0 ? totalAttempts / attempts.length : 0;

    return {
      activeRetries,
      totalAttempts,
      averageAttempts,
    };
  }

  /**
   * Atualiza a configuração do retry manager
   */
  public updateConfig(newConfig: Partial<RetryConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Obtém a configuração atual
   */
  public getConfig(): RetryConfig {
    return { ...this.config };
  }

  /**
   * Reset completo do estado
   */
  public reset(): void {
    this.cancelAllRetries();
    this.config = { ...RetryManager.defaultConfig };
  }

  /**
   * Cria um wrapper para função que automaticamente implementa retry
   */
  public withRetry<T>(
    fn: () => Promise<T>,
    requestId?: string,
    onProgress?: (attempt: number, maxAttempts: number) => void
  ): Promise<T> {
    const id =
      requestId ||
      `retry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const executeWithRetry = async (): Promise<T> => {
      try {
        onProgress?.(this.getAttempts(id) + 1, this.config.maxAttempts);
        return await fn();
      } catch (error) {
        if (error && typeof error === "object" && "status" in error) {
          return this.scheduleRetry(
            error as StandardErrorResponse,
            id,
            fn,
            undefined,
            undefined
          );
        }
        throw error;
      }
    };

    return executeWithRetry();
  }
}
