import { useTheme } from "@/contexts/ThemeContext";
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
} from "@phosphor-icons/react";
import { Button } from "./Button";

interface StepSevenProps {
  selectedService?: {
    name: string;
    pricing: {
      originalPrice: number;
      yourPrice: number;
      savings: number;
    };
  } | null;
  selectedAppointment?: {
    date: string;
    time: string;
    professional: {
      userName: string;
    };
  } | null;
  paymentMethod?: "PIX" | "CREDIT_CARD";
  onNewAppointment?: () => void;
}

export const StepSeven = ({
  selectedService,
  selectedAppointment,
  paymentMethod,
  onNewAppointment,
}: StepSevenProps) => {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-[500px] space-y-8 max-w-6xl mx-auto">
      {/* Header com ícone e mensagem principal - Layout horizontal */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 text-center lg:text-left">
        {/* Ícone de sucesso */}
        <div
          className={`w-24 h-24 ${
            theme === "dark" ? "bg-green-900/30" : "bg-green-100"
          } rounded-full flex items-center justify-center flex-shrink-0`}
        >
          <CheckCircle size={48} className="text-green-600" weight="fill" />
        </div>

        {/* Mensagem principal */}
        <div className="space-y-4 flex-1">
          <h1
            className={`text-3xl font-bold font-satoshi ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Parabéns! 🎉
          </h1>
          <h2
            className={`text-xl font-satoshi font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Sua consulta foi agendada com sucesso!
          </h2>
          <p
            className={`leading-relaxed max-w-lg ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Obrigado por confiar em nossos serviços. Você receberá todas as
            informações por email e também poderá acompanhar sua consulta no
            painel.
          </p>
        </div>
      </div>

      {/* Grid principal com informações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resumo da consulta */}
        {selectedService && selectedAppointment && (
          <div
            className={`${
              theme === "dark"
                ? "bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-700"
                : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
            } border rounded-xl p-6`}
          >
            <h3
              className={`font-semibold mb-6 flex items-center gap-2 ${
                theme === "dark" ? "text-green-400" : "text-green-800"
              }`}
            >
              📅 Resumo da sua consulta
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  } rounded-lg flex items-center justify-center`}
                >
                  <Calendar size={18} className="text-green-600" />
                </div>
                <div>
                  <p
                    className={`text-xs uppercase tracking-wide ${
                      theme === "dark" ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    Data
                  </p>
                  <p
                    className={`font-medium text-sm ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {formatDate(selectedAppointment.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  } rounded-lg flex items-center justify-center`}
                >
                  <Clock size={18} className="text-green-600" />
                </div>
                <div>
                  <p
                    className={`text-xs uppercase tracking-wide ${
                      theme === "dark" ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    Horário
                  </p>
                  <p
                    className={`font-medium text-sm ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {selectedAppointment.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  } rounded-lg flex items-center justify-center`}
                >
                  <CreditCard size={18} className="text-green-600" />
                </div>
                <div>
                  <p
                    className={`text-xs uppercase tracking-wide ${
                      theme === "dark" ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    Serviço
                  </p>
                  <p
                    className={`font-medium text-sm ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {selectedService.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  } rounded-lg flex items-center justify-center`}
                >
                  <span className="text-green-600 font-bold text-lg">👨‍⚕️</span>
                </div>
                <div>
                  <p
                    className={`text-xs uppercase tracking-wide ${
                      theme === "dark" ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    Profissional
                  </p>
                  <p
                    className={`font-medium text-sm ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {selectedAppointment.professional.userName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coluna direita com informações adicionais */}
        <div className="space-y-6">
          {/* Informações de pagamento */}
          <div
            className={`${
              theme === "dark"
                ? "bg-blue-900/30 border-blue-700"
                : "bg-blue-50 border-blue-200"
            } border rounded-xl p-6`}
          >
            <h3
              className={`font-semibold mb-4 flex items-center gap-2 ${
                theme === "dark" ? "text-blue-400" : "text-blue-800"
              }`}
            >
              💳 Pagamento
            </h3>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-blue-300" : "text-blue-700"
              }`}
            >
              {paymentMethod === "PIX"
                ? "Pagamento via PIX processado com sucesso"
                : "Pagamento no cartão processado com sucesso"}
            </p>
            <div
              className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                theme === "dark"
                  ? "bg-blue-900/50 text-blue-400"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              ✅ Confirmado
            </div>
          </div>

          {/* Próximos passos */}
          <div
            className={`${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-200"
            } border rounded-xl p-6`}
          >
            <h4
              className={`font-semibold mb-4 flex items-center gap-2 ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              📋 Próximos passos
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Você receberá um email de confirmação
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Esteja online 5 minutos antes
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Tenha seus documentos em mãos
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Acesse o painel para detalhes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de ação - centralizados */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
        <Button
          variant="primary.regular"
          onClick={() => (window.location.href = "/consultas")}
          className="w-full sm:w-auto"
        >
          Ver minhas consultas
        </Button>
        <Button
          variant="gray.light"
          onClick={onNewAppointment}
          className="w-full sm:w-auto"
        >
          Agendar nova consulta
        </Button>
      </div>
    </div>
  );
};
