import { findPsychiatrists } from "@/services/http/psychiatrist";
import { findPsychologists } from "@/services/http/psychologist";
import { Psychologist } from "@/types";
import { formatDate, formatDateForDisplay, formatLocalDate } from "@/utils";
import {
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  CurrencyDollar,
  Star,
  User,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Button } from "./Button";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    date: string;
    doctor: string;
    type: number;
    amount: number;
    duration: number;
  };
  onReschedule: (
    appointmentId: string,
    professionalId: string,
    date: string,
    time: string
  ) => Promise<void>;
}

export function RescheduleModal({
  isOpen,
  onClose,
  appointment,
  onReschedule,
}: RescheduleModalProps) {
  const [selectedProfessional, setSelectedProfessional] =
    useState<Psychologist | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    time: string;
    date: string;
  } | null>(null);
  const [availableProfessionals, setAvailableProfessionals] = useState<
    Psychologist[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<
    "professional" | "calendar" | "confirm" | "success" | "error"
  >("professional");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Buscar profissionais disponíveis (próximos 30 dias)
  const fetchAvailableProfessionals = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const startDate = formatLocalDate(today);
      const endDate = formatLocalDate(
        new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      );

      let professionals: Psychologist[] = [];

      if (appointment.type === 1) {
        // Psicólogos
        professionals = await findPsychologists({
          startDate,
          endDate,
        });
      } else {
        // Psiquiatras
        professionals = await findPsychiatrists({
          startDate,
          endDate,
        });
      }

      // Filtrar profissionais que têm horários disponíveis
      const professionalsWithAvailableSlots = professionals.filter((prof) =>
        prof.availableTimes?.some((timeSlot) => timeSlot.times.length > 0)
      );

      setAvailableProfessionals(professionalsWithAvailableSlots);
    } catch (error) {
      console.error("Erro ao buscar profissionais:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar profissionais quando o modal abrir
  React.useEffect(() => {
    if (isOpen) {
      fetchAvailableProfessionals();
    }
  }, [isOpen]);

  // Quando um profissional é selecionado
  const handleProfessionalSelect = (professional: Psychologist) => {
    setSelectedProfessional(professional);
    setSelectedTimeSlot(null);
    setStep("calendar");
  };

  // Quando um horário é selecionado
  const handleTimeSlotSelect = (time: string, date: string) => {
    setSelectedTimeSlot({ time, date });
    setStep("confirm");
  };

  // Confirmar reagendamento
  const handleConfirmReschedule = async () => {
    if (!selectedProfessional || !selectedTimeSlot) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      await onReschedule(
        appointment.id,
        selectedProfessional.id,
        selectedTimeSlot.date,
        selectedTimeSlot.time
      );
      setStep("success");
    } catch (error) {
      console.error("Erro ao reagendar:", error);
      setErrorMessage(
        "Não foi possível reagendar a consulta. Tente novamente."
      );
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  // Reset ao fechar
  const handleClose = () => {
    setStep("professional");
    setSelectedProfessional(null);
    setSelectedTimeSlot(null);
    setAvailableProfessionals([]);
    setErrorMessage(null);
    onClose();
  };

  // Gerar calendário com horários disponíveis
  const generateCalendarData = () => {
    if (!selectedProfessional) return [];

    const calendar: Array<{
      date: string;
      dayName: string;
      dayNumber: string;
      month: string;
      times: Array<{ time: string; available: boolean }>;
    }> = [];

    const today = new Date();

    // Gerar próximos 14 dias
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = formatLocalDate(date);

      // Usar a nova função formatDateForDisplay
      const localISOString = `${dateString}T12:00:00`;
      const { dia, nomeMes, diaSemana } = formatDateForDisplay(localISOString);

      // Procurar horários disponíveis para esta data
      const availableSlot = selectedProfessional.availableTimes?.find(
        (slot) => slot.date === dateString
      );

      calendar.push({
        date: dateString,
        dayName: diaSemana,
        dayNumber: dia,
        month: nomeMes,
        times: availableSlot
          ? availableSlot.times.map((t) => ({
              time: t.time,
              available: true,
            }))
          : [],
      });
    }

    return calendar;
  };

  // Usar a nova função formatDateForDisplay para a consulta atual
  const currentAppointmentFormatted = formatDateForDisplay(appointment.date);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Reagendar Consulta
                  </h2>
                  <p className="text-gray-500 dark:text-slate-400 text-sm">
                    Escolha um profissional e selecione um novo horário
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500 dark:text-slate-400" />
                </button>
              </div>
            </div>

            {/* Current Appointment Info */}
            <div className="p-6 bg-gray-50 dark:bg-slate-900/50">
              <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Consulta Atual
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>
                    {currentAppointmentFormatted.dia} de{" "}
                    {currentAppointmentFormatted.nomeMes}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{currentAppointmentFormatted.horario}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>{appointment.doctor}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === "professional" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Selecione um profissional
                  </h3>

                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : availableProfessionals.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl inline-block mb-4">
                        <Calendar
                          size={48}
                          weight="bold"
                          className="text-gray-400 dark:text-slate-400"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Nenhum horário disponível
                      </h3>
                      <p className="text-gray-500 dark:text-slate-400">
                        Não há profissionais com horários disponíveis nos
                        próximos 30 dias.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {availableProfessionals.map((professional) => {
                        const totalAvailableSlots =
                          professional.availableTimes?.reduce(
                            (total, timeSlot) => total + timeSlot.times.length,
                            0
                          ) || 0;

                        return (
                          <motion.div
                            key={professional.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() =>
                              handleProfessionalSelect(professional)
                            }
                            className="p-6 border border-gray-200 dark:border-slate-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative flex-shrink-0">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                                  <img
                                    src={
                                      professional.avatar ||
                                      "/default-avatar.png"
                                    }
                                    alt={professional.userName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></div>
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Dr(a). {professional.userName}
                                  </h4>
                                  {appointment.type === 1 ? (
                                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg text-xs font-medium">
                                      <User size={12} className="inline mr-1" />
                                      Psicólogo
                                    </div>
                                  ) : (
                                    <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-lg text-xs font-medium">
                                      <Brain
                                        size={12}
                                        className="inline mr-1"
                                      />
                                      Psiquiatra
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400 mb-2">
                                  <div className="flex items-center gap-1">
                                    <Star
                                      size={16}
                                      weight="fill"
                                      className="text-yellow-400"
                                    />
                                    <span className="font-medium">
                                      {professional.finishedAppointments || 0}{" "}
                                      consultas realizadas
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock size={16} />
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                      {totalAvailableSlots} horários disponíveis
                                    </span>
                                  </div>
                                </div>

                                {professional.specialties &&
                                  professional.specialties.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {professional.specialties
                                        .slice(0, 3)
                                        .map((specialty, index) => (
                                          <span
                                            key={index}
                                            className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 px-2 py-1 rounded-full text-xs"
                                          >
                                            {specialty}
                                          </span>
                                        ))}
                                      {professional.specialties.length > 3 && (
                                        <span className="text-xs text-gray-500 dark:text-slate-400 px-2 py-1">
                                          +{professional.specialties.length - 3}{" "}
                                          mais
                                        </span>
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {step === "calendar" && selectedProfessional && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => setStep("professional")}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      ← Voltar
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Horários disponíveis - Dr(a).{" "}
                    {selectedProfessional.userName}
                  </h3>

                  {generateCalendarData().length === 0 ? (
                    <div className="text-center py-12">
                      <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl inline-block mb-4">
                        <Clock
                          size={48}
                          weight="bold"
                          className="text-gray-400 dark:text-slate-400"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Nenhum horário disponível
                      </h3>
                      <p className="text-gray-500 dark:text-slate-400 mb-4">
                        Este profissional não possui horários disponíveis nos
                        próximos dias.
                      </p>
                      <Button
                        variant="secondary.light"
                        onClick={() => setStep("professional")}
                        icon={<User size={16} />}
                      >
                        Escolher outro profissional
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {generateCalendarData().map((day, index) => (
                        <motion.div
                          key={day.date}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl p-4"
                        >
                          <div className="text-center mb-3">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {day.dayNumber}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-slate-400">
                              {day.month}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-slate-500">
                              {day.dayName}
                            </div>
                          </div>

                          {day.times.length === 0 ? (
                            <div className="text-center py-4">
                              <div className="p-2 bg-gray-100 dark:bg-slate-600 rounded-lg inline-block mb-2">
                                <Clock
                                  size={16}
                                  className="text-gray-400 dark:text-slate-400"
                                />
                              </div>
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                Sem horários disponíveis
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              {day.times.map((timeSlot, timeIndex) => (
                                <motion.button
                                  key={timeIndex}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    handleTimeSlotSelect(
                                      timeSlot.time,
                                      day.date
                                    )
                                  }
                                  className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium dark:border dark:border-blue-600"
                                >
                                  {timeSlot.time}
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === "confirm" &&
                selectedProfessional &&
                selectedTimeSlot && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => setStep("calendar")}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        ← Voltar
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Confirmar reagendamento
                    </h3>

                    <div className="space-y-4">
                      {/* Comparação antes/depois */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                          <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                            Horário Atual
                          </h4>
                          <div className="space-y-1 text-sm text-red-700 dark:text-red-300">
                            <div>
                              {currentAppointmentFormatted.dia} de{" "}
                              {currentAppointmentFormatted.nomeMes}
                            </div>
                            <div>{currentAppointmentFormatted.horario}</div>
                            <div>{appointment.doctor}</div>
                          </div>
                        </div>

                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                          <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                            Novo Horário
                          </h4>
                          <div className="space-y-1 text-sm text-green-700 dark:text-green-300">
                            <div>
                              {formatDate(selectedTimeSlot.date).dia} de{" "}
                              {formatDate(selectedTimeSlot.date).nomeMes}
                            </div>
                            <div>{selectedTimeSlot.time}</div>
                            <div>Dr(a). {selectedProfessional.userName}</div>
                          </div>
                        </div>
                      </div>

                      {/* Detalhes da consulta */}
                      <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Detalhes da Consulta
                        </h4>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>
                              Consulta{" "}
                              {appointment.type === 1
                                ? "Psicológica"
                                : "Psiquiátrica"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{appointment.duration} minutos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CurrencyDollar size={16} />
                            <span>
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(appointment.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {step === "success" &&
                selectedProfessional &&
                selectedTimeSlot && (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="p-6 bg-green-100 dark:bg-green-900/30 rounded-full inline-block mb-6"
                    >
                      <CheckCircle
                        size={64}
                        weight="fill"
                        className="text-green-600 dark:text-green-400"
                      />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Consulta Reagendada com Sucesso! 🎉
                    </h3>

                    <p className="text-gray-600 dark:text-slate-300 mb-6">
                      Sua consulta foi reagendada com sucesso. Você receberá um
                      email de confirmação em breve.
                    </p>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                        Novo Agendamento
                      </h4>
                      <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar size={16} />
                          <span>
                            {formatDate(selectedTimeSlot.date).dia} de{" "}
                            {formatDate(selectedTimeSlot.date).nomeMes}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Clock size={16} />
                          <span>{selectedTimeSlot.time}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <User size={16} />
                          <span>Dr(a). {selectedProfessional.userName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="primary.regular"
                        onClick={handleClose}
                        icon={<CheckCircle size={16} weight="bold" />}
                      >
                        Fechar
                      </Button>
                    </div>
                  </div>
                )}

              {step === "error" && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                    className="p-6 bg-red-100 dark:bg-red-900/30 rounded-full inline-block mb-6"
                  >
                    <X
                      size={64}
                      weight="fill"
                      className="text-red-600 dark:text-red-400"
                    />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Erro ao Reagendar
                  </h3>

                  <p className="text-gray-600 dark:text-slate-300 mb-6">
                    {errorMessage || "Ocorreu um erro ao reagendar a consulta."}
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="secondary.light"
                      onClick={() => setStep("confirm")}
                    >
                      Tentar Novamente
                    </Button>
                    <Button variant="primary.regular" onClick={handleClose}>
                      Fechar
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {step === "confirm" && (
              <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Ao confirmar, sua consulta será reagendada
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary.light"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary.regular"
                    onClick={handleConfirmReschedule}
                    isLoading={loading}
                    icon={<CheckCircle size={16} weight="bold" />}
                  >
                    Confirmar Reagendamento
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
