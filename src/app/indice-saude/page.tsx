"use client";

import { Button, TableList, TableListProps } from "@/components";
import { Rating } from "@/types";
import {
  BrainIcon,
  CalendarIcon,
  ChartLineUpIcon,
  CheckCircleIcon,
  ClockIcon,
  Download,
  FileTextIcon,
  HeartIcon,
  InfoIcon,
  LightbulbIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

export default function IndiceSaude() {
  const [ratings] = useState<Rating[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total] = useState(10);

  const pageChangeHandler = (page: number) => {
    setCurrentPage(page);
  };

  const perPageChangeHandler = (newPerPage: number) => {
    setPerPage(newPerPage);
  };

  const tableProps: TableListProps<Rating> = {
    title: "",
    heading: [
      {
        id: "created_at",
        name: "Data",
      },
      {
        id: "general_index",
        name: "Índice geral",
      },
      {
        id: "depression",
        name: "Depressão",
      },
      {
        id: "anxiety",
        name: "Ansiedade",
      },
      {
        id: "stress",
        name: "Estresse",
      },
    ],
    items: ratings,
    upButtons: (
      <div className="flex items-center gap-4">
        <Button
          variant="primary.regular"
          icon={<FileTextIcon size={20} weight="bold" />}
        >
          Realizar teste DASS-21
        </Button>

        <Button
          variant="secondary.light"
          icon={<Download size={20} weight="bold" />}
        >
          Exportar histórico
        </Button>
      </div>
    ),
    paginationOptions: {
      total,
      perPage,
      currentPage,
      pageChangeHandler,
      perPageChangeHandler,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white w-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Índice de Saúde Mental 🧠
              </h1>
              <p className="text-gray-500 mt-1">
                Acompanhe sua saúde mental e receba recomendações personalizadas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="primary.regular"
                icon={<FileTextIcon size={20} weight="bold" />}
                className="py-3 px-6"
              >
                Realizar Teste DASS-21
              </Button>
              <Button
                variant="secondary.light"
                icon={<Download size={20} weight="bold" />}
                className="py-3 px-6"
              >
                Exportar Histórico
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 w-full">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Índice Geral</p>
                <p className="text-3xl font-bold text-gray-900">21</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <HeartIcon size={24} weight="bold" className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Depressão</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <BrainIcon size={24} weight="bold" className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ansiedade</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <LightbulbIcon
                  size={24}
                  weight="bold"
                  className="text-yellow-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Estresse</p>
                <p className="text-3xl font-bold text-gray-900">21</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <WarningIcon
                  size={24}
                  weight="bold"
                  className="text-orange-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Health Index Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-sm border border-red-200 overflow-hidden">
            <div className="p-6 bg-white border-b border-red-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Avaliação Atual
                </h2>
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  <WarningIcon size={16} weight="fill" />
                  <span className="text-sm font-medium">Preocupante</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-8">
                  {/* Score Circle */}
                  <div className="flex-shrink-0">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-red-600 p-1">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">
                              21
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Details */}
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 uppercase">
                          Preocupante
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Os indicadores de saúde mental estão em níveis
                          preocupantes. Necessita de atenção imediata e
                          intervenções direcionadas.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <ClockIcon
                            size={16}
                            weight="bold"
                            className="text-gray-500"
                          />
                          <span className="text-gray-600">
                            <span className="font-semibold">
                              Última avaliação:
                            </span>{" "}
                            24/03/2025 23:53
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon
                            size={16}
                            weight="bold"
                            className="text-green-600"
                          />
                          <span className="text-gray-600">
                            <span className="font-semibold">
                              Próxima avaliação:
                            </span>{" "}
                            <span className="text-green-600 font-medium">
                              Disponível agora
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Métricas de Saúde Mental
            </h2>
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              <ChartLineUpIcon size={16} weight="bold" />3 métricas analisadas
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <BrainIcon
                    size={24}
                    weight="bold"
                    className="text-green-600"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Depressão</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Leve
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Avalia sentimentos como desânimo, falta de interesse e baixa
                autoestima.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <LightbulbIcon
                    size={24}
                    weight="bold"
                    className="text-yellow-600"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Ansiedade</h3>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    Moderado
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Avalia sensações de nervosismo, preocupação excessiva e reações
                físicas de ansiedade.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <WarningIcon
                    size={24}
                    weight="bold"
                    className="text-red-600"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Estresse</h3>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    Severo
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Avalia irritabilidade, tensão e dificuldade em relaxar.
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recomendações Personalizadas
            </h2>
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              <LightbulbIcon size={16} weight="bold" />3 recomendações
            </div>
          </div>

          <div className="space-y-6">
            {/* Depression Recommendations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
              <div className="p-6 border-l-4 border-l-green-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <BrainIcon
                      size={24}
                      weight="bold"
                      className="text-green-600"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Estratégias para Depressão
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Sua pontuação de depressão está elevada. Considere
                      implementar as seguintes estratégias:
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon
                      size={16}
                      weight="bold"
                      className="text-green-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm">
                      Pratique atividades que antes lhe traziam prazer, mesmo
                      que inicialmente não sinta vontade
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon
                      size={16}
                      weight="bold"
                      className="text-green-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm">
                      Mantenha uma rotina regular de sono e alimentação
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon
                      size={16}
                      weight="bold"
                      className="text-green-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm">
                      Busque apoio de amigos e familiares
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon
                      size={16}
                      weight="bold"
                      className="text-green-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm">
                      Considere uma consulta com um profissional de saúde mental
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Anxiety Recommendations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
              <div className="p-6 border-l-4 border-l-yellow-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <LightbulbIcon
                      size={24}
                      weight="bold"
                      className="text-yellow-600"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Melhorando a Ansiedade
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Para reduzir sua ansiedade, considere:
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon
                      size={16}
                      weight="bold"
                      className="text-yellow-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm">
                      Praticar técnicas de respiração profunda por 5 minutos, 3
                      vezes ao dia
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon
                      size={16}
                      weight="bold"
                      className="text-yellow-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm">
                      Praticar mindfulness ou meditação guiada
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon
                      size={16}
                      weight="bold"
                      className="text-yellow-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm">
                      Manter um diário de pensamentos ansiosos
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon
                      size={16}
                      weight="bold"
                      className="text-yellow-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm">
                      Limitar o tempo de exposição a notícias e redes sociais
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon
                      size={16}
                      weight="bold"
                      className="text-yellow-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm">
                      Consultar um profissional para avaliar outras opções de
                      tratamento
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Stress Recommendations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
              <div className="p-6 border-l-4 border-l-red-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <WarningIcon
                      size={24}
                      weight="bold"
                      className="text-red-600"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Estratégias para Estresse
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Sua pontuação de estresse está elevada. Considere
                      implementar as seguintes estratégias:
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon
                      size={16}
                      weight="bold"
                      className="text-red-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm">
                      Reservar tempo para atividades relaxantes
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon
                      size={16}
                      weight="bold"
                      className="text-red-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm">
                      Reduzir o consumo de cafeína
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon
                      size={16}
                      weight="bold"
                      className="text-red-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm">
                      Estabelecer limites claros entre trabalho e vida pessoal
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon
                      size={16}
                      weight="bold"
                      className="text-red-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm">
                      Praticar atividade física moderada pelo menos 30 minutos
                      por dia
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon
                      size={16}
                      weight="bold"
                      className="text-red-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm">
                      Adotar técnicas de gerenciamento de tempo e priorização de
                      tarefas
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Data */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Histórico de Avaliações
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
              <InfoIcon size={16} weight="bold" />
              {ratings.length} avaliações
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <TableList {...tableProps} />
          </div>
        </div>
      </div>
    </div>
  );
}
