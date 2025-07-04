"use client";

import { Button } from "@/components";
import { formatDate } from "@/utils";
import { minuteToHour } from "@/utils/minuteToHour";
import {
  CalendarBlankIcon,
  CalendarIcon,
  CalendarPlusIcon,
  CheckCircleIcon,
  Clock,
  ClockIcon,
  CurrencyDollar,
  StarIcon,
  TrendUpIcon,
  UserIcon,
  VideoCameraIcon,
} from "@phosphor-icons/react";
import Link from "next/link";

const CONSULTAS = [
  {
    id: 1,
    date: "2025-05-05 14:00:00.000",
    doctor: "Dr. Guilherme Oliveira",
    amount: 100,
    duration: 90,
    url: "https://meet.google.com/",
    type: 1,
    status: "Agendada",
  },
  {
    id: 2,
    date: "2025-06-05 14:00:00.000",
    doctor: "Dra. Ana Costa",
    amount: 80,
    duration: 60,
    url: "https://meet.google.com/",
    type: 2,
    status: "Agendada",
  },
  {
    id: 3,
    date: "2025-07-05 14:00:00.000",
    doctor: "Dr. Carlos Silva",
    amount: 75,
    duration: 30,
    url: "https://meet.google.com/",
    type: 1,
    status: "Agendada",
  },
  {
    id: 4,
    date: "2024-04-10 10:00:00.000",
    doctor: "Dra. Sofia Martins",
    amount: 150,
    duration: 60,
    url: "https://meet.google.com/",
    type: 2,
    status: "Realizada",
  },
  {
    id: 5,
    date: "2024-03-15 11:30:00.000",
    doctor: "Dr. Guilherme Oliveira",
    amount: 100,
    duration: 90,
    url: "https://meet.google.com/",
    type: 1,
    status: "Realizada",
  },
];

export default function Consultas() {
  const upcomingAppointments = CONSULTAS.filter(
    (c) => new Date(c.date) > new Date()
  );
  const pastAppointments = CONSULTAS.filter(
    (c) => new Date(c.date) <= new Date()
  );

  const renderAppointment = (consulta: (typeof CONSULTAS)[0]) => {
    const { dia, horario, nomeMes } = formatDate(consulta.date);
    const isUpcoming = new Date(consulta.date) > new Date();

    return (
      <div
        key={consulta.id}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center gap-6">
            {/* Date Card */}
            <div className="flex-shrink-0">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                  isUpcoming
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : "bg-gradient-to-br from-gray-400 to-gray-500"
                }`}
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
                    <h3 className="text-xl font-bold text-gray-900">
                      Consulta{" "}
                      {consulta.type === 1 ? "Psicológica" : "Psiquiátrica"}
                    </h3>
                    <p className="text-gray-600 font-medium flex items-center gap-2">
                      <UserIcon size={16} weight="bold" />
                      {consulta.doctor}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        isUpcoming
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {isUpcoming ? "Agendada" : "Realizada"}
                    </span>
                    {isUpcoming && (
                      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircleIcon size={16} weight="fill" />
                        <span className="text-xs font-medium">Confirmado</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-gray-600">
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

          {/* Action Buttons */}
          {isUpcoming && (
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
                >
                  Reagendar
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Próxima:</span>{" "}
                {formatDate(consulta.date).dia} de{" "}
                {formatDate(consulta.date).nomeMes}
              </div>
            </div>
          )}

          {!isUpcoming && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="gray.light"
                  size="sm"
                  icon={<StarIcon size={16} weight="bold" />}
                  className="py-2 px-4"
                >
                  Avaliar Consulta
                </Button>
                <Button
                  variant="secondary.light"
                  size="sm"
                  icon={<CalendarPlusIcon size={16} weight="bold" />}
                  className="py-2 px-4"
                >
                  Reagendar
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Realizada em:</span>{" "}
                {formatDate(consulta.date).dia} de{" "}
                {formatDate(consulta.date).nomeMes}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white w-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Minhas Consultas 📅
              </h1>
              <p className="text-gray-500 mt-1">
                Acompanhe suas consultas agendadas e histórico
              </p>
            </div>
            <Button
              variant="primary.regular"
              icon={<CalendarPlusIcon size={20} weight="bold" />}
              className="py-3 px-6"
            >
              <Link href="/nova-consulta">Agendar Nova Consulta</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 w-full">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Consultas</p>
                <p className="text-3xl font-bold text-gray-900">
                  {CONSULTAS.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <CalendarIcon
                  size={24}
                  weight="bold"
                  className="text-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Próximas</p>
                <p className="text-3xl font-bold text-gray-900">
                  {upcomingAppointments.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CalendarBlankIcon
                  size={24}
                  weight="bold"
                  className="text-green-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Realizadas</p>
                <p className="text-3xl font-bold text-gray-900">
                  {pastAppointments.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <CheckCircleIcon
                  size={24}
                  weight="bold"
                  className="text-purple-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Horas de Terapia</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.floor(
                    CONSULTAS.reduce((acc, c) => acc + c.duration, 0) / 60
                  )}
                  h
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <ClockIcon
                  size={24}
                  weight="bold"
                  className="text-orange-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Upcoming Appointments */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Próximas Consultas
              </h2>
              {upcomingAppointments.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  <TrendUpIcon size={16} weight="bold" />
                  {upcomingAppointments.length} agendada
                  {upcomingAppointments.length > 1 ? "s" : ""}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((consulta) =>
                  renderAppointment(consulta)
                )
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
                    <CalendarBlankIcon
                      size={48}
                      weight="bold"
                      className="text-gray-400"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma consulta agendada
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Que tal agendar uma nova consulta para cuidar da sua saúde
                    mental?
                  </p>
                  <Button
                    variant="primary.regular"
                    icon={<CalendarPlusIcon size={20} weight="bold" />}
                  >
                    <Link href="/nova-consulta">Agendar Consulta</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Past Appointments */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Consultas Anteriores
              </h2>
              {pastAppointments.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  <CheckCircleIcon size={16} weight="bold" />
                  {pastAppointments.length} realizada
                  {pastAppointments.length > 1 ? "s" : ""}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {pastAppointments.length > 0 ? (
                pastAppointments.map((consulta) => renderAppointment(consulta))
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
                    <ClockIcon
                      size={48}
                      weight="bold"
                      className="text-gray-400"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma consulta anterior
                  </h3>
                  <p className="text-gray-500">
                    Suas consultas realizadas aparecerão aqui
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
