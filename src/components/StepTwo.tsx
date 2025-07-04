import { Service } from "@/types";
import { CheckCircle, CurrencyDollar, Info } from "@phosphor-icons/react";

export const StepTwo = ({
  selectedService,
}: {
  selectedService: Service | null;
}) => {
  if (!selectedService) {
    return (
      <div className="text-center py-16">
        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Info size={32} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg font-medium">
          Nenhum serviço selecionado
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Volte ao passo anterior para selecionar um serviço
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header de confirmação */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle size={24} className="text-green-600" weight="fill" />
          </div>
          <h3 className="text-xl font-semibold text-green-800">
            Serviço Selecionado
          </h3>
        </div>
        <p className="text-green-600 text-sm leading-relaxed">
          Revise os detalhes do seu serviço antes de prosseguir para o
          agendamento.
        </p>
      </div>

      {/* Card do serviço selecionado */}
      <div className="bg-white rounded-xl border-2 border-green-200 shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Título e preço */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl text-gray-800 font-bold mb-4">
                {selectedService.name}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {selectedService.description}
              </p>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(selectedService.price)}
              </div>
              <div className="text-sm text-gray-500">Valor do serviço</div>
            </div>
          </div>

          {/* Informações importantes */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-gray-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Informações Importantes
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <CurrencyDollar size={24} className="text-blue-600" />
          <h4 className="text-lg font-semibold text-blue-800">
            Resumo do Serviço
          </h4>
        </div>

        <p className="text-blue-700 leading-relaxed">
          {selectedService.description ||
            "Serviço de saúde mental especializado com profissionais qualificados para oferecer o melhor cuidado personalizado para suas necessidades."}
        </p>
      </div>
    </div>
  );
};
