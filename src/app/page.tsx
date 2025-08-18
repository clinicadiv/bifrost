"use client";

import { Button } from "@/components";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  CalendarIcon,
  CalendarPlusIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
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
  { label: "Horas de Terapia", value: "23", icon: ClockIcon, color: "indigo" },
];

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

export default function Home() {
  const { user } = useAuthStore();

  return (
    <motion.div
      className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700 sticky top-0 z-10"
        variants={itemVariants}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                Olá, {user?.name.split(" ")[0]}! 👋
              </h1>
              <p className="text-gray-500 dark:text-slate-400 mt-1">
                Que bom ter você de volta. Vamos cuidar da sua saúde mental
                hoje?
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="p-6 w-full">
        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5,
              },
            },
          }}
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md dark:shadow-black/20 dark:hover:shadow-black/30 transition-shadow border border-gray-100 dark:border-slate-700"
              variants={statsVariants}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                    {stat.label}
                  </p>
                  <motion.p
                    className="text-3xl font-bold text-gray-900 dark:text-slate-100"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div
                  className={`p-3 rounded-xl ${
                    stat.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : stat.color === "green"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : stat.color === "purple"
                      ? "bg-purple-100 dark:bg-purple-900/30"
                      : stat.color === "orange"
                      ? "bg-orange-100 dark:bg-orange-900/30"
                      : stat.color === "yellow"
                      ? "bg-yellow-100 dark:bg-yellow-900/30"
                      : "bg-indigo-100 dark:bg-indigo-900/30"
                  }`}
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                  whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                >
                  <stat.icon
                    size={24}
                    weight="bold"
                    className={
                      stat.color === "blue"
                        ? "text-blue-600 dark:text-blue-400"
                        : stat.color === "green"
                        ? "text-green-600 dark:text-green-400"
                        : stat.color === "purple"
                        ? "text-purple-600 dark:text-purple-400"
                        : stat.color === "orange"
                        ? "text-orange-600 dark:text-orange-400"
                        : stat.color === "yellow"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-indigo-600 dark:text-indigo-400"
                    }
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
                delayChildren: 1.2,
              },
            },
          }}
        >
          {/* Next Appointment */}
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-800/50 overflow-hidden"
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
          >
            <div className="p-6 bg-white dark:bg-slate-800/50 border-b border-blue-100 dark:border-blue-800/50">
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CalendarIcon
                      size={20}
                      weight="fill"
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                      Próxima Consulta
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                      Sua consulta agendada
                    </p>
                  </div>
                </div>
                <motion.div
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, duration: 0.4 }}
                >
                  <CheckCircleIcon size={16} weight="fill" />
                  <span className="text-sm font-medium">Confirmado</span>
                </motion.div>
              </motion.div>
            </div>

            <div className="p-6">
              <motion.div
                className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 group overflow-hidden mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.5 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                {/* Decorative gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-6">
                    {/* Date Card */}
                    <motion.div
                      className="flex-shrink-0"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.0, duration: 0.4 }}
                      whileHover={{ rotate: 5 }}
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            08
                          </div>
                          <div className="text-xs text-blue-100 font-medium uppercase tracking-wide">
                            MAI
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Appointment Details */}
                    <motion.div
                      className="flex-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.1, duration: 0.5 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                            Consulta Psicológica
                          </h3>
                          <p className="text-gray-600 dark:text-slate-400 font-medium">
                            Dr. Guilherme Oliveira
                          </p>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
                            <ClockIcon size={18} weight="bold" />
                            <span className="text-sm font-semibold">
                              19:00 - 20:00
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <CalendarIcon size={18} weight="bold" />
                            <span className="text-sm font-semibold">
                              08 Mai 2025
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 2.3,
                    },
                  },
                }}
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Button
                    variant="primary.regular"
                    className="w-full py-3 text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 shadow-md hover:shadow-lg transition-all duration-300"
                    icon={<CalendarPlusIcon size={16} weight="bold" />}
                  >
                    Nova Consulta
                  </Button>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Button
                    variant="secondary.dark"
                    className="w-full py-3 text-sm font-semibold hover:shadow-lg transition-all duration-300"
                    icon={<CalendarIcon size={16} weight="bold" />}
                  >
                    Reagendar
                  </Button>
                </motion.div>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <ClockIcon
                        size={16}
                        weight="bold"
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                        Lembrete ativo
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        Você será notificado 30 min antes
                      </p>
                    </div>
                  </div>
                  <motion.div
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.6, duration: 0.3 }}
                  >
                    Em 2 dias
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Convenios */}
          <motion.div
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-sm border border-green-100 dark:border-green-800/50 overflow-hidden"
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
          >
            <div className="p-6 bg-white dark:bg-slate-800/50 border-b border-green-100 dark:border-green-800/50">
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.8, duration: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <HeartIcon size={20} weight="fill" className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                      Seus Convênios
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                      Acesso rápido aos seus planos
                    </p>
                  </div>
                </div>
                <motion.div
                  className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.9, duration: 0.4 }}
                >
                  <CheckCircleIcon size={16} weight="fill" />
                  <span className="text-sm font-medium">Ativos</span>
                </motion.div>
              </motion.div>
            </div>
            <div className="p-6">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 3.0,
                    },
                  },
                }}
              >
                {CONVENIOS.slice(0, 2).map((convenio, index) => (
                  <motion.div
                    key={convenio.id}
                    className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 hover:shadow-xl dark:hover:shadow-black/20 transition-all duration-300 border border-gray-100 dark:border-slate-700 group overflow-hidden"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{
                      y: -5,
                      scale: 1.03,
                      transition: { duration: 0.2 },
                    }}
                  >
                    {/* Decorative gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-green-50/30 dark:to-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 3.2 + index * 0.1,
                            duration: 0.4,
                          }}
                          whileHover={{ rotate: 5 }}
                        >
                          <Image
                            src={convenio.img}
                            alt={convenio.title}
                            width={32}
                            height={32}
                            className="object-contain filter drop-shadow-sm"
                          />
                        </motion.div>
                        <motion.div
                          className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 3.3 + index * 0.1,
                            duration: 0.3,
                          }}
                        >
                          {convenio.accessMethod}
                        </motion.div>
                      </div>

                      <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 3.4 + index * 0.1, duration: 0.3 }}
                      >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">
                          {convenio.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Plano ativo • Cobertura completa
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 3.5 + index * 0.1, duration: 0.3 }}
                      >
                        <Button
                          variant="primary.regular"
                          className="w-full text-sm font-semibold py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 shadow-md hover:shadow-lg transition-all duration-300"
                          icon={<CalendarPlusIcon size={16} weight="bold" />}
                        >
                          Agendar Consulta
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.8, duration: 0.4 }}
              >
                <motion.button
                  className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold text-sm px-6 py-3 rounded-full bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300"
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Ver todos os convênios</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
