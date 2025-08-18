export interface ConvenioPlan {
  id: string;
  name: string;
  planType: string;
  psychologySessionsPerMonth: number;
  psychiatrySessionsPerMonth: number;
  psychologyCopay: number;
  psychiatryCopay: number;
}

export interface ConvenioCompany {
  id: string;
  fantasyName: string;
  document: string;
}

export interface ConvenioBenefits {
  psychologyRemaining: number;
  psychiatryRemaining: number;
  currentMonth: string;
}

export interface ConvenioData {
  hasActiveConvenio: boolean;
  plan: ConvenioPlan;
  company?: ConvenioCompany; // Opcional para planos individuais
  benefits: ConvenioBenefits;
  convenioType: string;
  isExpired: boolean;
}

export interface GetConvenioResponse {
  success: boolean;
  data: ConvenioData;
}
