"use client";

import { Button } from "@/components";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  CalendarIcon,
  CalendarPlusIcon,
  CheckCircleIcon,
  ClockIcon,
  CrownIcon,
  FireIcon,
  GitlabLogoSimpleIcon,
  HeartIcon,
  LightningIcon,
  SpotifyLogoIcon,
  StarIcon,
  SteamLogoIcon,
  TrendUpIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import "swiper/css";

const CONVENIOS = [
  { id: 1, title: "PsicoCare", img: "/psicocare.png", accessMethod: "CPF" },
  { id: 2, title: "GM Pharm", img: "/logo.png", accessMethod: "Código" },
  {
    id: 3,
    title: "Comunidade Divergente",
    img: "/psicocare.png",
    accessMethod: "CPF",
  },
  { id: 4, title: "Sinpro - Osasco", img: "/logo.png", accessMethod: "Código" },
  { id: 5, title: "Sintricom", img: "/psicocare.png", accessMethod: "CPF" },
  { id: 6, title: "PsicoCare", img: "/logo.png", accessMethod: "Código" },
  { id: 7, title: "GM Pharm", img: "/psicocare.png", accessMethod: "CPF" },
];

const STATS = [
  { label: "Total de Consultas", value: "11", icon: HeartIcon, color: "blue" },
  {
    label: "Próximas Consultas",
    value: "3",
    icon: CalendarIcon,
    color: "green",
  },
  { label: "Selos Acumulados", value: "10", icon: StarIcon, color: "purple" },
  { label: "Dias Consecutivos", value: "12", icon: FireIcon, color: "orange" },
  { label: "Avaliação Média", value: "4.8", icon: StarIcon, color: "yellow" },
  { label: "Horas de Terapia", value: "23", icon: ClockIcon, color: "indigo" },
];

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Olá, {user?.name.split(" ")[0]}! 👋
              </h1>
              <p className="text-gray-500 mt-1">
                Que bom ter você de volta. Vamos cuidar da sua saúde mental
                hoje?
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 w-full">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
          {STATS.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${
                    stat.color === "blue"
                      ? "bg-blue-100"
                      : stat.color === "green"
                      ? "bg-green-100"
                      : stat.color === "purple"
                      ? "bg-purple-100"
                      : stat.color === "orange"
                      ? "bg-orange-100"
                      : stat.color === "yellow"
                      ? "bg-yellow-100"
                      : "bg-indigo-100"
                  }`}
                >
                  <stat.icon
                    size={24}
                    weight="bold"
                    className={
                      stat.color === "blue"
                        ? "text-blue-600"
                        : stat.color === "green"
                        ? "text-green-600"
                        : stat.color === "purple"
                        ? "text-purple-600"
                        : stat.color === "orange"
                        ? "text-orange-600"
                        : stat.color === "yellow"
                        ? "text-yellow-600"
                        : "text-indigo-600"
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Health Score */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Índice de Saúde Mental
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <TrendUpIcon size={16} weight="bold" />
                    Melhorando
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Score Circle */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-40 h-40 mb-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-1">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900 mb-1">
                              12
                            </div>
                            <div className="text-base text-gray-600">
                              Moderado
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <TrendUpIcon
                          size={18}
                          weight="bold"
                          className="text-white"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Última avaliação em 24/03/2025
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Depressão
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900">
                            5
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Leve
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "20%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Ansiedade
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900">
                            12
                          </span>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                            Moderado
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: "50%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Estresse
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900">
                            21
                          </span>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            Severo
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Appointment */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="p-6 bg-white border-b border-blue-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Próxima Consulta
                </h2>
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  <CheckCircleIcon size={16} weight="fill" />
                  <span className="text-sm font-medium">Confirmado</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-6">
                  {/* Date Card */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">08</div>
                        <div className="text-xs text-blue-100 font-medium">
                          MAI
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="flex-1">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Consulta Psicológica
                        </h3>
                        <p className="text-gray-600 font-medium">
                          Dr. Guilherme Oliveira
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-500">
                          <ClockIcon size={18} weight="bold" />
                          <span className="text-sm font-semibold">
                            19:00 - 20:00
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                          <CalendarIcon size={18} weight="bold" />
                          <span className="text-sm font-semibold">
                            08 Mai 2025
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Button
                  variant="primary.regular"
                  className="w-full py-3 text-base font-semibold"
                  icon={<CalendarPlusIcon size={20} weight="bold" />}
                >
                  Nova Consulta
                </Button>
                <Button
                  variant="secondary.dark"
                  className="w-full py-3 text-base font-semibold"
                  icon={<CalendarIcon size={20} weight="bold" />}
                >
                  Reagendar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Psico+ Program */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl text-white overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Psico+ Rewards</h2>
                  <p className="text-purple-100">
                    Acumule selos e troque por recompensas
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl">
                  <CrownIcon
                    size={32}
                    weight="bold"
                    className="text-yellow-300"
                  />
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Progresso</span>
                  <span className="text-2xl font-bold">10/100</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-3 rounded-full"
                    style={{ width: "10%" }}
                  ></div>
                </div>
                <p className="text-sm text-purple-100 mt-2">
                  Faltam 90 selos para o próximo nível
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <GitlabLogoSimpleIcon
                    size={24}
                    weight="duotone"
                    className="text-white mx-auto mb-2"
                  />
                  <p className="text-xs">GitLab</p>
                  <p className="text-xs opacity-75">30 selos</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <SpotifyLogoIcon
                    size={24}
                    weight="duotone"
                    className="text-white mx-auto mb-2"
                  />
                  <p className="text-xs">Spotify</p>
                  <p className="text-xs opacity-75">50 selos</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <SteamLogoIcon
                    size={24}
                    weight="duotone"
                    className="text-white mx-auto mb-2"
                  />
                  <p className="text-xs">Steam</p>
                  <p className="text-xs opacity-75">75 selos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Convenios */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                Seus Convênios
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CONVENIOS.slice(0, 4).map((convenio) => (
                  <div
                    key={convenio.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Image
                          src={convenio.img}
                          alt={convenio.title}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {convenio.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {convenio.accessMethod}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="primary.regular"
                      className="w-full mt-3 text-sm"
                    >
                      Agendar Consulta
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Ver todos os convênios →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Banner */}
        <div className="mt-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500 rounded-2xl">
                <FireIcon size={32} weight="bold" className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-900">
                  Parabéns! Você está em uma sequência de 12 dias! 🔥
                </h3>
                <p className="text-amber-700">
                  Continue assim e desbloqueie recompensas especiais
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <LightningIcon
                size={24}
                weight="bold"
                className="text-amber-600"
              />
              <span className="text-2xl font-bold text-amber-900">
                +5 selos
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
