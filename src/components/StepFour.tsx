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
  if (!selectedService) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
          <Eye size={36} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Nenhum serviço selecionado
        </h3>
        <p className="text-gray-500 leading-relaxed">
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
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Confirme seu serviço
          </h2>
          <p className="text-gray-600">
            Revise os detalhes antes de agendar sua consulta
          </p>
        </div>

        {/* Service Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {selectedService.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">
                  {selectedService.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
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
              <div className="text-2xl font-bold text-gray-800">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(selectedService.price)}
              </div>
              <div className="text-xs text-gray-500 mt-1">por sessão</div>
            </div>
          </div>
        </div>

        {/* Next Step Indicator */}
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-sm flex items-center justify-center">
            <Calendar size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Próximo passo: Agendar consulta
          </h3>
          <p className="text-gray-500 text-sm">
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
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Resumo da sua consulta
        </h2>
        <p className="text-gray-600">
          Confira todos os detalhes antes de finalizar
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 p-1">
                <img
                  src={selectedAppointment.professional.avatar}
                  alt={selectedAppointment.professional.userName}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg">
                Online
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {selectedAppointment.professional.userName}
              </h3>
              <p className="text-gray-600 mb-3">
                {professionalTitle} • CRP {selectedAppointment.professional.crp}
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
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
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-purple-100 text-purple-700 border border-purple-200"
                }`}
              >
                {consultationType}
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Date & Time */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  Data e Horário
                </h4>
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      {appointmentDate.getDate()}
                    </div>
                    <div className="text-sm text-gray-600 mb-4 capitalize">
                      {formatDate(appointmentDate)}
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                      <Clock size={16} className="text-gray-500" />
                      <span className="font-semibold text-gray-800">
                        {selectedAppointment.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  Modalidade
                </h4>
                <div className="flex items-center gap-3 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
                  <MonitorPlay size={20} className="text-emerald-600" />
                  <div>
                    <div className="font-medium text-emerald-800">
                      Consulta Online
                    </div>
                    <div className="text-sm text-emerald-600">
                      Link será enviado por email
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Service & Payment */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  Serviço Contratado
                </h4>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isTherapist ? "bg-blue-100" : "bg-purple-100"
                      }`}
                    >
                      {isTherapist ? (
                        <User size={20} className="text-blue-600" />
                      ) : (
                        <Brain size={20} className="text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800 mb-1">
                        {selectedService.name}
                      </h5>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedService.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  Valor Total
                </h4>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Valor da consulta
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(selectedService.price)}
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                      <CreditCard size={24} className="text-gray-600" />
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
