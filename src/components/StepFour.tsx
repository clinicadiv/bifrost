import { useTheme } from "@/contexts/ThemeContext";
import { Psychologist, Service } from "@/types";
import {
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  MonitorPlay,
  Star,
  User,
} from "@phosphor-icons/react";

export interface SingleAppointment {
  date: string;
  time: string;
  professional: Psychologist;
  type: "psychologist" | "psychiatrist";
}

export const StepFour = ({
  selectedService,
  selectedAppointment,
}: {
  selectedService: Service | null;
  selectedAppointment: SingleAppointment | null;
}) => {
  const { theme } = useTheme();

  if (!selectedService) {
    return (
      <div className="text-center py-20">
        <div
          className={`w-20 h-20 mx-auto mb-6 ${
            theme === "dark"
              ? "bg-gradient-to-br from-gray-700 to-gray-600"
              : "bg-gradient-to-br from-gray-100 to-gray-200"
          } rounded-2xl flex items-center justify-center`}
        >
          <Eye
            size={36}
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-400"
            }`}
          />
        </div>
        <h3
          className={`text-xl font-semibold ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          } mb-2`}
        >
          Nenhum serviço selecionado
        </h3>
        <p
          className={`${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          } leading-relaxed`}
        >
          Volte aos passos anteriores para escolher o serviço desejado
        </p>
      </div>
    );
  }

  if (!selectedAppointment) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={`w-16 h-16 mx-auto mb-4 ${
              theme === "dark"
                ? "bg-gradient-to-br from-gray-700 to-gray-600"
                : "bg-gradient-to-br from-emerald-100 to-green-200"
            } rounded-2xl flex items-center justify-center`}
          >
            <CheckCircle
              size={32}
              className={`${
                theme === "dark" ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            } mb-2`}
          >
            Confirme seu serviço
          </h2>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Revise os detalhes antes de agendar sua consulta
          </p>
        </div>

        {/* Service Card */}
        <div
          className={`${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          } rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 p-6`}
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div
                className={`w-12 h-12 ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-gray-700 to-gray-600"
                    : "bg-gradient-to-br from-blue-100 to-indigo-100"
                } rounded-xl flex items-center justify-center flex-shrink-0`}
              >
                <Star
                  size={24}
                  className={`${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  } mb-1`}
                >
                  {selectedService.name}
                </h3>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  } text-sm leading-relaxed mb-3`}
                >
                  {selectedService.description}
                </p>
                <div
                  className={`flex items-center gap-4 text-xs ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    50 minutos
                  </span>
                  <span className="flex items-center gap-1">
                    <MonitorPlay size={12} />
                    Online
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(selectedService.pricing.yourPrice)}
              </div>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                } mt-1`}
              >
                por sessão
              </div>
            </div>
          </div>
        </div>

        {/* Next Step Indicator */}
        <div
          className={`text-center py-12 ${
            theme === "dark"
              ? "bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600"
              : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
          } rounded-2xl border-2 border-dashed`}
        >
          <div
            className={`w-16 h-16 mx-auto mb-4 ${
              theme === "dark" ? "bg-gray-700" : "bg-white"
            } rounded-2xl shadow-sm flex items-center justify-center`}
          >
            <Calendar
              size={32}
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-400"
              }`}
            />
          </div>
          <h3
            className={`text-lg font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            } mb-2`}
          >
            Próximo passo: Agendar consulta
          </h3>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } text-sm`}
          >
            Selecione uma data e horário no passo anterior
          </p>
        </div>
      </div>
    );
  }

  // Formatar data e hora para exibição
  const [datePart] = selectedAppointment.date.split("T");
  const dateTimeString = `${datePart}T${selectedAppointment.time}:00`;
  const appointmentDate = new Date(dateTimeString);

  const isTherapist = selectedAppointment.type === "psychologist";
  const professionalTitle = isTherapist ? "Psicólogo(a)" : "Psiquiatra";
  const consultationType = isTherapist
    ? "Consulta Psicológica"
    : "Consulta Psiquiátrica";

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div
          className={`w-16 h-16 mx-auto mb-4 ${
            theme === "dark"
              ? "bg-gradient-to-br from-gray-700 to-gray-600"
              : "bg-gradient-to-br from-emerald-100 to-green-200"
          } rounded-2xl flex items-center justify-center`}
        >
          <CheckCircle
            size={32}
            className={`${
              theme === "dark" ? "text-emerald-400" : "text-emerald-600"
            }`}
          />
        </div>
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          } mb-2`}
        >
          Resumo da sua consulta
        </h2>
        <p
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Confira todos os detalhes antes de finalizar
        </p>
      </div>

      {/* Main Card */}
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        } rounded-3xl border shadow-lg overflow-hidden`}
      >
        {/* Professional Header */}
        <div
          className={`${
            theme === "dark"
              ? "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 border-gray-600"
              : "bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 border-gray-100"
          } px-8 py-6 border-b`}
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-2xl ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-emerald-600 to-green-700"
                    : "bg-gradient-to-br from-emerald-400 to-green-500"
                } p-1`}
              >
                <img
                  src={selectedAppointment.professional.avatar}
                  alt={selectedAppointment.professional.userName}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div
                className={`absolute -bottom-2 -right-2 ${
                  theme === "dark" ? "bg-emerald-600" : "bg-emerald-500"
                } text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg`}
              >
                Online
              </div>
            </div>

            <div className="flex-1">
              <h3
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                } mb-1`}
              >
                {selectedAppointment.professional.userName}
              </h3>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } mb-3`}
              >
                {professionalTitle} • CRP {selectedAppointment.professional.crp}
              </p>
              <div
                className={`flex items-center gap-6 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-400" />
                  <span>
                    {selectedAppointment.professional.finishedAppointments}{" "}
                    consultas realizadas
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>50 minutos</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                  isTherapist
                    ? theme === "dark"
                      ? "bg-blue-900 text-blue-300 border border-blue-700"
                      : "bg-blue-100 text-blue-700 border border-blue-200"
                    : theme === "dark"
                    ? "bg-purple-900 text-purple-300 border border-purple-700"
                    : "bg-purple-100 text-purple-700 border border-purple-200"
                }`}
              >
                {consultationType}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Date and Time */}
            <div>
              <h4
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                } uppercase tracking-wide mb-4`}
              >
                Data e Horário
              </h4>
              <div
                className={`${
                  theme === "dark"
                    ? "bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600"
                    : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-100"
                } rounded-2xl p-6 border`}
              >
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    } mb-1`}
                  >
                    {selectedAppointment.time}
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    } mb-4 capitalize`}
                  >
                    {formatDate(appointmentDate)}
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-600"
                        : "bg-white border-gray-200"
                    } px-4 py-2 rounded-xl border shadow-sm`}
                  >
                    <Clock
                      size={16}
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      50 minutos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meeting Type */}
            <div>
              <h4
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                } uppercase tracking-wide mb-4`}
              >
                Tipo de Consulta
              </h4>
              <div
                className={`flex items-center gap-3 ${
                  theme === "dark"
                    ? "bg-emerald-900/30 border-emerald-700"
                    : "bg-emerald-50 border-emerald-100"
                } px-4 py-3 rounded-xl border`}
              >
                <MonitorPlay
                  size={20}
                  className={`${
                    theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
                <div>
                  <div
                    className={`font-medium ${
                      theme === "dark" ? "text-emerald-300" : "text-emerald-800"
                    }`}
                  >
                    Consulta Online
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  >
                    Via videoconferência
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div>
              <h4
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                } uppercase tracking-wide mb-4`}
              >
                Seu Profissional
              </h4>
              <div
                className={`${
                  theme === "dark"
                    ? "bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600"
                    : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100"
                } rounded-2xl p-6 border`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isTherapist
                        ? theme === "dark"
                          ? "bg-blue-900"
                          : "bg-blue-100"
                        : theme === "dark"
                        ? "bg-purple-900"
                        : "bg-purple-100"
                    }`}
                  >
                    {isTherapist ? (
                      <User
                        size={20}
                        className={`${
                          theme === "dark" ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                    ) : (
                      <Brain
                        size={20}
                        className={`${
                          theme === "dark"
                            ? "text-purple-400"
                            : "text-purple-600"
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <h5
                      className={`font-semibold ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      } mb-1`}
                    >
                      {selectedAppointment.professional.userName}
                    </h5>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      } leading-relaxed`}
                    >
                      {selectedAppointment.professional.bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div>
              <h4
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                } uppercase tracking-wide mb-4`}
              >
                Detalhes do Serviço
              </h4>
              <div
                className={`${
                  theme === "dark"
                    ? "bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600"
                    : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100"
                } rounded-2xl p-6 border`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5
                      className={`font-semibold ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      } mb-2`}
                    >
                      {selectedService.name}
                    </h5>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      } leading-relaxed mb-3`}
                    >
                      {selectedService.description}
                    </p>
                    <div
                      className={`flex items-center gap-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      } text-sm`}
                    >
                      <CreditCard size={16} />
                      <span>Pagamento no próximo passo</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(selectedService.pricing.yourPrice)}
                    </div>
                    <div
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      } mt-1`}
                    >
                      valor total
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
