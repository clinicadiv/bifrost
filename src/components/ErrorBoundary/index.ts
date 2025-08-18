// Error Boundary Components
export {
  ErrorBoundary,
  PageErrorBoundary,
  withErrorBoundary,
} from "./ErrorBoundary";

// Display Components
export { ErrorDisplay } from "./ErrorDisplay";
export { ErrorInline, FormError } from "./ErrorInline";
export { ErrorModal } from "./ErrorModal";
export { ErrorToast, ToastManager } from "./ErrorToast";

// Re-export types for convenience
export type {
  ErrorAction,
  ErrorCategory,
  ErrorCode,
  ErrorContext,
  ErrorHandlerResult,
  StandardErrorResponse,
} from "@/utils/errorHandler/types";
