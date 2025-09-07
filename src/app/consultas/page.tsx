"use client";

import { Button, RescheduleModal } from "@/components";
import { PageErrorBoundary } from "@/components/ErrorBoundary";
import { useAppointmentOperations } from "@/hooks/mutations/useAppointmentMutations";
import { useAppointments } from "@/hooks/queries/useAppointments";
import { formatDateForDisplay } from "@/utils";
import { minuteToHour } from "@/utils/minuteToHour";
import {
  CalendarBlankIcon,
  CalendarIcon,
  CalendarPlusIcon,
  CheckCircleIcon,
  Clock,
  ClockIcon,
  CopyIcon,
  CreditCardIcon,
  CurrencyDollar,
  QrCodeIcon,
  TrashIcon,
  TrendUpIcon,
  UserIcon,
  VideoCameraIcon,
  WarningIcon,
  XIcon,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// Tipo para os dados do PIX (agora vem do hook)
// interface PixData removida - dados vêm diretamente do useAppointmentOperations

export default function Consultas() {
  // React Query hooks - muito mais simples!
  const {
    appointments,
    upcomingAppointments,
    pastAppointments,
    loading,
    error,
    refetch,
    isRefetching,
  } = useAppointments();

  const {
    rescheduleAppointment,
    cancelAppointment: cancelAppointmentMutation,
    isRescheduling,
    isCancelling,
    isLoadingPix,
    pixData,
    isLoading: isOperationLoading,
  } = useAppointmentOperations();

  // Token não é mais necessário - hooks React Query gerenciam automaticamente

  // Estados para o modal de reagendamento
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<
    (typeof appointments)[0] | null
  >(null);

  // Estados para o modal de cancelamento (simplificados)
  const [appointmentToCancel, setAppointmentToCancel] = useState<
    (typeof appointments)[0] | null
  >(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  // Estados para o modal do PIX (simplificados)
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [pixError, setPixError] = useState<string | null>(null);

  // Função para abrir o modal de reagendamento
  const handleRescheduleClick = (consulta: (typeof appointments)[0]) => {
    setAppointmentToReschedule(consulta);
    setIsRescheduleModalOpen(true);
  };

  // Função para fechar o modal de reagendamento
  const handleCloseRescheduleModal = () => {
    setIsRescheduleModalOpen(false);
    setAppointmentToReschedule(null);
  };

  // Função para abrir modal PIX e buscar dados (simplificada com React Query)
  const handlePixPaymentClick = async (asaasPaymentId: string) => {
    setPixError(null);
    setIsPixModalOpen(true);

    try {
      // TODO: Implementar fetchPixData quando o serviço estiver disponível
      console.log("PIX Payment ID:", asaasPaymentId);
      setPixError("Funcionalidade PIX em desenvolvimento.");
      setIsPixModalOpen(false);
    } catch {
      setPixError("Erro ao carregar dados do PIX. Tente novamente.");
      setIsPixModalOpen(false);
    }
  };

  // Função para fechar o modal PIX
  const handleClosePixModal = () => {
    setIsPixModalOpen(false);
    setPixError(null);
  };

  // Função para copiar PIX copia e cola
  const handleCopyPixPayload = async () => {
    // TODO: Implementar quando pixData estiver disponível
    console.log("Funcionalidade de copiar PIX em desenvolvimento");
  };

  // Função para reagendar (simplificada com React Query)
  const handleReschedule = async (
    appointmentId: string,
    professionalId: string,
    date: string,
    time: string
  ) => {
    try {
      await rescheduleAppointment({
        appointmentId,
        newDate: date,
        newTime: time,
      });
      // Cache é invalidado automaticamente pelo hook!
    } catch (err) {
      // Error handling é feito automaticamente pelo hook!
      throw err; // Re-throw para o modal capturar
    }
  };

  // Função para abrir modal de cancelamento
  const handleCancelClick = (consulta: (typeof appointments)[0]) => {
    setAppointmentToCancel(consulta);
    setCancelError(null);
    setCancelSuccess(null);
  };

  // Função para fechar modal de cancelamento
  const handleCloseCancelModal = () => {
    setAppointmentToCancel(null);
    setCancelError(null);
    setCancelSuccess(null);
  };

  // Função para cancelar consulta (simplificada com React Query)
  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) {
      setCancelError("Dados inválidos para cancelamento");
      return;
    }

    setCancelError(null);

    try {
      await cancelAppointmentMutation({
        appointmentId: appointmentToCancel.id,
      });
      setCancelSuccess("Consulta cancelada com sucesso!");
      // Cache é invalidado automaticamente + optimistic update!

      // Fechar modal após 2 segundos
      setTimeout(() => {
        handleCloseCancelModal();
      }, 2000);
    } catch {
      setCancelError("Erro ao cancelar consulta. Tente novamente.");
    }
  };

  // Animation variants - Otimizadas para melhor performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const renderAppointment = (consulta: (typeof appointments)[0]) => {
    const { dia, horario, nomeMes } = formatDateForDisplay(consulta.date);
    const isUpcoming = new Date(consulta.date) > new Date();

    // Função para determinar estilo do status de pagamento
    const getPaymentStatusStyle = (paymentStatus: string) => {
      switch (paymentStatus) {
        case "Pago":
          return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
        case "Aguardando pagamento":
          return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
        case "Vencido":
          return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
        case "Cancelado":
          return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400";
        case "Estornado":
          return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
        case "Chargeback":
        case "Contestação":
        case "Aguardando reversão":
          return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
        default:
          return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400";
      }
    };

    // Função para determinar o ícone do status de pagamento
    const getPaymentStatusIcon = (paymentStatus: string) => {
      switch (paymentStatus) {
        case "Pago":
          return <CheckCircleIcon size={14} weight="fill" />;
        case "Aguardando pagamento":
          return <ClockIcon size={14} weight="bold" />;
        case "Vencido":
          return <CurrencyDollar size={14} weight="bold" />;
        default:
          return <CreditCardIcon size={14} weight="bold" />;
      }
    };

    // Função para determinar o estilo do status da consulta
    const getConsultationStatusStyle = (status: string) => {
      switch (status) {
        case "Agendada":
          return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
        case "Confirmada":
          return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
        case "Realizada":
          return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
        case "Cancelada":
          return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
        case "Reagendada":
          return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
        default:
          return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400";
      }
    };

    // Função para determinar o ícone do status da consulta
    const getConsultationStatusIcon = (status: string) => {
      switch (status) {
        case "Agendada":
          return <CalendarIcon size={14} weight="bold" />;
        case "Confirmada":
          return <CheckCircleIcon size={14} weight="fill" />;
        case "Realizada":
          return <CheckCircleIcon size={14} weight="fill" />;
        case "Cancelada":
          return <XIcon size={14} weight="bold" />;
        case "Reagendada":
          return <CalendarIcon size={14} weight="bold" />;
        default:
          return <ClockIcon size={14} weight="bold" />;
      }
    };

    return (
      <motion.div
        key={consulta.id}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20px" }}
        whileHover={{
          scale: isUpcoming ? 1.01 : 1.005,
          transition: { duration: 0.1 },
        }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all duration-200 overflow-hidden"
        style={{ willChange: "transform" }}
      >
        <div className="p-6">
          <div className="flex items-center gap-6">
            {/* Date Card */}
            <div className="flex-shrink-0">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-150 ${
                  isUpcoming ? "hover:scale-105" : "hover:scale-102"
                } ${
                  isUpcoming
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : "bg-gradient-to-br from-gray-400 to-gray-500 dark:from-slate-500 dark:to-slate-600"
                }`}
                style={{ willChange: "transform" }}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{dia}</div>
                  <div className="text-xs text-blue-100 font-medium">
                    {nomeMes.slice(0, 3).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="flex-1">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Consulta{" "}
                      {consulta.type === 1 ? "Psicológica" : "Psiquiátrica"}
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 font-medium flex items-center gap-2">
                      <UserIcon size={16} weight="bold" />
                      {consulta.doctor}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Status de Pagamento */}
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${getPaymentStatusStyle(
                        consulta.paymentStatus
                      )}`}
                    >
                      {getPaymentStatusIcon(consulta.paymentStatus)}
                      {consulta.paymentStatus}
                    </span>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getConsultationStatusStyle(
                        consulta.status
                      )}`}
                    >
                      {getConsultationStatusIcon(consulta.status)}
                      {consulta.status}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-gray-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <ClockIcon size={16} weight="bold" />
                    <span className="text-sm font-medium">{horario}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} weight="bold" />
                    <span className="text-sm font-medium">
                      {minuteToHour(consulta.duration)}h
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CurrencyDollar size={16} weight="bold" />
                    <span className="text-sm font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(consulta.amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Só mostra se for futura E não cancelada */}
          {isUpcoming && consulta.status !== "Cancelada" && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="primary.regular"
                  size="sm"
                  icon={<VideoCameraIcon size={16} weight="bold" />}
                  className="py-2 px-4"
                >
                  <Link href={consulta.url} target="_blank">
                    Acessar Consulta
                  </Link>
                </Button>
                <Button
                  variant="secondary.light"
                  size="sm"
                  icon={<CalendarIcon size={16} weight="bold" />}
                  className="py-2 px-4"
                  onClick={() => handleRescheduleClick(consulta)}
                  disabled={isRescheduling || loading}
                >
                  {isRescheduling ? "Reagendando..." : "Reagendar"}
                </Button>

                {/* Botão PIX para pagamentos pendentes - Não mostra se cancelada ou passada */}
                {consulta.paymentStatus === "Aguardando pagamento" &&
                  consulta.billingType === "PIX" &&
                  consulta.asaasPaymentId &&
                  consulta.status !== "Cancelada" &&
                  isUpcoming && (
                    <Button
                      variant="secondary.regular"
                      size="sm"
                      icon={<QrCodeIcon size={16} weight="bold" />}
                      className="py-2 px-4"
                      onClick={() =>
                        handlePixPaymentClick(consulta.asaasPaymentId!)
                      }
                      disabled={isLoadingPix || loading}
                    >
                      {isLoadingPix ? "Carregando PIX..." : "Pagar com PIX"}
                    </Button>
                  )}

                {/* Botão Cancelar Consulta - Só mostra se não estiver cancelada */}
                {consulta.status !== "Cancelada" && (
                  <Button
                    variant="secondary.light"
                    size="sm"
                    icon={<TrashIcon size={16} weight="bold" />}
                    className="py-2 px-4 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                    onClick={() => handleCancelClick(consulta)}
                    disabled={isCancelling || loading}
                  >
                    {isCancelling ? "Cancelando..." : "Cancelar"}
                  </Button>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-slate-400">
                <span className="font-medium">Próxima:</span>{" "}
                {formatDateForDisplay(consulta.date).dia} de{" "}
                {formatDateForDisplay(consulta.date).nomeMes}
              </div>
            </div>
          )}

          {/* Consultas Canceladas (futuras) - Só mostra informação */}
          {isUpcoming && consulta.status === "Cancelada" && (
            <div className="mt-6 flex items-center justify-end">
              <div className="text-sm text-gray-500 dark:text-slate-400">
                <span className="font-medium">Cancelada em:</span>{" "}
                {formatDateForDisplay(consulta.date).dia} de{" "}
                {formatDateForDisplay(consulta.date).nomeMes}
              </div>
            </div>
          )}

          {!isUpcoming && (
            <div className="mt-6 flex items-center justify-end">
              <div className="text-sm text-gray-500 dark:text-slate-400">
                <span className="font-medium">
                  {consulta.status === "Cancelada"
                    ? "Cancelada em:"
                    : "Realizada em:"}{" "}
                </span>
                {formatDateForDisplay(consulta.date).dia} de{" "}
                {formatDateForDisplay(consulta.date).nomeMes}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Loading inicial
  if (loading && appointments.length === 0) {
    return (
      <PageErrorBoundary pageTitle="Consultas">
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 w-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Carregando suas consultas...
            </h2>
            <p className="text-gray-500 dark:text-slate-400">
              Aguarde enquanto buscamos seus agendamentos
            </p>
          </div>
        </div>
      </PageErrorBoundary>
    );
  }

  // Error state
  if (error) {
    return (
      <PageErrorBoundary pageTitle="Consultas">
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 w-full flex items-center justify-center">
          <div className="text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full inline-block mb-4">
              <WarningIcon
                size={48}
                className="text-red-600 dark:text-red-400"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Erro ao carregar consultas
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mb-4">{error}</p>
            <Button
              variant="primary.regular"
              onClick={() => refetch()}
              disabled={loading}
            >
              {loading ? "Tentando novamente..." : "Tentar Novamente"}
            </Button>
          </div>
        </div>
      </PageErrorBoundary>
    );
  }

  return (
    <PageErrorBoundary pageTitle="Consultas">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 w-full"
      >
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700 sticky top-0 z-10"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Minhas Consultas 📅
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">
                  Acompanhe suas consultas agendadas e histórico
                </p>
              </div>
              <div>
                <Button
                  variant="primary.regular"
                  icon={<CalendarPlusIcon size={20} weight="bold" />}
                  className="py-3 px-6"
                  disabled={loading || isOperationLoading}
                >
                  <Link href="/nova-consulta">
                    {loading || isOperationLoading
                      ? "Carregando..."
                      : "Agendar Nova Consulta"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="p-6 w-full">
          {/* Indicador de background refetch */}
          {isRefetching && !loading && (
            <div className="fixed top-20 right-6 z-50">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Atualizando consultas...</span>
              </div>
            </div>
          )}
          {/* Quick Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div
              variants={statsVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.15 },
              }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700"
              style={{ willChange: "transform" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                    Total de Consultas
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {appointments.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <CalendarIcon
                    size={24}
                    weight="bold"
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={statsVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.15 },
              }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700"
              style={{ willChange: "transform" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                    Próximas
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {upcomingAppointments.length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <CalendarBlankIcon
                    size={24}
                    weight="bold"
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={statsVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.15 },
              }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700"
              style={{ willChange: "transform" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                    Realizadas
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {pastAppointments.length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <CheckCircleIcon
                    size={24}
                    weight="bold"
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={statsVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.15 },
              }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700"
              style={{ willChange: "transform" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                    Horas de Terapia
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {Math.floor(
                      appointments.reduce(
                        (acc: number, c: { duration: number }) =>
                          acc + c.duration,
                        0
                      ) / 60
                    )}
                    h
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                  <ClockIcon
                    size={24}
                    weight="bold"
                    className="text-orange-600 dark:text-orange-400"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Próximas Consultas
                </h2>
                {upcomingAppointments.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                    <TrendUpIcon size={16} weight="bold" />
                    {upcomingAppointments.length} agendada
                    {upcomingAppointments.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map(
                    (consulta: (typeof appointments)[0]) =>
                      renderAppointment(consulta)
                  )
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-12 text-center"
                  >
                    <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl inline-block mb-4">
                      <CalendarBlankIcon
                        size={48}
                        weight="bold"
                        className="text-gray-400 dark:text-slate-400"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Nenhuma consulta agendada
                    </h3>
                    <p className="text-gray-500 dark:text-slate-400 mb-6">
                      Que tal agendar uma nova consulta para cuidar da sua saúde
                      mental?
                    </p>
                    <div>
                      <Button
                        variant="primary.regular"
                        icon={<CalendarPlusIcon size={20} weight="bold" />}
                      >
                        <Link href="/nova-consulta">Agendar Consulta</Link>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Past Appointments */}
            <div className="opacity-0 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Consultas Anteriores
                </h2>
                {pastAppointments.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-700 px-3 py-1 rounded-full">
                    <CheckCircleIcon size={16} weight="bold" />
                    {pastAppointments.length} realizada
                    {pastAppointments.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {pastAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {pastAppointments.map(
                      (consulta: (typeof appointments)[0]) =>
                        renderAppointment(consulta)
                    )}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-12 text-center">
                    <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl inline-block mb-4">
                      <ClockIcon
                        size={48}
                        weight="bold"
                        className="text-gray-400 dark:text-slate-400"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Nenhuma consulta anterior
                    </h3>
                    <p className="text-gray-500 dark:text-slate-400">
                      Suas consultas realizadas aparecerão aqui
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal de Reagendamento */}
      {appointmentToReschedule && (
        <RescheduleModal
          isOpen={isRescheduleModalOpen}
          onClose={handleCloseRescheduleModal}
          appointment={appointmentToReschedule}
          onReschedule={handleReschedule}
        />
      )}

      {/* Modal de Cancelamento */}
      {appointmentToCancel && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handleCloseCancelModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <WarningIcon size={24} weight="bold" />
                    Cancelar Consulta
                  </h2>
                  <button
                    onClick={handleCloseCancelModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <XIcon
                      size={20}
                      weight="bold"
                      className="text-gray-500 dark:text-slate-400"
                    />
                  </button>
                </div>

                {/* Error State */}
                {cancelError && (
                  <div className="text-center py-8">
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl mb-4">
                      <p className="text-red-700 dark:text-red-400 font-medium">
                        {cancelError}
                      </p>
                    </div>
                    <Button
                      variant="primary.regular"
                      onClick={handleCloseCancelModal}
                    >
                      Fechar
                    </Button>
                  </div>
                )}

                {/* Success State */}
                {cancelSuccess && (
                  <div className="text-center py-8">
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl mb-4">
                      <p className="text-green-700 dark:text-green-400 font-medium">
                        {cancelSuccess}
                      </p>
                    </div>
                    <Button
                      variant="primary.regular"
                      onClick={handleCloseCancelModal}
                    >
                      Fechar
                    </Button>
                  </div>
                )}

                {/* Confirmation */}
                {!cancelError && !cancelSuccess && (
                  <div className="space-y-6">
                    <p className="text-gray-700 dark:text-slate-300">
                      Tem certeza que deseja cancelar a consulta com{" "}
                      {appointmentToCancel.doctor} em{" "}
                      {formatDateForDisplay(appointmentToCancel.date).dia} de{" "}
                      {formatDateForDisplay(appointmentToCancel.date).nomeMes}?
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="secondary.regular"
                        onClick={handleCancelAppointment}
                        disabled={isCancelling}
                        className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                      >
                        {isCancelling
                          ? "Cancelando..."
                          : "Confirmar Cancelamento"}
                      </Button>
                      <Button
                        variant="primary.regular"
                        onClick={handleCloseCancelModal}
                      >
                        Manter Consulta
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Modal do PIX */}
      {isPixModalOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handleClosePixModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <QrCodeIcon size={24} weight="bold" />
                    Pagamento PIX
                  </h2>
                  <button
                    onClick={handleClosePixModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <XIcon
                      size={20}
                      weight="bold"
                      className="text-gray-500 dark:text-slate-400"
                    />
                  </button>
                </div>

                {/* Loading State */}
                {isLoadingPix && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 dark:text-slate-400">
                      Carregando dados do PIX...
                    </p>
                  </div>
                )}

                {/* Error State */}
                {pixError && (
                  <div className="text-center py-8">
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl mb-4">
                      <p className="text-red-700 dark:text-red-400 font-medium">
                        {pixError}
                      </p>
                    </div>
                    <Button
                      variant="primary.regular"
                      onClick={handleClosePixModal}
                    >
                      Fechar
                    </Button>
                  </div>
                )}

                {/* Success State */}
                {pixData && (
                  <div className="space-y-6">
                    {/* QR Code */}
                    <div className="text-center">
                      <div className="bg-white p-4 rounded-xl inline-block shadow-sm border">
                        <div className="w-48 h-48 bg-gray-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                          <QrCodeIcon size={64} className="text-gray-400" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                        QR Code será exibido aqui quando disponível
                      </p>
                    </div>

                    {/* Copy and Paste */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Código PIX:
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm font-mono text-gray-700 dark:text-slate-300 break-all">
                          Código PIX será exibido aqui quando disponível
                        </div>
                        <Button
                          variant="secondary.regular"
                          size="sm"
                          icon={<CopyIcon size={16} weight="bold" />}
                          onClick={handleCopyPixPayload}
                          className="px-3"
                          disabled
                        >
                          Copiar
                        </Button>
                      </div>
                    </div>

                    {/* Development Notice */}
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        <strong>Em desenvolvimento:</strong> A funcionalidade
                        PIX está sendo implementada.
                      </p>
                    </div>

                    {/* Instructions */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        <strong>Como pagar:</strong>
                        <br />
                        1. Abra seu app do banco
                        <br />
                        2. Vá em PIX → Pagar → Código QR
                        <br />
                        3. Escaneie o código ou cole o código PIX
                        <br />
                        4. Confirme o pagamento
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="primary.regular"
                        onClick={handleClosePixModal}
                        className="flex-1"
                      >
                        Entendi
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </PageErrorBoundary>
  );
}
