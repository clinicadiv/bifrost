// Main exports
export { ErrorClassifier } from "./ErrorClassifier";
export { ErrorHandler, errorHandler } from "./ErrorHandler";
export { RetryManager } from "./RetryManager";

// Types
export type {
  ErrorAction,
  ErrorCategory,
  ErrorCategoryConfig,
  ErrorCode,
  ErrorContext,
  ErrorHandlerResult,
  ErrorState,
  RetryConfig,
  StandardErrorResponse,
} from "./types";

// Utility functions for quick access
import { errorHandler } from "./ErrorHandler";

export const {
  handleError,
  withRetry,
  handleValidationErrors,
  shouldShowToUser,
  getSuggestions,
  clearError,
  configureRetry,
  cancelRetries,
} = errorHandler;
