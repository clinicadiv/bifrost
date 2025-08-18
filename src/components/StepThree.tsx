"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { findPsychiatrists } from "@/services/http/psychiatrist";
import { findPsychologists } from "@/services/http/psychologist";
import { SelectedAppointment, Service, ServiceType } from "@/types";
import { Psychologist } from "@/types/Psychologist";
import { formatLocalDate, getDateRange } from "@/utils";
import {
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Lightbulb,
  Star,
  User,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "./Button";

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
  const { theme } = useTheme();
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

    try {
      const today = new Date();
      const { startDate, endDate } = getDateRange(today, 29);

      const result = await findPsychologists({ startDate, endDate });
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Erro ao buscar psicólogos:", error);
      return [];
    }
  };

  const fetchPsychiatristsData = async () => {
    if (!selectedService || serviceType !== "psychiatrist") return [];

    try {
      const today = new Date();
      const { startDate, endDate } = getDateRange(today, 29);

      const result = await findPsychiatrists({ startDate, endDate });
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Erro ao buscar psiquiatras:", error);
      return [];
    }
  };

  const { data: psychologists } = useQuery({
    queryKey: ["psychologists", selectedService?.id, serviceType],
    queryFn: fetchPsychologistsData,
    enabled: !!selectedService && serviceType === "psychologist",
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const { data: psychiatrists } = useQuery({
    queryKey: ["psychiatrists", selectedService?.id, serviceType],
    queryFn: fetchPsychiatristsData,
    enabled: !!selectedService && serviceType === "psychiatrist",
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const handleAppointmentSelect = (
    professional: Psychologist,
    date: string,
    time: string,
    type: "psychologist" | "psychiatrist"
  ) => {
    try {
      // Verificação de segurança
      if (!professional || !professional.id || !date || !time) {
        console.error("Dados insuficientes para criar appointment:", {
          professional,
          date,
          time,
          type,
        });
        return;
      }

      const appointment: SelectedAppointment = {
        medicalId: professional.id,
        date,
        time,
        type,
        professional,
      };
      setSelectedAppointment(appointment);
    } catch (error) {
      console.error("Erro ao selecionar appointment:", error);
    }
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

    // Verificação de segurança para evitar erros
    if (!professional || !professional.availableTimes) {
      return [];
    }

    professional.availableTimes.forEach((timeSlot) => {
      if (!timeSlot || !timeSlot.date || !timeSlot.times) {
        return;
      }

      const slotDate = new Date(timeSlot.date);
      if (slotDate >= today) {
        timeSlot.times.forEach((time) => {
          if (time && time.time) {
            times.push({
              date: timeSlot.date,
              time: time.time,
              dayName: slotDate.toLocaleDateString("pt-BR", {
                weekday: "short",
              }),
            });
          }
        });
      }
    });

    return times.slice(0, limit);
  };

  const renderCompactProfessionalCard = (
    professional: Psychologist,
    type: "psychologist" | "psychiatrist"
  ) => {
    // Verificação de segurança para o objeto professional
    if (!professional || !professional.id) {
      return null;
    }

    const nextTimes = getNextAvailableTimes(professional);
    const hasSelectedAppointment =
      selectedAppointment?.medicalId === professional.id;

    return (
      <div
        key={professional.id}
        className={`${
          theme === "dark"
            ? "bg-gray-900/50 border-gray-700/50"
            : "bg-white/70 border-gray-200/50"
        } backdrop-blur-sm rounded-3xl border transition-all duration-300 hover:shadow-lg ${
          hasSelectedAppointment
            ? `border-green-400 shadow-2xl ring-4 ${
                theme === "dark" ? "ring-green-800/30" : "ring-green-100/50"
              }`
            : `${
                theme === "dark"
                  ? "hover:border-gray-600/70"
                  : "hover:border-gray-300/70"
              }`
        }`}
      >
        <div className="p-8">
          <div className="flex items-start gap-6">
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-xl ring-4 ring-white/10">
                <img
                  src={
                    professional.avatar ||
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyMCIgeT0iMjAiPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI0IiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMiAxNGMtNC40MiAwLTggMS43OS04IDRzMy41OCA0IDggNCA4LTEuNzkgOC00LTMuNTgtNC04LTR6IiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo8L3N2Zz4K"
                  }
                  alt={professional.userName || "Profissional"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyMCIgeT0iMjAiPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI0IiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMiAxNGMtNC40MiAwLTggMS43OS04IDRzMy41OCA0IDggNCA4LTEuNzkgOC00LTMuNTgtNC04LTR6IiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo8L3N2Zz4K";
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-400 to-green-500 w-6 h-6 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    } mb-1`}
                  >
                    Dr(a). {professional.userName || "Profissional"}
                  </h3>

                  {type === "psychologist" ? (
                    <div
                      className={`inline-flex items-center gap-2 ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      } px-3 py-1.5 rounded-full text-sm font-medium shadow-lg`}
                    >
                      <User size={14} weight="fill" />
                      Psicólogo
                    </div>
                  ) : (
                    <div
                      className={`inline-flex items-center gap-2 ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                          : "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                      } px-3 py-1.5 rounded-full text-sm font-medium shadow-lg`}
                    >
                      <Brain size={14} weight="fill" />
                      Psiquiatra
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Star size={16} weight="fill" className="text-yellow-400" />
                    <span
                      className={`font-semibold ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      4.9
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User
                      size={16}
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {professional.finishedAppointments || 0} consultas
                    </span>
                  </div>
                </div>
              </div>

              {professional.specialties &&
                Array.isArray(professional.specialties) &&
                professional.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {professional.specialties
                      .slice(0, 3)
                      .map((specialty, index) => (
                        <span
                          key={index}
                          className={`${
                            theme === "dark"
                              ? "bg-gray-700/50 text-gray-300"
                              : "bg-gray-100/80 text-gray-700"
                          } px-3 py-1.5 rounded-full text-xs font-medium border ${
                            theme === "dark"
                              ? "border-gray-600/50"
                              : "border-gray-200/50"
                          }`}
                        >
                          {specialty}
                        </span>
                      ))}
                    {professional.specialties.length > 3 && (
                      <span
                        className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        } px-3 py-1.5`}
                      >
                        +{professional.specialties.length - 3} mais
                      </span>
                    )}
                  </div>
                )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-full ${
                      theme === "dark" ? "bg-gray-700/50" : "bg-gray-100/80"
                    }`}
                  >
                    <Clock
                      size={16}
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {nextTimes.length > 0
                      ? `${nextTimes.length} horários disponíveis`
                      : "Sem horários disponíveis"}
                  </span>
                </div>

                <Button
                  variant="primary.lighter"
                  size="sm"
                  onClick={() => {
                    setSelectedProfessional(professional);
                    setCurrentWeek(0);
                  }}
                  disabled={nextTimes.length === 0}
                  className="px-6 py-3 text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Ver calendário completo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFullCalendar = (
    professional: Psychologist,
    type: "psychologist" | "psychiatrist"
  ) => {
    // Verificação de segurança para o objeto professional
    if (!professional || !professional.id) {
      return null;
    }

    const weekDates = getWeekDates(currentWeek);
    const weekDays = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];

    return (
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } rounded-2xl border-2 shadow-xl`}
      >
        {/* Header do profissional */}
        <div
          className={`p-6 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setSelectedProfessional(null);
                  setCurrentWeek(0);
                }}
                className={`p-2 ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                } rounded-lg transition-colors`}
              >
                ←
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden">
                  <img
                    src={
                      professional.avatar ||
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyMCIgeT0iMjAiPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI0IiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMiAxNGMtNC40MiAwLTggMS43OS04IDRzMy41OCA0IDggNCA4LTEuNzkgOC00LTMuNTgtNC04LTR6IiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo8L3N2Zz4K"
                    }
                    alt={professional.userName || "Profissional"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyMCIgeT0iMjAiPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI0IiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMiAxNGMtNC40MiAwLTggMS43OS04IDRzMy41OCA0IDggNCA4LTEuNzkgOC00LTMuNTgtNC04LTR6IiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo8L3N2Zz4K";
                    }}
                  />
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold ${
                      theme === "dark" ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Dr(a). {professional.userName || "Profissional"}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star size={14} weight="fill" className="text-yellow-400" />
                    <span>4.9</span>
                    <span>•</span>
                    <span>
                      {professional.finishedAppointments || 0} consultas
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentWeek(currentWeek - 1)}
                disabled={currentWeek === 0}
                className={`p-2 rounded-lg transition-colors ${
                  currentWeek === 0
                    ? "opacity-50 cursor-not-allowed"
                    : theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                ←
              </button>
              <span
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Semana {currentWeek + 1}
              </span>
              <button
                onClick={() => setCurrentWeek(currentWeek + 1)}
                disabled={currentWeek >= 3}
                className={`p-2 rounded-lg transition-colors ${
                  currentWeek >= 3
                    ? "opacity-50 cursor-not-allowed"
                    : theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Calendário semanal */}
        <div className="p-6">
          {/* Grid dos dias da semana */}
          <div className="grid grid-cols-7 gap-3">
            {weekDays.map((day, dayIndex) => {
              const currentDate = weekDates[dayIndex];
              const dateStr = formatLocalDate(currentDate);
              const availableSlot = professional.availableTimes?.find(
                (slot) => slot && slot.date === dateStr
              );

              return (
                <div key={dayIndex} className="text-center">
                  <div
                    className={`mb-3 p-3 rounded-lg ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`text-xs font-medium ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      } mb-1`}
                    >
                      {day}
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {currentDate.getDate()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {availableSlot &&
                    availableSlot.times &&
                    Array.isArray(availableSlot.times) ? (
                      availableSlot.times.map((time, timeIndex) => (
                        <button
                          key={timeIndex}
                          onClick={() =>
                            handleAppointmentSelect(
                              professional,
                              dateStr,
                              time.time,
                              type
                            )
                          }
                          className={`w-full p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                            isTimeSelected(professional.id, dateStr, time.time)
                              ? "bg-green-500 text-white shadow-lg"
                              : `${
                                  theme === "dark"
                                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`
                          } hover:shadow-md`}
                        >
                          {time.time}
                        </button>
                      ))
                    ) : (
                      <div
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-500" : "text-gray-400"
                        } p-2`}
                      >
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
    if (selectedProfessional) {
      return renderFullCalendar(selectedProfessional, type);
    }

    // Verificação de segurança para o array de profissionais
    if (
      !professionals ||
      !Array.isArray(professionals) ||
      professionals.length === 0
    ) {
      return null;
    }

    return (
      <div className="space-y-6">
        {professionals
          .filter((professional) => professional && professional.id)
          .map((professional) =>
            renderCompactProfessionalCard(professional, type)
          )}
      </div>
    );
  };

  if (!selectedService) {
    return (
      <div className="text-center py-16">
        <div
          className={`p-4 ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-100"
          } rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}
        >
          <Calendar
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
          Selecione um serviço primeiro
        </p>
        <p
          className={`text-sm mt-1 ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Volte ao primeiro passo para escolher um serviço
        </p>
      </div>
    );
  }

  const professionals =
    serviceType === "psychologist"
      ? psychologists
      : serviceType === "psychiatrist"
      ? psychiatrists
      : [];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div
        className={`${
          theme === "dark"
            ? "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600"
            : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200"
        } border rounded-xl p-6`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`p-2 ${
              theme === "dark" ? "bg-gray-600" : "bg-indigo-100"
            } rounded-lg`}
          >
            <Calendar
              size={24}
              className={`${
                theme === "dark" ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
          </div>
          <h3
            className={`text-xl font-semibold ${
              theme === "dark" ? "text-indigo-400" : "text-indigo-800"
            }`}
          >
            Agendar Consulta
          </h3>
        </div>
        <p
          className={`text-sm leading-relaxed ${
            theme === "dark" ? "text-gray-300" : "text-indigo-600"
          }`}
        >
          Escolha o profissional e o horário que melhor se adequa à sua agenda.
        </p>
      </div>

      {/* Confirmação da seleção */}
      {selectedAppointment && (
        <div
          className={`${
            theme === "dark"
              ? "bg-green-900/30 border-green-700"
              : "bg-green-50 border-green-200"
          } border rounded-xl p-6`}
        >
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle size={24} className="text-green-600" weight="fill" />
            <h4
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-green-400" : "text-green-800"
              }`}
            >
              Horário Selecionado
            </h4>
          </div>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-green-300" : "text-green-700"
            }`}
          >
            Dr(a). {selectedAppointment.professional.userName || "Profissional"}{" "}
            - {selectedAppointment.date} às {selectedAppointment.time}
          </p>
        </div>
      )}

      {/* Lista de profissionais */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`p-2 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            } rounded-lg`}
          >
            {serviceType === "psychologist" ? (
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
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`}
              />
            )}
          </div>
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {serviceType === "psychologist" ? "Psicólogos" : "Psiquiatras"}{" "}
            Disponíveis
          </h3>
        </div>

        {professionals && professionals.length > 0 && serviceType ? (
          renderProfessionalsList(professionals, serviceType)
        ) : (
          <div
            className={`${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } rounded-2xl border-2 p-12 text-center`}
          >
            <div
              className={`p-4 ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              } rounded-2xl inline-block mb-4`}
            >
              <Lightbulb
                size={48}
                weight="bold"
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              />
            </div>
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-gray-200" : "text-gray-900"
              } mb-2`}
            >
              Carregando profissionais...
            </h3>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Buscando os melhores profissionais para você
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
