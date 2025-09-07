export enum DependentRelationship {
  SPOUSE = "spouse",
  CHILD = "child",
  PARENT = "parent",
  SIBLING = "sibling",
  OTHER = "other",
}

export interface Dependent {
  id: string;
  userId: string;
  subscriptionId: string;
  name: string;
  document: string; // CPF
  birthDate: string; // Formato: "dd/mm/yyyy"
  relationship: DependentRelationship | string;
  phone?: string;
  email?: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relacionamentos opcionais
  user?: {
    id: string;
    name: string;
    email: string;
  };
  subscription?: {
    id: string;
    planName: string;
    status: string;
  };
}

export interface CreateDependentDTO {
  subscriptionId: string;
  name: string;
  document: string;
  birthDate: string;
  relationship: string;
  phone?: string;
  email?: string;
}

export interface UpdateDependentDTO {
  name?: string;
  document?: string;
  birthDate?: string;
  relationship?: string;
  phone?: string;
  email?: string;
  status?: boolean;
}

export interface DependentStatistics {
  userId: string;
  totalDependents: number;
  activeDependents: number;
  inactiveDependents: number;
  recentlyAdded: number;
}

export interface ValidateDependentForPlanDTO {
  subscriptionId: string;
  name: string;
  document: string;
  birthDate: string;
  relationship: string;
  phone?: string;
  email?: string;
}

export interface DependentLimitCheck {
  subscriptionId: string;
  canAddMore: boolean;
  currentCount: number;
  maxAllowed: number;
}

// Tipos para as responses da API
export interface DependentResponse {
  success: boolean;
  message: string;
  data: Dependent;
}

export interface DependentsListResponse {
  success: boolean;
  message: string;
  data: {
    subscriptionId: string;
    currentDependents: number;
    dependents: Dependent[];
    maxDependents: number;
    planName: string;
    planType: string;
  }[];
}

export interface DependentStatisticsResponse {
  success: boolean;
  message: string;
  data: DependentStatistics;
}

export interface DependentLimitCheckResponse {
  success: boolean;
  message: string;
  data: DependentLimitCheck;
}

// Enum para tipos de relacionamento (labels para exibição)
export enum RelationshipType {
  SPOUSE = "Cônjuge",
  CHILD = "Filho(a)",
  PARENT = "Pai/Mãe",
  SIBLING = "Irmão/Irmã",
  GRANDPARENT = "Avô/Avó",
  GRANDCHILD = "Neto(a)",
  OTHER = "Outro",
}

// Mapeamento entre valores da API e labels
export const RelationshipMapping = {
  [DependentRelationship.SPOUSE]: RelationshipType.SPOUSE,
  [DependentRelationship.CHILD]: RelationshipType.CHILD,
  [DependentRelationship.PARENT]: RelationshipType.PARENT,
  [DependentRelationship.SIBLING]: RelationshipType.SIBLING,
  [DependentRelationship.OTHER]: RelationshipType.OTHER,
};

// Tipo para filtros de busca
export interface DependentFilters {
  page?: number;
  limit?: number;
  status?: boolean;
  relationship?: string;
  search?: string;
  subscriptionId?: string;
  userId?: string;
}

// Tipo para paginação
export interface PaginatedDependentsResponse {
  success: boolean;
  message: string;
  data: {
    dependents: Dependent[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
