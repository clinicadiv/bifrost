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
import { motion } from "framer-motion";
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: -30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const slideInVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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
                Índice de Saúde Mental 🧠
              </h1>
              <p className="text-gray-500 dark:text-slate-400 mt-1">
                Acompanhe sua saúde mental e receba recomendações personalizadas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="primary.regular"
                  icon={<FileTextIcon size={20} weight="bold" />}
                  className="py-3 px-6"
                >
                  Realizar Teste DASS-21
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="secondary.light"
                  icon={<Download size={20} weight="bold" />}
                  className="py-3 px-6"
                >
                  Exportar Histórico
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="p-6 w-full">
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
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                  Índice Geral
                </p>
                <motion.p
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  21
                </motion.p>
              </div>
              <motion.div
                className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <HeartIcon
                  size={24}
                  weight="bold"
                  className="text-red-600 dark:text-red-400"
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={statsVariants}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                  Depressão
                </p>
                <motion.p
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  5
                </motion.p>
              </div>
              <motion.div
                className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <BrainIcon
                  size={24}
                  weight="bold"
                  className="text-green-600 dark:text-green-400"
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={statsVariants}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                  Ansiedade
                </p>
                <motion.p
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                >
                  12
                </motion.p>
              </div>
              <motion.div
                className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <LightbulbIcon
                  size={24}
                  weight="bold"
                  className="text-yellow-600 dark:text-yellow-400"
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={statsVariants}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                  Estresse
                </p>
                <motion.p
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  21
                </motion.p>
              </div>
              <motion.div
                className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <WarningIcon
                  size={24}
                  weight="bold"
                  className="text-orange-600 dark:text-orange-400"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Health Index Card */}
        <motion.div
          variants={slideInVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl shadow-sm border border-red-200 dark:border-red-800/50 overflow-hidden"
          >
            <div className="p-6 bg-white dark:bg-slate-800 border-b border-red-100 dark:border-red-800/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Avaliação Atual
                </h2>
                <motion.div
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  <WarningIcon size={16} weight="fill" />
                  <span className="text-sm font-medium">Preocupante</span>
                </motion.div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-8">
                  {/* Score Circle */}
                  <div className="flex-shrink-0">
                    <motion.div
                      className="relative w-24 h-24"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-red-600 p-1">
                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                          <div className="text-center">
                            <motion.div
                              className="text-3xl font-bold text-gray-900 dark:text-white"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 1, duration: 0.3 }}
                            >
                              21
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Status Details */}
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase">
                          Preocupante
                        </h3>
                        <p className="text-gray-600 dark:text-slate-300 text-sm">
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
                            className="text-gray-500 dark:text-slate-400"
                          />
                          <span className="text-gray-600 dark:text-slate-300">
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
                            className="text-green-600 dark:text-green-400"
                          />
                          <span className="text-gray-600 dark:text-slate-300">
                            <span className="font-semibold">
                              Próxima avaliação:
                            </span>{" "}
                            <span className="text-green-600 dark:text-green-400 font-medium">
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
          </motion.div>
        </motion.div>

        {/* Metrics Cards */}
        <motion.div
          variants={slideInVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Métricas de Saúde Mental
            </h2>
            <motion.div
              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              <ChartLineUpIcon size={16} weight="bold" />3 métricas analisadas
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-slate-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <BrainIcon
                    size={24}
                    weight="bold"
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Depressão
                  </h3>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                    Leve
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-slate-300 text-sm">
                Avalia sentimentos como desânimo, falta de interesse e baixa
                autoestima.
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-slate-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <LightbulbIcon
                    size={24}
                    weight="bold"
                    className="text-yellow-600 dark:text-yellow-400"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Ansiedade
                  </h3>
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">
                    Moderado
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-slate-300 text-sm">
                Avalia sensações de nervosismo, preocupação excessiva e reações
                físicas de ansiedade.
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-slate-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <WarningIcon
                    size={24}
                    weight="bold"
                    className="text-red-600 dark:text-red-400"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Estresse
                  </h3>
                  <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full">
                    Severo
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-slate-300 text-sm">
                Avalia irritabilidade, tensão e dificuldade em relaxar.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          variants={slideInVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recomendações Personalizadas
            </h2>
            <motion.div
              className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
            >
              <LightbulbIcon size={16} weight="bold" />3 recomendações
            </motion.div>
          </div>

          <div className="space-y-6">
            {/* Depression Recommendations */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="p-6 border-l-4 border-l-green-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <BrainIcon
                      size={24}
                      weight="bold"
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Estratégias para Depressão
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 text-sm">
                      Sua pontuação de depressão está elevada. Considere
                      implementar as seguintes estratégias:
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-600 dark:text-slate-300">
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
            </motion.div>

            {/* Anxiety Recommendations */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="p-6 border-l-4 border-l-yellow-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                    <LightbulbIcon
                      size={24}
                      weight="bold"
                      className="text-yellow-600 dark:text-yellow-400"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Melhorando a Ansiedade
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 text-sm">
                      Para reduzir sua ansiedade, considere:
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-600 dark:text-slate-300">
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
            </motion.div>

            {/* Stress Recommendations */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="p-6 border-l-4 border-l-red-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <WarningIcon
                      size={24}
                      weight="bold"
                      className="text-red-600 dark:text-red-400"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Estratégias para Estresse
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 text-sm">
                      Sua pontuação de estresse está elevada. Considere
                      implementar as seguintes estratégias:
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-600 dark:text-slate-300">
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
            </motion.div>
          </div>
        </motion.div>

        {/* Historical Data */}
        <motion.div
          variants={slideInVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Histórico de Avaliações
            </h2>
            <motion.div
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-700 px-3 py-1 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
            >
              <InfoIcon size={16} weight="bold" />
              {ratings.length} avaliações
            </motion.div>
          </div>

          <motion.div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700"
            whileHover={{
              scale: 1.01,
              transition: { duration: 0.2 },
            }}
          >
            <TableList {...tableProps} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
