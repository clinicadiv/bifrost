import { Service } from "@/types";
import { CheckCircle, Circle } from "@phosphor-icons/react";

export const Package = ({
  service,
  setService,
  isSelected,
}: {
  service: Service;
  setService: (service: Service | null) => void;
  isSelected: boolean;
}) => {
  const handleSelectPackage = () => {
    setService(service);
  };

  return (
    <div
      className={`group relative rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
        isSelected
          ? "border-green-500 bg-green-50 shadow-lg scale-[1.02]"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:scale-[1.01]"
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
            className="text-gray-300 group-hover:text-gray-400"
          />
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between">
          {/* Conteúdo principal */}
          <div className="flex-1 pr-4">
            <h3
              className={`text-xl font-semibold mb-3 transition-colors ${
                isSelected ? "text-green-800" : "text-gray-800"
              }`}
            >
              {service.name}
            </h3>

            <p className="text-sm text-gray-500 max-w-9/12">
              {service.description}
            </p>
          </div>

          {/* Preço */}
          <div className="text-right -translate-x-5">
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(service.price)}
            </div>
            <div className="text-xs text-gray-500">Total do serviço</div>
          </div>
        </div>

        {/* Barra de seleção na parte inferior */}
        <div
          className={`mt-4 h-1 rounded-full transition-all duration-300 ${
            isSelected
              ? "bg-gradient-to-r from-green-400 to-green-600"
              : "bg-gray-100 group-hover:bg-gray-200"
          }`}
        />
      </div>
    </div>
  );
};
