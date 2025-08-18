import { useTheme } from "@/contexts/ThemeContext";
import { useAuthStore } from "@/hooks";
import { useUserBenefits } from "@/hooks/queries/useUserBenefits";
import { findAllServices } from "@/services/http/service/find-all-services";
import { Service, UserBenefitsData, UserBenefitsResponse } from "@/types";
import { ShoppingBag, Sparkle, Star, Trophy } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Package } from "./Packge";

export const StepOne = ({
  setService,
  selectedService,
}: {
  setService: (service: Service | null) => void;
  selectedService: Service | null;
}) => {
  const { theme } = useTheme();
  const { user, token } = useAuthStore();

  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => findAllServices(user?.id || ""),
    enabled: !!user?.id,
  });

  const { data: userBenefits, isLoading: isLoadingBenefits } = useUserBenefits(
    user?.id || ""
  );

  // Type guard para verificar se é UserBenefitsData
  const getUserBenefitsData = (): UserBenefitsData | undefined => {
    if (
      userBenefits?.success &&
      "data" in userBenefits &&
      "hasActivePlan" in userBenefits.data &&
      userBenefits.data.hasActivePlan
    ) {
      return userBenefits.data as UserBenefitsData;
    }
    return undefined;
  };

  // Função para filtrar apenas serviços psicológicos e psiquiátricos
  const filterPsychServices = (services: Service[]) => {
    return services.filter((service) => {
      return (
        service.consultationType === "PSYCHOLOGICAL" ||
        service.consultationType === "PSYCHIATRIC"
      );
    });
  };

  // Função para renderizar os benefícios do usuário
  const renderUserBenefits = () => {
    if (isLoadingBenefits) {
      return (
        <div
          className={`${
            theme === "dark"
              ? "bg-gradient-to-r from-green-800/20 to-blue-800/20 border-green-600/30"
              : "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
          } border rounded-xl p-6 animate-pulse`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-8 h-8 ${
                theme === "dark" ? "bg-green-600" : "bg-green-200"
              } rounded-lg animate-pulse`}
            ></div>
            <div
              className={`h-6 ${
                theme === "dark" ? "bg-green-600" : "bg-green-200"
              } rounded w-48 animate-pulse`}
            ></div>
          </div>
        </div>
      );
    }

    if (!userBenefits) return null;

    // Verifica se é um usuário com plano ativo
    const hasActivePlan = userBenefits.data.hasActivePlan;

    // Só exibe algo se o usuário tiver plano ativo
    if (!hasActivePlan) {
      return null;
    }

    const benefits = userBenefits.data as UserBenefitsResponse["data"];

    return (
      <div
        className={`${
          theme === "dark"
            ? "bg-gradient-to-r from-green-800/20 to-blue-800/20 border-green-600/30"
            : "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
        } border rounded-xl p-4`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 ${
                theme === "dark" ? "bg-green-600/20" : "bg-green-100"
              } rounded-lg`}
            >
              <Trophy
                size={20}
                className={`${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`}
              />
            </div>
            <div>
              <h3
                className={`text-sm font-semibold ${
                  theme === "dark" ? "text-green-400" : "text-green-800"
                }`}
              >
                {benefits.plan?.name}
              </h3>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-green-300" : "text-green-600"
                }`}
              >
                Plano ativo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {benefits.psychology && (
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star
                    size={14}
                    className={`${
                      theme === "dark" ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      theme === "dark" ? "text-purple-300" : "text-purple-800"
                    }`}
                  >
                    Psicologia
                  </span>
                </div>
                <div className="space-y-0.5">
                  {benefits.psychology.freeSessions?.hasFreeAvailable && (
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-green-300" : "text-green-700"
                      }`}
                    >
                      {benefits.psychology.freeSessions.total -
                        benefits.psychology.freeSessions.used}{" "}
                      gratuitas
                    </p>
                  )}
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-purple-200" : "text-purple-700"
                    }`}
                  >
                    {benefits.psychology.isUnlimited
                      ? "Ilimitadas"
                      : `${benefits.psychology.sessionsRemaining} restantes`}
                  </p>
                </div>
              </div>
            )}

            {benefits.psychiatry && (
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star
                    size={14}
                    className={`${
                      theme === "dark" ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      theme === "dark" ? "text-blue-300" : "text-blue-800"
                    }`}
                  >
                    Psiquiatria
                  </span>
                </div>
                <div className="space-y-0.5">
                  {benefits.psychiatry.freeSessions?.hasFreeAvailable && (
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-green-300" : "text-green-700"
                      }`}
                    >
                      {benefits.psychiatry.freeSessions.total -
                        benefits.psychiatry.freeSessions.used}{" "}
                      gratuitas
                    </p>
                  )}
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-blue-200" : "text-blue-700"
                    }`}
                  >
                    {benefits.psychiatry.isUnlimited
                      ? "Ilimitadas"
                      : `${benefits.psychiatry.sessionsRemaining} restantes`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        {/* Header com loading */}
        <div
          className={`${
            theme === "dark"
              ? "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600"
              : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
          } border rounded-xl p-6`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-8 h-8 ${
                theme === "dark" ? "bg-gray-600" : "bg-blue-200"
              } rounded-lg animate-pulse`}
            ></div>
            <div
              className={`h-6 ${
                theme === "dark" ? "bg-gray-600" : "bg-blue-200"
              } rounded w-48 animate-pulse`}
            ></div>
          </div>
          <div
            className={`h-4 ${
              theme === "dark" ? "bg-gray-700" : "bg-blue-100"
            } rounded w-96 animate-pulse`}
          ></div>
        </div>

        {/* Package skeletons */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={`${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } rounded-xl border p-6 animate-pulse`}
            >
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div
                    className={`h-6 ${
                      theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                    } rounded w-48`}
                  ></div>
                  <div
                    className={`h-4 ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    } rounded w-32`}
                  ></div>
                </div>
                <div
                  className={`h-8 ${
                    theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                  } rounded w-24`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredServices =
    services && services.data.length > 0
      ? filterPsychServices(services.data)
      : [];

  return (
    <div className="flex flex-col gap-8">
      {/* Header elegante */}
      <div
        className={`${
          theme === "dark"
            ? "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600"
            : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
        } border rounded-xl p-6`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`p-2 ${
              theme === "dark" ? "bg-gray-600" : "bg-blue-100"
            } rounded-lg`}
          >
            <ShoppingBag
              size={24}
              className={`${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            />
          </div>
          <h3
            className={`text-xl font-semibold ${
              theme === "dark" ? "text-blue-400" : "text-blue-800"
            }`}
          >
            Escolha seu Tipo de Consulta
          </h3>
        </div>
        <p
          className={`text-sm leading-relaxed ${
            theme === "dark" ? "text-gray-300" : "text-blue-600"
          }`}
        >
          Selecione entre consulta psicológica ou psiquiátrica.
        </p>
      </div>

      {/* Benefícios do usuário */}
      {user && token && renderUserBenefits()}

      {/* Lista de pacotes com indicador de seleção */}
      <div className="space-y-4 px-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <Package
              key={service.id}
              service={service}
              setService={setService}
              isSelected={service.id === selectedService?.id}
              userBenefits={getUserBenefitsData()}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div
              className={`p-4 ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              } rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}
            >
              <ShoppingBag
                size={32}
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              />
            </div>
            <p
              className={`text-lg font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Nenhum serviço psicológico ou psiquiátrico disponível
            </p>
            <p
              className={`text-sm mt-1 ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Tente novamente mais tarde
            </p>
          </div>
        )}
      </div>

      {/* Dica de seleção */}
      {filteredServices.length > 0 && !selectedService && (
        <div
          className={`${
            theme === "dark"
              ? "bg-amber-900/30 border-amber-700"
              : "bg-amber-50 border-amber-200"
          } border rounded-lg p-4`}
        >
          <div className="flex items-center gap-2">
            <Sparkle
              size={20}
              className={`${
                theme === "dark" ? "text-amber-400" : "text-amber-600"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                theme === "dark" ? "text-amber-300" : "text-amber-800"
              }`}
            >
              Selecione um tipo de consulta para continuar
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
