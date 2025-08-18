// Interfaces baseadas no padrão RFC7807 e na documentação da API

export interface StandardErrorResponse {
  // ===== RFC 7807 CORE =====
  type: string; // "https://api.clinica.com/errors/validation/required-field"
  title: string; // "Campo obrigatório"
  status: number; // 400
  detail: string; // "O campo email é obrigatório"
  instance: string; // "/api/users"

  // ===== EXTENSÕES MIMIR =====
  code: string; // "REQUIRED_FIELD"
  category: string; // "validation"
  requestId: string; // "req_1704447600000_abc123"
  timestamp: string; // "2025-01-04T10:30:00Z"

  // ===== OPCIONAIS =====
  errors?: Array<{
    // Para erros de validação múltiplos
    field: string;
    code: string;
    message: string;
    value?: any;
    constraints?: Record<string, any>;
  }>;
  metadata?: {
    // Metadados contextuais
    resource?: string;
    operation?: string;
    retryable?: boolean;
    retryAfter?: number;
    limits?: {
      current: number;
      maximum: number;
      resetTime: string;
    };
  };
  context?: {
    // Contexto da requisição
    userAgent?: string;
    ip?: string;
    endpoint?: string;
    method?: string;
  };
  suggestions?: string[]; // Sugestões para resolver o erro
  documentation?: string; // Link para documentação
  supportContact?: string; // Contato para suporte
}

// Categorias de erro da API
export type ErrorCategory =
  | "validation"
  | "authentication"
  | "authorization"
  | "not-found"
  | "conflict"
  | "business-rule"
  | "rate-limit"
  | "payment"
  | "external-service"
  | "internal";

// Códigos de erro principais
export type ErrorCode =
  // Validação
  | "REQUIRED_FIELD"
  | "INVALID_FORMAT"
  | "INVALID_LENGTH"
  | "INVALID_VALUE"
  | "INVALID_RANGE"
  // Autenticação
  | "INVALID_CREDENTIALS"
  | "TOKEN_EXPIRED"
  | "TOKEN_INVALID"
  | "LOGIN_REQUIRED"
  // Autorização
  | "INSUFFICIENT_PERMISSIONS"
  | "SUBSCRIPTION_REQUIRED"
  | "PLAN_RESTRICTION"
  // Recursos
  | "USER_NOT_FOUND"
  | "APPOINTMENT_NOT_FOUND"
  | "SERVICE_NOT_FOUND"
  // Conflitos
  | "DUPLICATE_EMAIL"
  | "APPOINTMENT_CONFLICT"
  | "RESOURCE_ALREADY_EXISTS"
  // Regras de Negócio
  | "PLAN_LIMIT_EXCEEDED"
  | "DEPENDENT_LIMIT_REACHED"
  | "INSUFFICIENT_BALANCE"
  // Pagamento
  | "PAYMENT_FAILED"
  | "PAYMENT_DECLINED"
  | "INSUFFICIENT_FUNDS"
  // Sistema
  | "INTERNAL_SERVER_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "DATABASE_ERROR";

// Configuração de tratamento por categoria
export interface ErrorCategoryConfig {
  category: ErrorCategory;
  httpStatus: number;
  description: string;
  defaultAction: ErrorAction;
  retryable: boolean;
  showToUser: boolean;
  logLevel: "error" | "warn" | "info";
}

// Ações que podem ser tomadas com um erro
export type ErrorAction =
  | "retry"
  | "redirect-login"
  | "redirect-payment"
  | "show-modal"
  | "show-toast"
  | "highlight-field"
  | "show-inline"
  | "ignore"
  | "report-bug";

// Contexto para tratamento de erro
export interface ErrorContext {
  formId?: string; // Para erros de validação de formulário
  userId?: string;
  endpoint?: string;
  userAgent?: string;
  showToast?: boolean;
  onRetry?: () => void;
  onCancel?: () => void;
  customActions?: Array<{
    label: string;
    action: () => void;
    type?: "primary" | "secondary" | "danger";
  }>;
}

// Resultado do processamento de erro
export interface ErrorHandlerResult {
  handled: boolean;
  action: ErrorAction;
  message: string;
  title: string;
  retryable: boolean;
  context?: ErrorContext;
  metadata?: {
    retryAfter?: number;
    retryAttempts?: number;
    maxRetries?: number;
  };
}

// Configuração do sistema de retry
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number; // ms
  maxDelay: number; // ms
  backoffMultiplier: number;
  retryableErrors: ErrorCode[];
  retryableStatuses: number[];
}

// Estado do sistema de erro
export interface ErrorState {
  currentError: StandardErrorResponse | null;
  isRetrying: boolean;
  retryAttempts: number;
  lastRetryAt: Date | null;
  history: StandardErrorResponse[];
}
