// Core hooks (mantidos)
export * from "./useAuthStore";
export * from "./useAvatarUpload";
export * from "./useDocumentUpload";
export * from "./useErrorHandler";
export * from "./useLogin";
export * from "./usePagination";

// React Query hooks (novos - usar estes!)
export * from "./mutations";
export * from "./queries";
export * from "./useReactQueryErrorHandler";

// Legacy hooks (deprecated - comentados para evitar conflitos)
// Para usar as versões React Query, importe diretamente de ./queries
// export * from "./useAppointments";
// export * from "./useMedicalRecords";
export * from "./useUnreadNotifications";
// export * from "./useUserBenefits";
