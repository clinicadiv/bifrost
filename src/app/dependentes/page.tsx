"use client";

import { Button } from "@/components";
import {
  Cake,
  CalendarPlus,
  CheckCircle,
  Clock,
  EnvelopeSimple,
  IdentificationCard,
  Info,
  Lightbulb,
  PaperPlaneTilt,
  Pen,
  Trash,
  UserCheck,
  UserCircle,
  UserPlus,
  Users,
} from "@phosphor-icons/react";

// Mock data - seria substituído por dados reais da API
const DEPENDENTES = [
  {
    id: 1,
    nome: "Matheus Antunes Melo",
    parentesco: "Outro",
    dataNascimento: "17/03/1999",
    idade: 26,
    cpf: "111.337.129-32",
    email: "matheusantmelo@gmail.com",
    status: "Pendente",
  },
];

export default function Dependentes() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white w-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Meus Dependentes 👨‍👩‍👧‍👦
              </h1>
              <p className="text-gray-500 mt-1">
                Gerencie os dependentes e facilite o agendamento para toda
                família
              </p>
            </div>
            <Button
              variant="primary.regular"
              icon={<UserPlus size={20} weight="bold" />}
              className="py-3 px-6"
            >
              Adicionar Dependente
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
                <p className="text-sm text-gray-600 mb-1">
                  Total de Dependentes
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {DEPENDENTES.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users size={24} weight="bold" className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ativos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {DEPENDENTES.filter((d) => d.status === "Ativo").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <UserCheck size={24} weight="bold" className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pendentes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {DEPENDENTES.filter((d) => d.status === "Pendente").length}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock size={24} weight="bold" className="text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Últimos 30 dias</p>
                <p className="text-3xl font-bold text-gray-900">+1</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <UserPlus size={24} weight="bold" className="text-purple-600" />
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
                  Gerenciamento de Dependentes
                </h2>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <Lightbulb size={16} weight="fill" />
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
                      <Info size={32} weight="fill" className="text-white" />
                    </div>
                  </div>

                  {/* Info Content */}
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium mb-4">
                      Adicione seus dependentes para facilitar o agendamento de
                      consultas para toda sua família. Seus convênios ativos
                      podem ser utilizados para seus dependentes.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle
                          size={16}
                          weight="bold"
                          className="text-green-600"
                        />
                        <span>Convênios compartilhados</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle
                          size={16}
                          weight="bold"
                          className="text-green-600"
                        />
                        <span>Agendamento centralizado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle
                          size={16}
                          weight="bold"
                          className="text-green-600"
                        />
                        <span>Gestão familiar simplificada</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dependentes List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Lista de Dependentes
            </h2>
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              <Users size={16} weight="bold" />
              {DEPENDENTES.length} dependente
              {DEPENDENTES.length !== 1 ? "s" : ""}
            </div>
          </div>

          {DEPENDENTES.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {DEPENDENTES.map((dependente) => (
                <div
                  key={dependente.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <UserCircle
                          size={32}
                          weight="bold"
                          className="text-white"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {dependente.nome}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          {dependente.parentesco}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Cake
                            size={16}
                            weight="bold"
                            className="text-blue-600"
                          />
                        </div>
                        <span className="text-gray-600 text-sm">
                          {dependente.dataNascimento} ({dependente.idade} anos)
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <IdentificationCard
                            size={16}
                            weight="bold"
                            className="text-purple-600"
                          />
                        </div>
                        <span className="text-gray-600 text-sm">
                          {dependente.cpf}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <EnvelopeSimple
                            size={16}
                            weight="bold"
                            className="text-green-600"
                          />
                        </div>
                        <span className="text-gray-600 text-sm">
                          {dependente.email}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {dependente.status === "Pendente" ? (
                            <div className="p-2 bg-amber-100 rounded-lg">
                              <Clock
                                size={16}
                                weight="bold"
                                className="text-amber-600"
                              />
                            </div>
                          ) : (
                            <div className="p-2 bg-green-100 rounded-lg">
                              <CheckCircle
                                size={16}
                                weight="bold"
                                className="text-green-600"
                              />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-700">
                            Status:
                            <span
                              className={`ml-1 ${
                                dependente.status === "Pendente"
                                  ? "text-amber-600"
                                  : "text-green-600"
                              }`}
                            >
                              {dependente.status}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary.light"
                          size="sm"
                          icon={<Pen size={14} weight="bold" />}
                          className="flex-1"
                        >
                          Editar
                        </Button>

                        <Button
                          variant="gray.light"
                          size="sm"
                          icon={<Trash size={14} weight="bold" />}
                        >
                          Excluir
                        </Button>

                        {dependente.status === "Pendente" && (
                          <Button
                            variant="primary.regular"
                            size="sm"
                            icon={<PaperPlaneTilt size={14} weight="bold" />}
                          >
                            Reenviar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-6">
                <Users size={48} weight="bold" className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum dependente cadastrado
              </h3>
              <p className="text-gray-500 mb-6">
                Adicione seus dependentes para facilitar o agendamento de
                consultas para toda família
              </p>
              <Button
                variant="primary.regular"
                icon={<UserPlus size={20} weight="bold" />}
              >
                Adicionar Primeiro Dependente
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Ações Rápidas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Dependent */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-sm border border-blue-200 overflow-hidden">
              <div className="p-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <UserPlus
                          size={32}
                          weight="bold"
                          className="text-white"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Adicionar Dependente
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Cadastre novos dependentes de forma rápida e simples
                      </p>
                      <Button
                        variant="primary.regular"
                        icon={<UserPlus size={16} weight="bold" />}
                      >
                        Adicionar Agora
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule for Family */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-sm border border-green-200 overflow-hidden">
              <div className="p-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <CalendarPlus
                          size={32}
                          weight="bold"
                          className="text-white"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Agendar para Família
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Agende consultas para todos os membros da família
                      </p>
                      <Button
                        variant="primary.regular"
                        icon={<CalendarPlus size={16} weight="bold" />}
                      >
                        Agendar Consulta
                      </Button>
                    </div>
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
