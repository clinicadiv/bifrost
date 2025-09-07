import { useTheme } from "@/contexts/ThemeContext";
import { Service } from "@/types";
import { CheckCircle, CurrencyDollar, Info } from "@phosphor-icons/react";

export const StepTwo = ({
  selectedService,
}: {
  selectedService: Service | null;
}) => {
  const { theme } = useTheme();

  if (!selectedService) {
    return (
      <div className="text-center py-16">
        <div
          className={`p-4 ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-100"
          } rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}
        >
          <Info
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
          Nenhum serviço selecionado
        </p>
        <p
          className={`text-sm mt-1 ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Volte ao passo anterior para selecionar um serviço
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header de confirmação */}
      <div
        className={`${
          theme === "dark"
            ? "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600"
            : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
        } border rounded-xl p-6`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`p-2 ${
              theme === "dark" ? "bg-gray-600" : "bg-green-100"
            } rounded-lg`}
          >
            <CheckCircle
              size={24}
              className={`${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
              weight="fill"
            />
          </div>
          <h3
            className={`text-xl font-semibold ${
              theme === "dark" ? "text-green-400" : "text-green-800"
            }`}
          >
            Serviço Selecionado
          </h3>
        </div>
        <p
          className={`text-sm leading-relaxed ${
            theme === "dark" ? "text-gray-300" : "text-green-600"
          }`}
        >
          Revise os detalhes do seu serviço antes de prosseguir para o
          agendamento.
        </p>
      </div>

      {/* Card do serviço selecionado */}
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-800 border-gray-600"
            : "bg-white border-green-200"
        } rounded-xl border-2 shadow-lg overflow-hidden`}
      >
        <div className="p-8">
          {/* Título e preço */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {selectedService.name}
              </h2>
              <p
                className={`leading-relaxed ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {selectedService.description}
              </p>
            </div>

            <div className="text-right">
              <div
                className={`text-3xl font-bold mb-1 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(
                  (selectedService.pricing as any).finalPrice ??
                    (selectedService.pricing as any).yourPrice ??
                    0
                )}
              </div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Valor do serviço
              </div>
            </div>
          </div>

          {/* Informações importantes */}
          <div
            className={`${
              theme === "dark"
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200"
            } border rounded-lg p-4`}
          >
            <div className="flex items-start gap-3">
              <Info
                size={20}
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                } mt-0.5`}
              />
              <div>
                <h4
                  className={`font-medium mb-2 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Informações Importantes
                </h4>
                <ul
                  className={`space-y-1 text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <li>• Serviço deve ser agendado separadamente</li>
                  <li>• Profissionais especializados e qualificados</li>
                  <li>• Atendimento presencial e online disponível</li>
                  <li>• Pagamento processado no momento do agendamento</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo descritivo */}
      <div
        className={`${
          theme === "dark"
            ? "bg-blue-900/30 border-blue-700"
            : "bg-blue-50 border-blue-200"
        } border rounded-lg p-6`}
      >
        <div className="flex items-center gap-3 mb-3">
          <CurrencyDollar
            size={24}
            className={`${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <h4
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-blue-400" : "text-blue-800"
            }`}
          >
            Resumo do Serviço
          </h4>
        </div>

        <p
          className={`leading-relaxed ${
            theme === "dark" ? "text-blue-300" : "text-blue-700"
          }`}
        >
          {selectedService.description ||
            "Serviço de saúde mental especializado com profissionais qualificados para oferecer o melhor cuidado personalizado para suas necessidades."}
        </p>
      </div>
    </div>
  );
};
