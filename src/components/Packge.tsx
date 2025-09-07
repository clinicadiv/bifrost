import { useTheme } from "@/contexts/ThemeContext";
import { Service, UserBenefitsData } from "@/types";
import { CheckCircle, Circle, Gift, Trophy } from "@phosphor-icons/react";

// Helper function to safely format price
const formatPrice = (price: number | undefined | null): string => {
  const validPrice = typeof price === "number" && !isNaN(price) ? price : 0;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(validPrice);
};

// Helper function to get the correct price (fallback to yourPrice if finalPrice doesn't exist)
const getServicePrice = (service: Service): number => {
  // Try finalPrice first, then fallback to yourPrice for backward compatibility
  const pricing = service.pricing as any;
  return pricing.finalPrice ?? pricing.yourPrice ?? 0;
};

export const Package = ({
  service,
  setService,
  isSelected,
  userBenefits,
}: {
  service: Service;
  setService: (service: Service | null) => void;
  isSelected: boolean;
  userBenefits?: UserBenefitsData;
}) => {
  const { theme } = useTheme();

  // Debug: Log service data
  console.log("Service data:", service);
  console.log("Service pricing:", service.pricing);
  console.log(
    "Final price:",
    service.pricing.finalPrice,
    typeof service.pricing.finalPrice
  );
  console.log("Calculated service price:", getServicePrice(service));

  const handleSelectPackage = () => {
    setService(service);
  };

  // Função para verificar consultas gratuitas (freeSessions)
  const getFreeConsultationsInfo = () => {
    if (!userBenefits || !userBenefits.hasActivePlan) return null;

    // Psiquiatria: usar freeSessions (total - used)
    if (
      service.consultationType === "PSYCHIATRIC" &&
      userBenefits.psychiatry?.freeSessions
    ) {
      const { total, used, hasFreeAvailable } =
        userBenefits.psychiatry.freeSessions;
      const remaining = total - used;
      return hasFreeAvailable && remaining > 0
        ? { remaining, type: "Psiquiatria", isFree: true }
        : null;
    }

    // Psicologia: usar freeSessions (total - used)
    if (
      service.consultationType === "PSYCHOLOGICAL" &&
      userBenefits.psychology?.freeSessions
    ) {
      const { total, used, hasFreeAvailable } =
        userBenefits.psychology.freeSessions;
      const remaining = total - used;
      return hasFreeAvailable && remaining > 0
        ? { remaining, type: "Psicologia", isFree: true }
        : null;
    }

    return null;
  };

  // Função para verificar consultas com desconto (sessionsRemaining)
  const getDiscountedConsultationsInfo = () => {
    if (!userBenefits || !userBenefits.hasActivePlan) return null;

    if (
      service.consultationType === "PSYCHIATRIC" &&
      userBenefits.psychiatry?.sessionsRemaining
    ) {
      const remaining = userBenefits.psychiatry.sessionsRemaining;
      const hasDiscount =
        userBenefits.psychiatry.yourPrice <
        userBenefits.psychiatry.standardPrice;
      return hasDiscount && remaining > 0
        ? { remaining, type: "Psiquiatria", isFree: false }
        : null;
    }

    if (
      service.consultationType === "PSYCHOLOGICAL" &&
      userBenefits.psychology &&
      userBenefits.psychology.sessionsRemaining > 0
    ) {
      const psychology = userBenefits.psychology;
      const remaining = psychology.sessionsRemaining;
      const hasDiscount =
        psychology.yourPrice > 0 &&
        psychology.yourPrice < psychology.standardPrice;
      return hasDiscount
        ? { remaining, type: "Psicologia", isFree: false }
        : null;
    }

    return null;
  };

  const freeConsultationsInfo = getFreeConsultationsInfo();
  const discountedConsultationsInfo = getDiscountedConsultationsInfo();

  return (
    <div
      className={`group relative rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
        isSelected
          ? `border-green-500 ${
              theme === "dark" ? "bg-green-900/20" : "bg-green-50"
            } shadow-lg scale-[1.02]`
          : `${
              theme === "dark"
                ? "border-gray-700 bg-gray-800 hover:border-gray-600"
                : "border-gray-200 bg-white hover:border-gray-300"
            } hover:shadow-md hover:scale-[1.01]`
      }`}
      onClick={handleSelectPackage}
    >
      {/* Indicador de seleção */}
      <div className="absolute top-4 right-4">
        {isSelected ? (
          <CheckCircle size={24} className="text-green-600" weight="fill" />
        ) : (
          <Circle
            size={24}
            className={`${
              theme === "dark"
                ? "text-gray-500 group-hover:text-gray-400"
                : "text-gray-300 group-hover:text-gray-400"
            }`}
          />
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between">
          {/* Conteúdo principal */}
          <div className="flex-1 pr-4">
            <h3
              className={`text-xl font-semibold mb-3 transition-colors ${
                isSelected
                  ? "text-green-600"
                  : theme === "dark"
                  ? "text-gray-200"
                  : "text-gray-800"
              }`}
            >
              {service.name}
            </h3>

            <p
              className={`text-sm max-w-9/12 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {service.description}
            </p>

            {/* Informações de consultas gratuitas e com desconto */}
            <div className="mt-3 flex flex-col gap-2">
              {freeConsultationsInfo && (
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${
                    theme === "dark"
                      ? "bg-green-900/30 text-green-400 border border-green-800/50"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}
                >
                  <Gift size={14} weight="fill" />
                  <span>
                    {freeConsultationsInfo.remaining === 1
                      ? "1 consulta gratuita restante"
                      : `${freeConsultationsInfo.remaining} consultas gratuitas restantes`}
                  </span>
                </div>
              )}

              {discountedConsultationsInfo && !freeConsultationsInfo && (
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${
                    theme === "dark"
                      ? "bg-blue-900/30 text-blue-400 border border-blue-800/50"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  <Trophy size={14} weight="fill" />
                  <span>
                    {discountedConsultationsInfo.remaining === 1
                      ? "1 consulta com desconto restante"
                      : `${discountedConsultationsInfo.remaining} consultas com desconto restantes`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Preço */}
          <div className="text-right -translate-x-5">
            {freeConsultationsInfo ? (
              <div className="text-center">
                <div
                  className={`text-2xl font-bold mb-1 ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                >
                  GRATUITO
                </div>
                <div
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  } line-through`}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(
                    service.consultationType === "PSYCHIATRIC"
                      ? userBenefits?.psychiatry?.yourPrice ||
                          getServicePrice(service)
                      : userBenefits?.psychology?.yourPrice ||
                          getServicePrice(service)
                  )}
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`text-3xl font-bold mb-1 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {formatPrice(getServicePrice(service))}
                </div>
                <div
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {discountedConsultationsInfo
                    ? "Preço com desconto"
                    : "Total do serviço"}
                </div>
                {discountedConsultationsInfo && userBenefits && (
                  <div
                    className={`text-xs ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    } line-through mt-1`}
                  >
                    De:{" "}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(
                      service.consultationType === "PSYCHIATRIC"
                        ? userBenefits.psychiatry?.standardPrice ||
                            service.pricing.originalPrice
                        : userBenefits.psychology?.standardPrice ||
                            service.pricing.originalPrice
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Barra de seleção na parte inferior */}
        <div
          className={`mt-4 h-1 rounded-full transition-all duration-300 ${
            isSelected
              ? "bg-gradient-to-r from-green-400 to-green-600"
              : theme === "dark"
              ? "bg-gray-700 group-hover:bg-gray-600"
              : "bg-gray-100 group-hover:bg-gray-200"
          }`}
        />
      </div>
    </div>
  );
};
