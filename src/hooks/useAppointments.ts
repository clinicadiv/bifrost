import {
  AppointmentResponse,
  getPatientAppointments,
} from "@/services/http/appointments";
import { createLocalDate } from "@/utils";
import { useEffect, useState } from "react";
import { useAuthStore } from "./useAuthStore";

interface ConsultaFormatted {
  id: string;
  date: string;
  doctor: string;
  amount: number;
  duration: number;
  url: string;
  type: number;
  status: string;
  notes?: string;
  paid: boolean;
  paymentStatus: string; // Status detalhado do pagamento
  asaasPaymentId?: string; // ID do pagamento no Asaas
  billingType?: string; // Tipo de cobrança (PIX, CREDIT_CARD, etc.)
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<ConsultaFormatted[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuthStore();

  const formatAppointmentData = (
    appointment: AppointmentResponse
  ): ConsultaFormatted => {
    const dateTime = `${appointment.appointmentDate}T${appointment.appointmentTime}`;

    const statusMap: { [key: string]: string } = {
      scheduled: "Agendada",
      confirmed: "Confirmada",
      completed: "Realizada",
      cancelled: "Cancelada",
      CANCELLED: "Cancelada", // Adicionando em maiúsculo também
      rescheduled: "Reagendada",
      pending: "Pendente",
    };

    const paymentStatusMap: { [key: string]: string } = {
      NOT_CREATED: "Não criado",
      PENDING: "Aguardando pagamento",
      PAID: "Pago",
      OVERDUE: "Vencido",
      CANCELLED: "Cancelado",
      REFUNDED: "Estornado",
      CHARGEBACK: "Chargeback",
      CHARGEBACK_DISPUTE: "Contestação",
      CHARGEBACK_REVERSAL: "Aguardando reversão",
    };

    const getAppointmentType = (serviceId?: string): number => {
      if (serviceId) {
        return serviceId.includes("psych") ? 2 : 1; // 2 para psiquiatra, 1 para psicólogo
      }
      return 1;
    };

    // Debug log para verificar o status original
    console.log(
      `🔍 Status original da consulta ${appointment.id}:`,
      appointment.status
    );
    console.log(
      `🔍 Status mapeado:`,
      statusMap[appointment.status] || appointment.status
    );

    return {
      id: appointment.id,
      date: dateTime,
      doctor: `Dr. ${appointment.medical.userName}` || "Profissional",
      amount: appointment.amount || 0,
      duration: 60,
      url: appointment.urlMeet || appointment.medical.meetLink || "",
      type: getAppointmentType(appointment.serviceId),
      status: statusMap[appointment.status] || appointment.status,
      notes: appointment.notes || appointment.medical.notes,
      paid: appointment.payment || false,
      paymentStatus:
        paymentStatusMap[appointment.paymentStatus] ||
        appointment.paymentStatus,
      asaasPaymentId: appointment.asaasPaymentId,
      billingType: appointment.billingType,
    };
  };

  const fetchAppointments = async () => {
    if (!user?.id || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getPatientAppointments(user.id, token);

      if (response.success && Array.isArray(response.data)) {
        const formattedAppointments = response.data.map(formatAppointmentData);
        formattedAppointments.sort(
          (a, b) =>
            createLocalDate(b.date).getTime() -
            createLocalDate(a.date).getTime()
        );
        setAppointments(formattedAppointments);
      } else {
        setError("Não foi possível carregar as consultas");
      }
    } catch (err: unknown) {
      console.error("Erro ao buscar consultas:", err);

      // Tratamento de diferentes tipos de erro
      if (err && typeof err === "object" && "response" in err) {
        const error = err as { response?: { status: number } };
        const status = error.response?.status;
        if (status === 401) {
          setError("Sessão expirada. Faça login novamente.");
        } else if (status === 403) {
          setError("Você não tem permissão para acessar essas consultas.");
        } else if (status === 404) {
          setError("Nenhuma consulta encontrada.");
        } else if (status && status >= 500) {
          setError("Erro interno do servidor. Tente novamente mais tarde.");
        } else {
          setError("Erro ao carregar consultas. Tente novamente.");
        }
      } else if (err && typeof err === "object" && "code" in err) {
        const error = err as { code: string };
        if (error.code === "NETWORK_ERROR") {
          setError("Erro de conexão. Verifique sua internet.");
        } else {
          setError("Erro ao carregar consultas. Tente novamente.");
        }
      } else {
        setError("Erro ao carregar consultas. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user?.id, token]);

  // Função auxiliar para verificar se a consulta está cancelada
  const isCancelled = (status: string) => {
    return (
      status.toLowerCase().includes("cancel") ||
      status === "CANCELLED" ||
      status === "cancelled"
    );
  };

  const upcomingAppointments = appointments.filter((appointment) => {
    const isFuture = createLocalDate(appointment.date) > new Date();
    const isNotCancelled = !isCancelled(appointment.status);

    console.log(`🔍 Consulta ${appointment.id}:`, {
      date: appointment.date,
      status: appointment.status,
      isFuture,
      isNotCancelled,
      willShowInUpcoming: isFuture && isNotCancelled,
    });

    return isFuture && isNotCancelled;
  });

  const pastAppointments = appointments.filter(
    (appointment) =>
      createLocalDate(appointment.date) <= new Date() ||
      isCancelled(appointment.status)
  );

  return {
    appointments,
    upcomingAppointments,
    pastAppointments,
    loading,
    error,
    refetch: fetchAppointments,
  };
}
