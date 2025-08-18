/**
 * Factory de Query Keys - Sistema centralizado e tipado
 *
 * Padrão hierárquico:
 * - Nível 1: Entidade (appointments, users, etc.)
 * - Nível 2: Operação (list, detail, etc.)
 * - Nível 3: Filtros/Parâmetros
 *
 * Exemplo: ['appointments', 'list', { userId: '123' }]
 */

// Tipos para garantir consistência
type QueryKeyFactory<T extends readonly unknown[]> = T;

export const queryKeys = {
  // ===== APPOINTMENTS =====
  appointments: ["appointments"] as const,

  appointmentsList: (params?: {
    userId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => ["appointments", "list", params] as const,

  appointmentDetail: (id: string) => ["appointments", "detail", id] as const,

  appointmentsByUser: (userId: string) =>
    ["appointments", "user", userId] as const,

  appointmentsUpcoming: (userId: string) =>
    ["appointments", "upcoming", userId] as const,

  appointmentsPast: (userId: string) =>
    ["appointments", "past", userId] as const,

  // ===== MEDICAL RECORDS =====
  medicalRecords: ["medical-records"] as const,

  medicalRecordsList: (params?: {
    userId?: string;
    page?: number;
    limit?: number;
    type?: "psychologist" | "psychiatrist";
  }) => ["medical-records", "list", params] as const,

  medicalRecordsByUser: (
    userId: string,
    params?: {
      page?: number;
      limit?: number;
      type?: string;
    }
  ) => ["medical-records", "user", userId, params] as const,

  medicalRecordDetail: (id: string) =>
    ["medical-records", "detail", id] as const,

  // ===== USER =====
  user: ["user"] as const,

  userProfile: (id: string) => ["user", "profile", id] as const,

  userBenefits: (id: string) => ["user", "benefits", id] as const,

  userAddresses: (id: string) => ["user", "addresses", id] as const,

  userSubscriptions: (id: string) => ["user", "subscriptions", id] as const,

  // ===== NOTIFICATIONS =====
  notifications: ["notifications"] as const,

  notificationsList: (
    userId: string,
    params?: {
      page?: number;
      limit?: number;
      read?: boolean;
    }
  ) => ["notifications", "list", userId, params] as const,

  notificationsUnreadCount: (userId: string) =>
    ["notifications", "unread-count", userId] as const,

  notificationDetail: (id: string) => ["notifications", "detail", id] as const,

  // ===== PAYMENTS =====
  payments: ["payments"] as const,

  paymentDetail: (id: string) => ["payments", "detail", id] as const,

  paymentPix: (id: string) => ["payments", "pix", id] as const,

  paymentInstallments: (amount: number) =>
    ["payments", "installments", amount] as const,

  paymentMethods: ["payments", "methods"] as const,

  // ===== PROFESSIONALS =====
  professionals: ["professionals"] as const,

  psychologists: (params?: {
    startDate?: string;
    endDate?: string;
    serviceId?: string;
  }) => ["professionals", "psychologists", params] as const,

  psychiatrists: (params?: {
    startDate?: string;
    endDate?: string;
    serviceId?: string;
  }) => ["professionals", "psychiatrists", params] as const,

  professionalAvailability: (
    id: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ) => ["professionals", "availability", id, params] as const,

  // ===== SERVICES =====
  services: ["services"] as const,

  servicesList: (userId?: string) => ["services", "list", userId] as const,

  serviceDetail: (id: string) => ["services", "detail", id] as const,

  servicesAvailable: (params?: { type?: string; userId?: string }) =>
    ["services", "available", params] as const,

  // ===== TIME SLOTS =====
  timeSlots: ["time-slots"] as const,

  timeSlotsAvailable: (params: {
    professionalId: string;
    date: string;
    serviceId?: string;
  }) => ["time-slots", "available", params] as const,

  timeSlotAvailability: (params: {
    professionalId?: string;
    serviceId?: string;
    date?: string;
  }) => ["time-slots", "availability", params] as const,

  multipleTimeSlotAvailability: (
    requests: Array<{
      professionalId: string;
      serviceId: string;
      date: string;
    }>
  ) => ["time-slots", "multiple-availability", requests] as const,

  reservationDetail: (id: string) => ["time-slots", "reservation", id] as const,

  // ===== PSYCHIATRIC DATA =====
  psychiatricData: ["psychiatric-data"] as const,

  psychiatricDataByUser: (userId: string) =>
    ["psychiatric-data", "user", userId] as const,

  // ===== CONVENIOS =====
  convenios: ["convenios"] as const,

  conveniosList: () => ["convenios", "list"] as const,

  convenioDetail: (id: string) => ["convenios", "detail", id] as const,

  // ===== DOCUMENTS =====
  documents: ["documents"] as const,

  documentUpload: (type: string) => ["documents", "upload", type] as const,

  // ===== ADDRESSES =====
  addresses: ["addresses"] as const,

  addressesByUser: (userId: string) => ["addresses", "user", userId] as const,

  addressDetail: (id: string) => ["addresses", "detail", id] as const,

  addressesList: (params?: {
    userId?: string;
    type?: string;
    isDefault?: boolean;
  }) => ["addresses", "list", params] as const,
} as const;

// Utilities para manipular query keys
export const queryKeyUtils = {
  // Verificar se uma key pertence a uma categoria
  isAppointmentKey: (queryKey: unknown[]) => {
    return queryKey[0] === "appointments";
  },

  isMedicalRecordKey: (queryKey: unknown[]) => {
    return queryKey[0] === "medical-records";
  },

  isUserKey: (queryKey: unknown[]) => {
    return queryKey[0] === "user";
  },

  // Extrair userId de uma query key
  extractUserId: (queryKey: unknown[]): string | null => {
    // Procura por 'user' seguido de um ID
    const userIndex = queryKey.findIndex((key) => key === "user");
    if (userIndex !== -1 && queryKey[userIndex + 1]) {
      return queryKey[userIndex + 1] as string;
    }
    return null;
  },

  // Gerar key para invalidação em lote
  getAllUserKeys: (userId: string) => {
    return [
      queryKeys.appointmentsByUser(userId),
      queryKeys.medicalRecordsByUser(userId),
      queryKeys.userProfile(userId),
      queryKeys.userBenefits(userId),
      queryKeys.userAddresses(userId),
      queryKeys.notificationsList(userId),
      queryKeys.psychiatricDataByUser(userId),
      queryKeys.addressesByUser(userId),
    ];
  },

  // Debug: mostrar estrutura de uma key
  debugKey: (queryKey: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Query Key Structure:", {
        full: queryKey,
        entity: queryKey[0],
        operation: queryKey[1],
        params: queryKey.slice(2),
      });
    }
  },
};

// Tipos para TypeScript inference
export type AppointmentQueryKey = ReturnType<
  typeof queryKeys.appointmentsByUser
>;
export type MedicalRecordQueryKey = ReturnType<
  typeof queryKeys.medicalRecordsByUser
>;
export type UserQueryKey = ReturnType<typeof queryKeys.userProfile>;
export type NotificationQueryKey = ReturnType<
  typeof queryKeys.notificationsList
>;
