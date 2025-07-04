import { findAllServices } from "@/services/http/service/find-all-services";
import { Service } from "@/types";
import { ShoppingBag, Sparkle } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Package } from "./Packge";

export const StepOne = ({
  setService,
  selectedService,
}: {
  setService: (service: Service | null) => void;
  selectedService: Service | null;
}) => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: findAllServices,
  });

  // Função para filtrar apenas serviços psicológicos e psiquiátricos
  const filterPsychServices = (services: Service[]) => {
    return services.filter((service) => {
      const serviceName = service.name.toLowerCase();
      return serviceName.includes("psic") || serviceName.includes("psiq");
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        {/* Header com loading */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-200 rounded-lg animate-pulse"></div>
            <div className="h-6 bg-blue-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="h-4 bg-blue-100 rounded w-96 animate-pulse"></div>
        </div>

        {/* Package skeletons */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-100 rounded w-32"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredServices =
    services && services.data.data.length > 0
      ? filterPsychServices(services.data.data)
      : [];

  return (
    <div className="flex flex-col gap-8">
      {/* Header elegante */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingBag size={24} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-blue-800">
            Escolha seu Tipo de Consulta
          </h3>
        </div>
        <p className="text-blue-600 text-sm leading-relaxed">
          Selecione entre consulta psicológica ou psiquiátrica.
        </p>
      </div>

      {/* Lista de pacotes com indicador de seleção */}
      <div className="space-y-4 px-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <Package
              key={service.id}
              service={service}
              setService={setService}
              isSelected={service.id === selectedService?.id}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShoppingBag size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              Nenhum serviço psicológico ou psiquiátrico disponível
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Tente novamente mais tarde
            </p>
          </div>
        )}
      </div>

      {/* Dica de seleção */}
      {filteredServices.length > 0 && !selectedService && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Sparkle size={20} className="text-amber-600" />
            <p className="text-amber-800 text-sm font-medium">
              Selecione um tipo de consulta para continuar
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
