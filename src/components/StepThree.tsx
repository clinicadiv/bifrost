"use client";

import { findPsychiatrists } from "@/services/http/psychiatrist/find-psyquiatrists";
import { findPsychologists } from "@/services/http/psychologist/find-psychologists";
import {
  Psychologist,
  SelectedAppointment,
  Service,
  ServiceType,
} from "@/types";
import {
  Brain,
  Calendar,
  CaretLeft,
  CaretRight,
  CheckCircle,
  MapPin,
  Star,
  User,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface StepThreeProps {
  selectedService: Service | null;
  serviceType: ServiceType;
  selectedAppointment: SelectedAppointment | null;
  setSelectedAppointment: React.Dispatch<
    React.SetStateAction<SelectedAppointment | null>
  >;
}

export const StepThree = ({
  selectedService,
  serviceType,
  selectedAppointment,
  setSelectedAppointment,
}: StepThreeProps) => {
  const [selectedProfessional, setSelectedProfessional] =
    useState<Psychologist | null>(null);
  const [currentWeek, setCurrentWeek] = useState(0);

  const getWeekDates = (weekOffset = 0) => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1 + weekOffset * 7);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const fetchPsychologistsData = async () => {
    if (!selectedService || serviceType !== "psychologist") return [];

    const today = new Date();
    const startDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 29);
    const endDateStr = `${endDate.getFullYear()}-${String(
      endDate.getMonth() + 1
    ).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

    return findPsychologists({ startDate, endDate: endDateStr });
  };

  const fetchPsychiatristsData = async () => {
    if (!selectedService || serviceType !== "psychiatrist") return [];

    const today = new Date();
    const startDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 29);
    const endDateStr = `${endDate.getFullYear()}-${String(
      endDate.getMonth() + 1
    ).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

    return findPsychiatrists({ startDate, endDate: endDateStr });
  };

  const { data: psychologists } = useQuery({
    queryKey: ["psychologists"],
    queryFn: fetchPsychologistsData,
    enabled: !!selectedService && serviceType === "psychologist",
  });

  const { data: psychiatrists } = useQuery({
    queryKey: ["psychiatrists"],
    queryFn: fetchPsychiatristsData,
    enabled: !!selectedService && serviceType === "psychiatrist",
  });

  const handleAppointmentSelect = (
    professional: Psychologist,
    date: string,
    time: string,
    type: "psychologist" | "psychiatrist"
  ) => {
    const appointment: SelectedAppointment = {
      medicalId: professional.id,
      date,
      time,
      type,
      professional,
    };
    setSelectedAppointment(appointment);
  };

  const isTimeSelected = (
    professionalId: string,
    date: string,
    time: string
  ) => {
    return (
      selectedAppointment &&
      selectedAppointment.medicalId === professionalId &&
      selectedAppointment.date === date &&
      selectedAppointment.time === time
    );
  };

  const getNextAvailableTimes = (professional: Psychologist, limit = 6) => {
    const times: Array<{ date: string; time: string; dayName: string }> = [];
    const today = new Date();

    professional.availableTimes?.forEach((timeSlot) => {
      const slotDate = new Date(timeSlot.date);
      if (slotDate >= today) {
        timeSlot.times.forEach((time) => {
          times.push({
            date: timeSlot.date,
            time: time.time,
            dayName: slotDate.toLocaleDateString("pt-BR", { weekday: "short" }),
          });
        });
      }
    });

    return times.slice(0, limit);
  };

  const renderCompactProfessionalCard = (
    professional: Psychologist,
    type: "psychologist" | "psychiatrist"
  ) => {
    const nextTimes = getNextAvailableTimes(professional);
    const hasSelectedAppointment =
      selectedAppointment?.medicalId === professional.id;

    return (
      <div
        key={professional.id}
        className={`bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
          hasSelectedAppointment
            ? "border-green-400 shadow-lg ring-4 ring-green-100"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {/* Header do profissional */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={professional.avatar}
                  alt={professional.userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  Dr(a). {professional.userName}
                </h3>
                {type === "psychologist" ? (
                  <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                    <User size={12} className="inline mr-1" />
                    Psicólogo
                  </div>
                ) : (
                  <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
                    <Brain size={12} className="inline mr-1" />
                    Psiquiatra
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>CRP {professional.crp}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle size={14} className="text-green-500" />
                  <span>
                    {professional.finishedAppointments || 0} consultas
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500" />
                  <span>4.9 (156)</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2">
                {professional.bio ||
                  "Profissional especializado em atendimento psicológico com foco em bem-estar e qualidade de vida."}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Sessão
                </div>
                <div className="text-sm font-bold text-gray-800">50 min</div>
              </div>
            </div>
          </div>
        </div>

        {/* Botão para ver horários */}
        <div className="p-6">
          <button
            onClick={() => setSelectedProfessional(professional)}
            className="cursor-pointer w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-xl px-4 py-3 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <Calendar size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700 group-hover:text-blue-800">
              Ver horários disponíveis
            </span>
            <CaretRight
              size={14}
              className="text-blue-600 group-hover:translate-x-0.5 transition-transform"
            />
          </button>

          {nextTimes.length === 0 && (
            <div className="text-center py-2 mt-3">
              <p className="text-xs text-gray-500">Sem horários disponíveis</p>
            </div>
          )}
        </div>

        {hasSelectedAppointment && (
          <div className="px-6 py-4 bg-green-50 border-t border-green-100">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle size={16} />
              <span className="text-sm font-medium">
                Consulta agendada para{" "}
                {new Date(selectedAppointment.date).toLocaleDateString("pt-BR")}{" "}
                às {selectedAppointment.time}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFullCalendar = (
    professional: Psychologist,
    type: "psychologist" | "psychiatrist"
  ) => {
    const weekDates = getWeekDates(currentWeek);
    const today = new Date().toDateString();

    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
        {/* Header do profissional */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedProfessional(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <CaretLeft size={16} />
                <span className="text-sm font-medium">Voltar</span>
              </button>

              <div className="w-px h-6 bg-gray-300"></div>

              <div className="flex items-center gap-3">
                <img
                  src={professional.avatar}
                  alt={professional.userName}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Dr(a). {professional.userName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>CRP {professional.crp}</span>
                    <span>•</span>
                    <span>
                      {professional.finishedAppointments || 0} consultas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navegação da semana */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
              disabled={currentWeek === 0}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CaretLeft size={16} />
              <span className="text-sm font-medium">Semana anterior</span>
            </button>

            <div className="text-center">
              <div className="text-sm font-semibold text-gray-800">
                {weekDates[0].toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                })}{" "}
                -{" "}
                {weekDates[6].toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            <button
              onClick={() => setCurrentWeek(currentWeek + 1)}
              disabled={currentWeek >= 3}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-sm font-medium">Próxima semana</span>
              <CaretRight size={16} />
            </button>
          </div>
        </div>

        {/* Grid do calendário */}
        <div className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {weekDates.map((date) => {
              const dateStr = date.toISOString().split("T")[0];
              const daySchedule = professional.availableTimes?.find(
                (slot) => slot.date === dateStr
              );
              const isToday = date.toDateString() === today;
              const isPast = date < new Date() && !isToday;
              const dayName = date.toLocaleDateString("pt-BR", {
                weekday: "short",
              });

              return (
                <div key={dateStr} className="text-center">
                  <div
                    className={`p-3 rounded-lg mb-3 ${
                      isToday
                        ? "bg-blue-500 text-white"
                        : isPast
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="text-xs font-medium uppercase tracking-wide mb-1">
                      {dayName}
                    </div>
                    <div className="text-lg font-bold">{date.getDate()}</div>
                  </div>

                  <div className="space-y-2">
                    {isPast ? (
                      <div className="text-xs text-gray-400 py-2">
                        Indisponível
                      </div>
                    ) : daySchedule?.times && daySchedule.times.length > 0 ? (
                      daySchedule.times.map((timeSlot) => {
                        const isSelected = isTimeSelected(
                          professional.id,
                          dateStr,
                          timeSlot.time
                        );

                        return (
                          <button
                            key={timeSlot.time}
                            onClick={() =>
                              handleAppointmentSelect(
                                professional,
                                dateStr,
                                timeSlot.time,
                                type
                              )
                            }
                            className={`w-full px-2 py-2 rounded-lg text-xs font-medium transition-all transform hover:scale-105 ${
                              isSelected
                                ? "bg-green-500 text-white shadow-lg scale-105"
                                : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md"
                            }`}
                          >
                            {timeSlot.time}
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-xs text-gray-400 py-2">
                        Sem horários
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderProfessionalsList = (
    professionals: Psychologist[],
    type: "psychologist" | "psychiatrist"
  ) => {
    if (!professionals || professionals.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Calendar size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">
            Nenhum profissional disponível
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Tente novamente em alguns instantes
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {selectedProfessional ? (
          renderFullCalendar(selectedProfessional, type)
        ) : (
          <div className="grid gap-6">
            {professionals.map((professional) =>
              renderCompactProfessionalCard(professional, type)
            )}
          </div>
        )}
      </div>
    );
  };

  if (!selectedService || !serviceType) {
    return (
      <div className="text-center py-16">
        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Calendar size={32} className="text-gray-400" />
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
    <div className="space-y-6">
      {/* Header com informações do serviço */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <Calendar size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Todos os horários disponíveis
            </h2>
            <p className="text-gray-600 mt-1">
              Visualize todos os horários de todos os profissionais e escolha o
              que melhor se adequa à sua rotina
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                serviceType === "psychologist" ? "bg-blue-100" : "bg-purple-100"
              }`}
            >
              {serviceType === "psychologist" ? (
                <User size={16} className="text-blue-600" />
              ) : (
                <Brain size={16} className="text-purple-600" />
              )}
            </div>
            <span className="font-medium text-gray-700">
              {serviceType === "psychologist" ? "Psicólogos" : "Psiquiatras"}{" "}
              disponíveis
            </span>
          </div>

          {selectedAppointment && (
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl">
              <CheckCircle size={16} />
              <span className="font-medium">
                {new Date(selectedAppointment.date).toLocaleDateString("pt-BR")}{" "}
                às {selectedAppointment.time} com Dr(a).{" "}
                {selectedAppointment.professional.userName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Lista de profissionais ou calendário completo */}
      {serviceType === "psychologist" &&
        renderProfessionalsList(psychologists || [], "psychologist")}
      {serviceType === "psychiatrist" &&
        renderProfessionalsList(psychiatrists || [], "psychiatrist")}
    </div>
  );
};
