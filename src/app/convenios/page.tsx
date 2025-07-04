"use client";

import { Button } from "@/components";
import {
  BuildingsIcon,
  CalendarPlusIcon,
  CheckCircleIcon,
  CreditCardIcon,
  IdentificationCardIcon,
  InfoIcon,
  LightbulbIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import Image from "next/image";

const CONVENIOS = [
  {
    id: 1,
    title: "PsicoCare",
    img: "/psicocare.png",
    accessMethod: "CPF",
    status: "Ativo",
  },
  {
    id: 2,
    title: "GM Pharm",
    img: "/logo.png",
    accessMethod: "Código",
    status: "Ativo",
  },
  {
    id: 3,
    title: "Comunidade Divergente",
    img: "/psicocare.png",
    accessMethod: "CPF",
    status: "Ativo",
  },
  {
    id: 4,
    title: "Sinpro - Osasco",
    img: "/logo.png",
    accessMethod: "Código",
    status: "Ativo",
  },
  {
    id: 5,
    title: "Sintricom",
    img: "/psicocare.png",
    accessMethod: "CPF",
    status: "Ativo",
  },
  {
    id: 6,
    title: "PsicoCare",
    img: "/logo.png",
    accessMethod: "Código",
    status: "Ativo",
  },
  {
    id: 7,
    title: "GM Pharm",
    img: "/psicocare.png",
    accessMethod: "CPF",
    status: "Ativo",
  },
];

export default function Convenios() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white w-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Meus Convênios 🏥
              </h1>
              <p className="text-gray-500 mt-1">
                Gerencie seus convênios e agende consultas facilmente
              </p>
            </div>
            <Button
              variant="primary.regular"
              icon={<CalendarPlusIcon size={20} weight="bold" />}
              className="py-3 px-6"
            >
              Agendar Consulta
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
                <p className="text-sm text-gray-600 mb-1">Total de Convênios</p>
                <p className="text-3xl font-bold text-gray-900">
                  {CONVENIOS.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <BuildingsIcon
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
                <p className="text-sm text-gray-600 mb-1">Convênios Ativos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {CONVENIOS.filter((c) => c.status === "Ativo").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <ShieldCheckIcon
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
                <p className="text-sm text-gray-600 mb-1">Acesso via CPF</p>
                <p className="text-3xl font-bold text-gray-900">
                  {CONVENIOS.filter((c) => c.accessMethod === "CPF").length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <IdentificationCardIcon
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
                <p className="text-sm text-gray-600 mb-1">Acesso via Código</p>
                <p className="text-3xl font-bold text-gray-900">
                  {CONVENIOS.filter((c) => c.accessMethod === "Código").length}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <CreditCardIcon
                  size={24}
                  weight="bold"
                  className="text-amber-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-sm border border-green-200 overflow-hidden">
            <div className="p-6 bg-white border-b border-green-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Como Agendar sua Consulta
                </h2>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <LightbulbIcon size={16} weight="fill" />
                  <span className="text-sm font-medium">Dica</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-6">
                  {/* Info Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <InfoIcon
                        size={32}
                        weight="fill"
                        className="text-white"
                      />
                    </div>
                  </div>

                  {/* Info Content */}
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium">
                      Selecione um convênio ou a opção de atendimento particular
                      abaixo para agendar sua consulta de forma rápida e
                      prática.
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon
                          size={16}
                          weight="bold"
                          className="text-green-600"
                        />
                        <span>Processo simples e rápido</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon
                          size={16}
                          weight="bold"
                          className="text-green-600"
                        />
                        <span>Confirmação imediata</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Convenios Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Convênios Disponíveis
            </h2>
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              <UsersIcon size={16} weight="bold" />
              {CONVENIOS.length} convênios ativos
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CONVENIOS.map((convenio) => (
              <div
                key={convenio.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6">
                  {/* Logo Container */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                      <Image
                        src={convenio.img}
                        alt={convenio.title}
                        width={80}
                        height={40}
                        className="object-contain max-w-full max-h-full"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {convenio.title}
                      </h3>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {convenio.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        {convenio.accessMethod === "CPF" ? (
                          <IdentificationCardIcon
                            size={16}
                            weight="bold"
                            className="text-purple-600"
                          />
                        ) : (
                          <CreditCardIcon
                            size={16}
                            weight="bold"
                            className="text-amber-600"
                          />
                        )}
                        <span>
                          <span className="font-medium">Acesso via:</span>{" "}
                          {convenio.accessMethod}
                        </span>
                      </div>

                      <Button
                        variant="primary.regular"
                        className="w-full"
                        icon={<CalendarPlusIcon size={16} weight="bold" />}
                      >
                        Agendar Consulta
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Particular Option */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Atendimento Particular
            </h2>
            <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              <CreditCardIcon size={16} weight="bold" />
              Pagamento direto
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-sm border border-purple-200 overflow-hidden">
            <div className="p-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-8">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <CreditCardIcon
                        size={40}
                        weight="bold"
                        className="text-white"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Consulta Particular
                        </h3>
                        <p className="text-gray-600">
                          Agende sua consulta com pagamento direto, sem
                          dependência de convênios. Processo rápido e flexível.
                        </p>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon
                            size={16}
                            weight="bold"
                            className="text-green-600"
                          />
                          <span>Agendamento imediato</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon
                            size={16}
                            weight="bold"
                            className="text-green-600"
                          />
                          <span>Maior flexibilidade</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon
                            size={16}
                            weight="bold"
                            className="text-green-600"
                          />
                          <span>Diversos métodos de pagamento</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="primary.regular"
                      size="lg"
                      icon={<CalendarPlusIcon size={20} weight="bold" />}
                      className="px-8"
                    >
                      Agendar Consulta Particular
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
