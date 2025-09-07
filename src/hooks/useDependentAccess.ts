"use client";

import { useDependentLimitCheck } from "@/hooks/queries/useDependents";
import {
  useHasBenefit,
  useUserBenefits,
} from "@/hooks/queries/useUserBenefits";
import { useAuthStore } from "@/hooks/useAuthStore";

// Tipos temporários até ter tipagem completa da API
interface Benefit {
  type: string;
  active: boolean;
}

interface UserBenefitsData {
  benefits?: Benefit[];
}

interface LimitCheckData {
  canAddMore?: boolean;
  currentCount?: number;
  maxAllowed?: number;
}

interface PlanData {
  hasActivePlan?: boolean;
  plan?: {
    name?: string;
    type?: string;
  };
}

/**
 * Hook para verificar se o usuário tem acesso ao módulo de dependentes
 *
 * Verifica:
 * - Se o usuário tem um plano que permite dependentes
 * - Se ainda não atingiu o limite de dependentes
 * - Se o benefício está ativo
 */
export function useDependentAccess() {
  const { user } = useAuthStore();

  // Verificar se tem benefício de dependentes
  const dependentBenefit = useHasBenefit(user?.id || "", "dependents");

  // Verificar limite de dependentes - TODO: Implementar obtenção do subscriptionId
  // Por enquanto, desabilitado até ter subscriptionId no tipo User
  const limitCheck = useDependentLimitCheck(""); // user?.subscriptionId || ""

  // Buscar todos os benefícios para análise mais detalhada
  const userBenefits = useUserBenefits(user?.id || "");

  const hasAccess = () => {
    // Se não tem usuário logado, não tem acesso
    if (!user) {
      console.log("🔍 DEBUG - useDependentAccess: Usuário não logado");
      return false;
    }

    // Debug: Log dos dados dos benefícios
    console.log("🔍 DEBUG - useDependentAccess:", {
      userId: user.id,
      dependentBenefit: dependentBenefit.hasBenefit,
      userBenefitsData: userBenefits.data,
      userBenefitsLoading: userBenefits.isPending,
      userBenefitsError: userBenefits.error,
      hasActivePlan: (userBenefits.data as PlanData)?.hasActivePlan,
    });

    // Se tem o benefício específico de dependentes
    if (dependentBenefit.hasBenefit) {
      console.log(
        "🔍 DEBUG - useDependentAccess: Tem benefício específico de dependentes"
      );
      return true;
    }

    // Verificar se tem plano INDIVIDUAL (que dá direito a dependentes)
    const planData = userBenefits.data as PlanData;
    const hasActivePlan = planData?.hasActivePlan;
    const planType = planData?.plan?.type;

    console.log("🔍 DEBUG - useDependentAccess: Dados do plano:", {
      hasActivePlan,
      planType,
      planName: planData?.plan?.name,
    });

    if (hasActivePlan && planType === "INDIVIDUAL") {
      console.log(
        "🔍 DEBUG - useDependentAccess: Plano INDIVIDUAL encontrado, liberando acesso aos dependentes"
      );
      return true;
    }

    // Verificar se tem plano premium/família que inclui dependentes (estrutura antiga)
    const benefits = (userBenefits.data as UserBenefitsData)?.benefits || [];
    console.log(
      "🔍 DEBUG - useDependentAccess: Benefits encontrados:",
      benefits
    );

    const hasFamilyPlan = benefits.some(
      (benefit: Benefit) =>
        (benefit.type === "family" ||
          benefit.type === "premium" ||
          benefit.type === "plus") &&
        benefit.active
    );

    console.log(
      "🔍 DEBUG - useDependentAccess: Tem plano família/premium/plus?",
      hasFamilyPlan
    );
    return hasFamilyPlan;
  };

  const canAddMore = () => {
    if (!hasAccess()) return false;

    // Se não conseguiu verificar o limite, assume que pode adicionar
    if (!limitCheck.data) return true;

    return (limitCheck.data as LimitCheckData)?.canAddMore || false;
  };

  const getLimitInfo = () => {
    if (!limitCheck.data) return null;

    const data = limitCheck.data as LimitCheckData;
    return {
      current: data?.currentCount || 0,
      max: data?.maxAllowed || 0,
      canAddMore: data?.canAddMore || false,
    };
  };

  return {
    // Estados principais
    hasAccess: hasAccess(),
    canAddMore: canAddMore(),

    // Informações detalhadas
    limitInfo: getLimitInfo(),

    // Estados de loading
    isLoading:
      dependentBenefit.isPending ||
      limitCheck.isPending ||
      userBenefits.isPending,

    // Estados de erro
    error: dependentBenefit.error || limitCheck.error || userBenefits.error,

    // Dados brutos para debug
    benefits: (userBenefits.data as UserBenefitsData)?.benefits || [],
    planData: userBenefits.data as PlanData,
    dependentBenefit: dependentBenefit.hasBenefit,
  };
}
