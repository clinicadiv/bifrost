"use client";

import {
  CalendarCheck,
  CheckCircleIcon,
  Crown,
  EnvelopeOpen,
  GiftIcon,
  HourglassLow,
  Info,
  Monitor,
  Percent,
  SparkleIcon,
  StarIcon,
  TicketIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

function HistoricoSelos() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
      <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-6">
        <TicketIcon size={48} weight="fill" className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Nenhum selo acumulado ainda
      </h3>
      <p className="text-gray-500">
        Você ainda não acumulou selos. Os selos são adicionados automaticamente
        a cada atendimento realizado.
      </p>
    </div>
  );
}

function Resgates() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
      <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-6">
        <GiftIcon size={48} weight="fill" className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Nenhum resgate ainda
      </h3>
      <p className="text-gray-500">
        Você ainda não resgatou nenhum prêmio. Acumule 100 selos para resgatar 1
        mês grátis de streaming.
      </p>
    </div>
  );
}

function Sobre() {
  return (
    <div className="space-y-8">
      {/* About Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Crown size={24} weight="fill" className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              O que é o Psico+
            </h3>
            <p className="text-gray-600 text-sm">
              O Psico+ é um programa de fidelidade exclusivo para pacientes da
              Clínica Div, criado para recompensar sua confiança em nossos
              serviços.
            </p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Info size={24} weight="fill" className="text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Como funciona?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <TicketIcon size={24} weight="fill" className="text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                Acúmulo de selos
              </h4>
            </div>
            <p className="text-gray-600 text-sm">
              Para cada R$ 1,00 gasto em consultas e serviços na Clínica Div,
              você acumula 1 selo automaticamente.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <StarIcon size={24} weight="fill" className="text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                Resgate de prêmios
              </h4>
            </div>
            <p className="text-gray-600 text-sm">
              Troque seus selos por prêmios incríveis como streaming, descontos
              e vantagens exclusivas.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Crown size={24} weight="fill" className="text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                Benefícios exclusivos
              </h4>
            </div>
            <p className="text-gray-600 text-sm">
              Membros Psico+ têm acesso a vantagens especiais e prioridade em
              nossos serviços.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-amber-100 rounded-xl">
            <SparkleIcon size={24} weight="fill" className="text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Vantagens do programa
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <CheckCircleIcon
                  size={20}
                  weight="bold"
                  className="text-white"
                />
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Monitor size={20} weight="fill" className="text-blue-600" />
              </div>
            </div>
            <p className="text-gray-700 text-sm font-medium">
              Serviço de streaming mensal gratuito (Netflix, Disney+ ou Prime
              Video)
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <CheckCircleIcon
                  size={20}
                  weight="bold"
                  className="text-white"
                />
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CalendarCheck
                  size={20}
                  weight="fill"
                  className="text-green-600"
                />
              </div>
            </div>
            <p className="text-gray-700 text-sm font-medium">
              Prioridade no agendamento de consultas
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <CheckCircleIcon
                  size={20}
                  weight="bold"
                  className="text-white"
                />
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Percent size={20} weight="bold" className="text-purple-600" />
              </div>
            </div>
            <p className="text-gray-700 text-sm font-medium">
              Descontos exclusivos em eventos e workshops da Clínica Div
            </p>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-amber-600 rounded-lg">
                <CheckCircleIcon
                  size={20}
                  weight="bold"
                  className="text-white"
                />
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <EnvelopeOpen
                  size={20}
                  weight="fill"
                  className="text-amber-600"
                />
              </div>
            </div>
            <p className="text-gray-700 text-sm font-medium">
              Acesso antecipado a novidades e conteúdos exclusivos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PsicoPlus() {
  const [activeTab, setActiveTab] = useState<
    "historico" | "resgates" | "sobre"
  >("historico");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white w-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Psico+ Rewards 👑
              </h1>
              <p className="text-gray-500 mt-1">
                Programa de fidelidade exclusivo para nossos pacientes
              </p>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full">
              <CheckCircleIcon size={16} weight="fill" />
              <span className="text-sm font-medium">Membro Ativo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Selos Acumulados</p>
                <p className="text-3xl font-bold text-gray-900">10</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <TicketIcon size={24} weight="fill" className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Próximo Prêmio</p>
                <p className="text-3xl font-bold text-gray-900">90</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <HourglassLow
                  size={24}
                  weight="fill"
                  className="text-amber-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resgates Totais</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <GiftIcon size={24} weight="fill" className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nível</p>
                <p className="text-3xl font-bold text-gray-900">1</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Crown size={24} weight="fill" className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Psico+ Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl text-white overflow-hidden shadow-lg">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/20 rounded-2xl">
                    <Crown
                      size={48}
                      weight="fill"
                      className="text-yellow-300"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">PSICO+</h2>
                    <p className="text-purple-100">
                      Programa de fidelidade exclusivo
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-8">
                  {/* Seals Counter */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">10</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Details */}
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-semibold">
                            Progresso
                          </span>
                          <span className="text-lg font-bold">10/100</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-3 rounded-full transition-all duration-500"
                            style={{ width: "10%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <HourglassLow
                            size={16}
                            weight="fill"
                            className="text-yellow-300"
                          />
                          <span>
                            Faltam <span className="font-bold">90 selos</span>{" "}
                            para o próximo prêmio
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Info
                            size={16}
                            weight="fill"
                            className="text-purple-200"
                          />
                          <span>Cada R$ 100,00 gastos = 1 selo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div
                className={`transition-all px-6 py-3 rounded-xl font-medium cursor-pointer ${
                  activeTab === "historico"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("historico")}
              >
                Histórico de Selos
              </div>

              <div
                className={`transition-all px-6 py-3 rounded-xl font-medium cursor-pointer ${
                  activeTab === "resgates"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("resgates")}
              >
                Resgates
              </div>

              <div
                className={`transition-all px-6 py-3 rounded-xl font-medium cursor-pointer ${
                  activeTab === "sobre"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("sobre")}
              >
                Sobre o Programa
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-50 rounded-xl p-6">
              {activeTab === "historico" && <HistoricoSelos />}
              {activeTab === "resgates" && <Resgates />}
              {activeTab === "sobre" && <Sobre />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
