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
import { motion } from "framer-motion";
import { useState } from "react";

function HistoricoSelos() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-12 text-center"
    >
      <motion.div
        className="p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl inline-block mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <TicketIcon
          size={48}
          weight="fill"
          className="text-gray-400 dark:text-slate-400"
        />
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Nenhum selo acumulado ainda
      </h3>
      <p className="text-gray-500 dark:text-slate-400">
        Você ainda não acumulou selos. Os selos são adicionados automaticamente
        a cada atendimento realizado.
      </p>
    </motion.div>
  );
}

function Resgates() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-12 text-center"
    >
      <motion.div
        className="p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl inline-block mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <GiftIcon
          size={48}
          weight="fill"
          className="text-gray-400 dark:text-slate-400"
        />
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Nenhum resgate ainda
      </h3>
      <p className="text-gray-500 dark:text-slate-400">
        Você ainda não resgatou nenhum prêmio. Acumule 100 selos para resgatar 1
        mês grátis de streaming.
      </p>
    </motion.div>
  );
}

function Sobre() {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* About Section */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Crown
              size={24}
              weight="fill"
              className="text-purple-600 dark:text-purple-400"
            />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              O que é o Psico+
            </h3>
            <p className="text-gray-600 dark:text-slate-300 text-sm">
              O Psico+ é um programa de fidelidade exclusivo para pacientes da
              Clínica Div, criado para recompensar sua confiança em nossos
              serviços.
            </p>
          </div>
        </div>
      </motion.div>

      {/* How it Works */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Info
              size={24}
              weight="fill"
              className="text-blue-600 dark:text-blue-400"
            />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Como funciona?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <TicketIcon
                  size={24}
                  weight="fill"
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Acúmulo de selos
              </h4>
            </div>
            <p className="text-gray-600 dark:text-slate-300 text-sm">
              Para cada R$ 1,00 gasto em consultas e serviços na Clínica Div,
              você acumula 1 selo automaticamente.
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <StarIcon
                  size={24}
                  weight="fill"
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Resgate de prêmios
              </h4>
            </div>
            <p className="text-gray-600 dark:text-slate-300 text-sm">
              Troque seus selos por prêmios incríveis como streaming, descontos
              e vantagens exclusivas.
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Crown
                  size={24}
                  weight="fill"
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Benefícios exclusivos
              </h4>
            </div>
            <p className="text-gray-600 dark:text-slate-300 text-sm">
              Membros Psico+ têm acesso a vantagens especiais e prioridade em
              nossos serviços.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Benefits */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <SparkleIcon
              size={24}
              weight="fill"
              className="text-amber-600 dark:text-amber-400"
            />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Vantagens do programa
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/50"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <CheckCircleIcon
                  size={20}
                  weight="bold"
                  className="text-white"
                />
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Monitor
                  size={20}
                  weight="fill"
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>
            <p className="text-gray-700 dark:text-slate-300 text-sm font-medium">
              Serviço de streaming mensal gratuito (Netflix, Disney+ ou Prime
              Video)
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800/50"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <CheckCircleIcon
                  size={20}
                  weight="bold"
                  className="text-white"
                />
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CalendarCheck
                  size={20}
                  weight="fill"
                  className="text-green-600 dark:text-green-400"
                />
              </div>
            </div>
            <p className="text-gray-700 dark:text-slate-300 text-sm font-medium">
              Prioridade no agendamento de consultas
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800/50"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <CheckCircleIcon
                  size={20}
                  weight="bold"
                  className="text-white"
                />
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Percent
                  size={20}
                  weight="bold"
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
            </div>
            <p className="text-gray-700 dark:text-slate-300 text-sm font-medium">
              Descontos exclusivos em eventos e workshops da Clínica Div
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800/50"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-amber-600 rounded-lg">
                <CheckCircleIcon
                  size={20}
                  weight="bold"
                  className="text-white"
                />
              </div>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <EnvelopeOpen
                  size={20}
                  weight="fill"
                  className="text-amber-600 dark:text-amber-400"
                />
              </div>
            </div>
            <p className="text-gray-700 dark:text-slate-300 text-sm font-medium">
              Acesso antecipado a novidades e conteúdos exclusivos
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PsicoPlus() {
  const [activeTab, setActiveTab] = useState<
    "historico" | "resgates" | "sobre"
  >("historico");

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
                Psico+ Rewards 👑
              </h1>
              <p className="text-gray-500 dark:text-slate-400 mt-1">
                Programa de fidelidade exclusivo para nossos pacientes
              </p>
            </div>
            <motion.div
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircleIcon size={16} weight="fill" />
              <span className="text-sm font-medium">Membro Ativo</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="p-6 w-full">
        {/* Stats Cards */}
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
                  Selos Acumulados
                </p>
                <motion.p
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  10
                </motion.p>
              </div>
              <motion.div
                className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <TicketIcon
                  size={24}
                  weight="fill"
                  className="text-blue-600 dark:text-blue-400"
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
                  Próximo Prêmio
                </p>
                <motion.p
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  90
                </motion.p>
              </div>
              <motion.div
                className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <HourglassLow
                  size={24}
                  weight="fill"
                  className="text-amber-600 dark:text-amber-400"
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
                  Resgates Totais
                </p>
                <motion.p
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                >
                  0
                </motion.p>
              </div>
              <motion.div
                className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <GiftIcon
                  size={24}
                  weight="fill"
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
                  Nível
                </p>
                <motion.p
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  1
                </motion.p>
              </div>
              <motion.div
                className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Crown
                  size={24}
                  weight="fill"
                  className="text-purple-600 dark:text-purple-400"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Psico+ Card */}
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
            className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl text-white overflow-hidden shadow-lg"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="p-4 bg-white/20 rounded-2xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Crown
                      size={48}
                      weight="fill"
                      className="text-yellow-300"
                    />
                  </motion.div>
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
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="text-center">
                        <motion.div
                          className="text-2xl font-bold text-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.2, duration: 0.3 }}
                        >
                          10
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Progress Details */}
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-semibold">
                            Progresso
                          </span>
                          <motion.span
                            className="text-lg font-bold"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.4, duration: 0.3 }}
                          >
                            10/100
                          </motion.span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3">
                          <motion.div
                            className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-3 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "10%" }}
                            transition={{
                              delay: 1.6,
                              duration: 1,
                              ease: "easeOut",
                            }}
                          ></motion.div>
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
          </motion.div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          variants={slideInVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <motion.div
                className={`transition-all px-6 py-3 rounded-xl font-medium cursor-pointer ${
                  activeTab === "historico"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
                onClick={() => setActiveTab("historico")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Histórico de Selos
              </motion.div>

              <motion.div
                className={`transition-all px-6 py-3 rounded-xl font-medium cursor-pointer ${
                  activeTab === "resgates"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("resgates")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Resgates
              </motion.div>

              <motion.div
                className={`transition-all px-6 py-3 rounded-xl font-medium cursor-pointer ${
                  activeTab === "sobre"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("sobre")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sobre o Programa
              </motion.div>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-50 rounded-xl p-6">
              {activeTab === "historico" && <HistoricoSelos />}
              {activeTab === "resgates" && <Resgates />}
              {activeTab === "sobre" && <Sobre />}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
