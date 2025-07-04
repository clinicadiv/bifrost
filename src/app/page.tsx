"use client";

import { Button } from "@/components";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  CalendarIcon,
  CalendarPlusIcon,
  ChartLineUpIcon,
  CheckCircleIcon,
  ClockIcon,
  GiftIcon,
  GitlabLogoSimpleIcon,
  HeartIcon,
  SpotifyLogoIcon,
  StarIcon,
  SteamLogoIcon,
  TrendUpIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="w-full space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="font-satoshi text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bem-vindo de volta, {user?.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Aqui está um resumo da sua jornada de bem-estar mental
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Mental Health Index - Takes 2 columns */}
          <div className="lg:col-span-2 xl:col-span-3 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendUpIcon size={24} weight="bold" className="text-white" />
                </div>
                <h2 className="font-satoshi text-2xl font-bold text-white">
                  Índice de Saúde Mental
                </h2>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Score Circle */}
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl">
                      <div className="text-center">
                        <p className="font-satoshi font-bold text-5xl text-white">
                          12
                        </p>
                        <p className="text-white text-sm opacity-90">pontos</p>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendUpIcon
                        size={16}
                        weight="bold"
                        className="text-white"
                      />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <p className="font-satoshi text-2xl font-bold text-gray-800">
                      Moderado
                    </p>
                    <p className="text-gray-500 text-sm">
                      Última avaliação: 24/03/2025
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-satoshi font-semibold text-gray-700">
                        Depressão
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xl text-gray-800">
                          5
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Leve
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full w-2/12 shadow-sm"></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-satoshi font-semibold text-gray-700">
                        Ansiedade
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xl text-gray-800">
                          12
                        </span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                          Moderado
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full w-6/12 shadow-sm"></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-satoshi font-semibold text-gray-700">
                        Estresse
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xl text-gray-800">
                          21
                        </span>
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          Severo
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-red-400 to-red-500 h-3 rounded-full w-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Appointment */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <CalendarIcon
                    size={24}
                    weight="bold"
                    className="text-white"
                  />
                </div>
                <h2 className="font-satoshi text-xl font-bold text-white">
                  Próxima Consulta
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-2 w-fit mx-auto">
                <CheckCircleIcon
                  size={16}
                  weight="fill"
                  className="text-green-500"
                />
                <span className="text-green-700 font-medium text-sm">
                  Confirmado
                </span>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                  <div className="text-center">
                    <p className="font-bold text-2xl">08</p>
                    <p className="text-xs uppercase">Mai</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-satoshi text-lg font-bold text-gray-800">
                    Consulta Psicológica
                  </h3>
                  <p className="text-gray-600">
                    <span className="font-semibold">
                      Dr. Guilherme Oliveira
                    </span>
                  </p>
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <ClockIcon size={16} />
                    <span className="text-sm">19:00 - 20:00</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="secondary.dark" className="w-full">
                  <CalendarIcon size={18} weight="bold" />
                  Reagendar
                </Button>
                <Button variant="primary.regular" className="w-full">
                  <CalendarPlusIcon size={18} weight="bold" />
                  Nova Consulta
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Consultation Summary */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <ChartLineUpIcon
                    size={24}
                    weight="bold"
                    className="text-white"
                  />
                </div>
                <h2 className="font-satoshi text-xl font-bold text-white">
                  Resumo de Consultas
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 text-center space-y-2 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <HeartIcon size={24} weight="fill" className="text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-blue-600">5</h3>
                  <p className="text-sm text-gray-600 font-medium">
                    Psicológicas
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center space-y-2 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                    <HeartIcon size={24} weight="fill" className="text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-purple-600">6</h3>
                  <p className="text-sm text-gray-600 font-medium">
                    Psiquiátricas
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-100 rounded-2xl p-4 border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 rounded-full">
                    <StarIcon size={16} weight="fill" className="text-white" />
                  </div>
                  <p className="text-amber-700 font-medium text-sm">
                    Parabéns! Você já realizou{" "}
                    <span className="font-bold">11 consultas</span>
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:underline transition-colors">
                  Ver histórico completo →
                </button>
              </div>
            </div>
          </div>

          {/* Insurance Plans */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <CheckCircleIcon
                    size={24}
                    weight="bold"
                    className="text-white"
                  />
                </div>
                <h2 className="font-satoshi text-xl font-bold text-white">
                  Meus Convênios
                </h2>
              </div>
            </div>

            <div className="p-6">
              <Swiper
                spaceBetween={16}
                slidesPerView={2}
                breakpoints={{
                  640: {
                    slidesPerView: 3,
                  },
                  768: {
                    slidesPerView: 4,
                  },
                  1024: {
                    slidesPerView: 5,
                  },
                }}
                modules={[Autoplay]}
                autoplay={{
                  delay: 5000,
                }}
                className="h-64"
              >
                {CONVENIOS.map((convenio) => (
                  <SwiperSlide key={convenio.id}>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 h-full flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Image
                            src={convenio.img}
                            alt={convenio.title}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="font-satoshi font-semibold text-gray-800 text-sm">
                            {convenio.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {convenio.accessMethod}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="primary.regular"
                        className="w-full text-xs py-2"
                      >
                        Agendar
                      </Button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Quick Metrics - Shows only on xl screens */}
          <div className="hidden xl:block bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendUpIcon size={24} weight="bold" className="text-white" />
                </div>
                <h2 className="font-satoshi text-xl font-bold text-white">
                  Métricas Rápidas
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-4 text-center space-y-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <HeartIcon size={20} weight="fill" className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-600">89%</h3>
                  <p className="text-sm text-gray-600 font-medium">
                    Índice de Bem-estar
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 text-center space-y-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <StarIcon size={20} weight="fill" className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-600">4.8</h3>
                  <p className="text-sm text-gray-600 font-medium">
                    Avaliação Média
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-4 text-center space-y-2">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircleIcon
                      size={20}
                      weight="fill"
                      className="text-white"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-600">12</h3>
                  <p className="text-sm text-gray-600 font-medium">
                    Dias Consecutivos
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-2xl p-4 border border-purple-200">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <StarIcon
                        size={12}
                        weight="fill"
                        className="text-white"
                      />
                    </div>
                    <h4 className="font-satoshi font-bold text-purple-700">
                      Parabéns! 🎉
                    </h4>
                  </div>
                  <p className="text-purple-600 text-sm">
                    Você manteve uma rotina saudável por 12 dias seguidos!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Psico+ Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-full">
                <GiftIcon size={24} weight="bold" className="text-white" />
              </div>
              <h2 className="font-satoshi text-2xl font-bold text-white">
                Seu Psico+ Rewards
              </h2>
            </div>
          </div>

          <div className="p-8">
            <div className="w-full space-y-8">
              {/* Progress Section */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <h3 className="font-satoshi text-2xl font-bold text-gray-800">
                    Selos Acumulados
                  </h3>
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold">
                    10/100
                  </div>
                </div>

                <div className="w-full max-w-2xl mx-auto bg-gray-200 rounded-full h-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full w-1/12 shadow-sm"></div>
                </div>

                <p className="text-gray-600">
                  Cada R$ 1,00 gasto = 1 selo • Troque por recompensas
                  incríveis!
                </p>
              </div>

              {/* Rewards Grid */}
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto">
                      <GitlabLogoSimpleIcon
                        size={32}
                        weight="duotone"
                        className="text-white"
                      />
                    </div>
                    <h4 className="font-medium text-gray-700">
                      GitLab Premium
                    </h4>
                    <p className="text-sm text-gray-500">30 selos</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
                      <SpotifyLogoIcon
                        size={32}
                        weight="duotone"
                        className="text-white"
                      />
                    </div>
                    <h4 className="font-medium text-gray-700">
                      Spotify Premium
                    </h4>
                    <p className="text-sm text-gray-500">50 selos</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <SteamLogoIcon
                        size={32}
                        weight="duotone"
                        className="text-white"
                      />
                    </div>
                    <h4 className="font-medium text-gray-700">Steam Wallet</h4>
                    <p className="text-sm text-gray-500">75 selos</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                      <GiftIcon
                        size={32}
                        weight="duotone"
                        className="text-white"
                      />
                    </div>
                    <h4 className="font-medium text-gray-700">Vale Presente</h4>
                    <p className="text-sm text-gray-500">100 selos</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                      <StarIcon
                        size={32}
                        weight="duotone"
                        className="text-white"
                      />
                    </div>
                    <h4 className="font-medium text-gray-700">Desconto VIP</h4>
                    <p className="text-sm text-gray-500">25 selos</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                      <HeartIcon
                        size={32}
                        weight="duotone"
                        className="text-white"
                      />
                    </div>
                    <h4 className="font-medium text-gray-700">
                      Consulta Grátis
                    </h4>
                    <p className="text-sm text-gray-500">150 selos</p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-100 rounded-2xl p-6 border border-amber-200">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <StarIcon
                        size={16}
                        weight="fill"
                        className="text-white"
                      />
                    </div>
                    <h4 className="font-satoshi font-bold text-amber-700">
                      Faltam apenas 90 selos!
                    </h4>
                  </div>
                  <p className="text-amber-600">
                    Continue sua jornada de bem-estar e desbloqueie recompensas
                    incríveis
                  </p>
                  <Button
                    variant="primary.regular"
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    Ver Todas as Recompensas
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
