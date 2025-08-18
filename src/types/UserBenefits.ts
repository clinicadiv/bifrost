export interface UserPlan {
  name: string;
  description: string;
  type: string;
}

export interface PsychologyBenefits {
  standardPrice: number;
  yourPrice: number;
  savings: number;
  freeSessions: {
    total: number;
    used: number;
    remaining: number;
    hasFreeAvailable: boolean;
  };
  sessionsUsed: number;
  sessionsLimit: string;
  sessionsRemaining: number;
  isUnlimited: boolean;
  hasReachedLimit: boolean;
}

export interface PsychiatryBenefits {
  standardPrice: number;
  yourPrice: number;
  savings: number;
  freeSessions: {
    total: number;
    used: number;
    remaining: number;
    hasFreeAvailable: boolean;
  };
  paidSessions: {
    used: number;
    limit: number;
    remaining: number;
    isUnlimited: boolean;
    hasReachedLimit: boolean;
  };
  sessionsUsed: number;
  sessionsLimit: string;
  sessionsRemaining: number;
  isUnlimited: boolean;
  hasReachedLimit: boolean;
}

export interface UserBenefitsData {
  currentMonth: string;
  hasActivePlan: boolean;
  messages: string[];
  plan?: UserPlan;
  psychiatry?: PsychiatryBenefits;
  psychology?: PsychologyBenefits;
  totalMonthlySavings: number;
}

export interface UserBenefitsResponse {
  success: boolean;
  data: UserBenefitsData;
}

// Para quando o usuário não tem plano ativo
export interface NoActivePlanData {
  hasActivePlan: false;
  message: string;
  standardPrices: {
    psychology: number;
    psychiatry: number;
  };
  suggestedAction: string;
}

export interface NoActivePlanResponse {
  success: boolean;
  data: NoActivePlanData;
}
