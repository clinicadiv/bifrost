"use client";

import { Button } from "@/components";
import { PageErrorBoundary } from "@/components/ErrorBoundary";
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
import { motion } from "framer-motion";
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
    <PageErrorBoundary pageTitle="Convênios">
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
                  Meus Convênios 🏥
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">
                  Gerencie seus convênios e agende consultas facilmente
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="primary.regular"
                  icon={<CalendarPlusIcon size={20} weight="bold" />}
                  className="py-3 px-6"
                >
                  Agendar Consulta
                </Button>
              </motion.div>
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
                    Total de Convênios
                  </p>
                  <motion.p
                    className="text-3xl font-bold text-gray-900 dark:text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    {CONVENIOS.length}
                  </motion.p>
                </div>
                <motion.div
                  className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <BuildingsIcon
                    size={24}
                    weight="bold"
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
                    Convênios Ativos
                  </p>
                  <motion.p
                    className="text-3xl font-bold text-gray-900 dark:text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    {CONVENIOS.filter((c) => c.status === "Ativo").length}
                  </motion.p>
                </div>
                <motion.div
                  className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <ShieldCheckIcon
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
                    Acesso via CPF
                  </p>
                  <motion.p
                    className="text-3xl font-bold text-gray-900 dark:text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    {CONVENIOS.filter((c) => c.accessMethod === "CPF").length}
                  </motion.p>
                </div>
                <motion.div
                  className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <IdentificationCardIcon
                    size={24}
                    weight="bold"
                    className="text-purple-600 dark:text-purple-400"
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
                    Acesso via Código
                  </p>
                  <motion.p
                    className="text-3xl font-bold text-gray-900 dark:text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                  >
                    {
                      CONVENIOS.filter((c) => c.accessMethod === "Código")
                        .length
                    }
                  </motion.p>
                </div>
                <motion.div
                  className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <CreditCardIcon
                    size={24}
                    weight="bold"
                    className="text-amber-600 dark:text-amber-400"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Info Card */}
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
              className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl shadow-sm border border-green-200 dark:border-green-800/50 overflow-hidden"
            >
              <div className="p-6 bg-white dark:bg-slate-800 border-b border-green-100 dark:border-green-800/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Como Agendar sua Consulta
                  </h2>
                  <motion.div
                    className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    <LightbulbIcon size={16} weight="fill" />
                    <span className="text-sm font-medium">Dica</span>
                  </motion.div>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-6">
                    {/* Info Icon */}
                    <div className="flex-shrink-0">
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <InfoIcon
                          size={32}
                          weight="fill"
                          className="text-white"
                        />
                      </motion.div>
                    </div>

                    {/* Info Content */}
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-slate-300 font-medium">
                        Selecione um convênio ou a opção de atendimento
                        particular abaixo para agendar sua consulta de forma
                        rápida e prática.
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon
                            size={16}
                            weight="bold"
                            className="text-green-600 dark:text-green-400"
                          />
                          <span>Processo simples e rápido</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon
                            size={16}
                            weight="bold"
                            className="text-green-600 dark:text-green-400"
                          />
                          <span>Confirmação imediata</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Convenios Grid */}
          <motion.div
            variants={slideInVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Convênios Disponíveis
              </h2>
              <motion.div
                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                <UsersIcon size={16} weight="bold" />
                {CONVENIOS.length} convênios ativos
              </motion.div>
            </div>

            <div className="space-y-4">
              {CONVENIOS.map((convenio, index) => (
                <motion.div
                  key={convenio.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -2,
                    scale: 1.01,
                    transition: { duration: 0.2 },
                  }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-200 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Logo e Informações Principais */}
                      <div className="flex items-center gap-6">
                        {/* Logo Container */}
                        <motion.div
                          className="w-20 h-20 bg-gray-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-slate-600 flex-shrink-0"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Image
                            src={convenio.img}
                            alt={convenio.title}
                            width={64}
                            height={32}
                            className="object-contain max-w-full max-h-full"
                          />
                        </motion.div>

                        {/* Informações do Convênio */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {convenio.title}
                            </h3>
                            <motion.span
                              className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 0.5 + index * 0.1,
                                duration: 0.3,
                              }}
                            >
                              {convenio.status}
                            </motion.span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                            {convenio.accessMethod === "CPF" ? (
                              <IdentificationCardIcon
                                size={16}
                                weight="bold"
                                className="text-purple-600 dark:text-purple-400"
                              />
                            ) : (
                              <CreditCardIcon
                                size={16}
                                weight="bold"
                                className="text-amber-600 dark:text-amber-400"
                              />
                            )}
                            <span>
                              <span className="font-medium">Acesso via:</span>{" "}
                              {convenio.accessMethod}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-6 text-sm text-gray-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                              <CheckCircleIcon
                                size={16}
                                weight="bold"
                                className="text-green-600 dark:text-green-400"
                              />
                              <span>Atendimento presencial</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircleIcon
                                size={16}
                                weight="bold"
                                className="text-green-600 dark:text-green-400"
                              />
                              <span>Telemedicina disponível</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircleIcon
                                size={16}
                                weight="bold"
                                className="text-green-600 dark:text-green-400"
                              />
                              <span>Agendamento online</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botão de Ação */}
                      <div className="flex-shrink-0">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="primary.regular"
                            size="lg"
                            icon={<CalendarPlusIcon size={20} weight="bold" />}
                            className="px-8 py-3"
                          >
                            Agendar Consulta
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Barra de destaque na parte inferior */}
                  <div className="h-1 bg-gradient-to-r from-green-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Particular Option */}
          <motion.div
            variants={slideInVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Atendimento Particular
              </h2>
              <motion.div
                className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
              >
                <CreditCardIcon size={16} weight="bold" />
                Pagamento direto
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl shadow-sm border border-purple-200 dark:border-purple-800/50 overflow-hidden"
            >
              <div className="p-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-8">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <CreditCardIcon
                          size={40}
                          weight="bold"
                          className="text-white"
                        />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Consulta Particular
                          </h3>
                          <p className="text-gray-600 dark:text-slate-300">
                            Agende sua consulta com pagamento direto, sem
                            dependência de convênios. Processo rápido e
                            flexível.
                          </p>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <CheckCircleIcon
                              size={16}
                              weight="bold"
                              className="text-green-600 dark:text-green-400"
                            />
                            <span>Agendamento imediato</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircleIcon
                              size={16}
                              weight="bold"
                              className="text-green-600 dark:text-green-400"
                            />
                            <span>Maior flexibilidade</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircleIcon
                              size={16}
                              weight="bold"
                              className="text-green-600 dark:text-green-400"
                            />
                            <span>Diversos métodos de pagamento</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="primary.regular"
                          size="lg"
                          icon={<CalendarPlusIcon size={20} weight="bold" />}
                          className="px-8"
                        >
                          Agendar Consulta Particular
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </PageErrorBoundary>
  );
}
