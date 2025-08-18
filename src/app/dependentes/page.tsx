"use client";

import { Button } from "@/components";
import { PageErrorBoundary } from "@/components/ErrorBoundary";
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
import { motion } from "framer-motion";

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
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <PageErrorBoundary pageTitle="Dependentes">
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
                  Meus Dependentes 👨‍👩‍👧‍👦
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">
                  Gerencie os dependentes e facilite o agendamento para toda
                  família
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="primary.regular"
                  icon={<UserPlus size={20} weight="bold" />}
                  className="py-3 px-6"
                >
                  Adicionar Dependente
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
                    Total de Dependentes
                  </p>
                  <motion.p
                    className="text-3xl font-bold text-gray-900 dark:text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    {DEPENDENTES.length}
                  </motion.p>
                </div>
                <motion.div
                  className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Users
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
                    Ativos
                  </p>
                  <motion.p
                    className="text-3xl font-bold text-gray-900 dark:text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    {DEPENDENTES.filter((d) => d.status === "Ativo").length}
                  </motion.p>
                </div>
                <motion.div
                  className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <UserCheck
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
                    Pendentes
                  </p>
                  <motion.p
                    className="text-3xl font-bold text-gray-900 dark:text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    {DEPENDENTES.filter((d) => d.status === "Pendente").length}
                  </motion.p>
                </div>
                <motion.div
                  className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Clock
                    size={24}
                    weight="bold"
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
                    Últimos 30 dias
                  </p>
                  <motion.p
                    className="text-3xl font-bold text-gray-900 dark:text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                  >
                    +1
                  </motion.p>
                </div>
                <motion.div
                  className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <UserPlus
                    size={24}
                    weight="bold"
                    className="text-purple-600 dark:text-purple-400"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl shadow-sm border border-green-200 dark:border-green-800/50 overflow-hidden">
              <div className="p-6 bg-white dark:bg-slate-800 border-b border-green-100 dark:border-green-800/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Gerenciamento de Dependentes
                  </h2>
                  <motion.div
                    className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                  >
                    <Lightbulb size={16} weight="fill" />
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
                        transition={{ delay: 0.9, duration: 0.5 }}
                        whileHover={{ rotate: 360 }}
                      >
                        <Info size={32} weight="fill" className="text-white" />
                      </motion.div>
                    </div>

                    {/* Info Content */}
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-slate-300 font-medium mb-4">
                        Adicione seus dependentes para facilitar o agendamento
                        de consultas para toda sua família. Seus convênios
                        ativos podem ser utilizados para seus dependentes.
                      </p>
                      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-slate-300">
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.1, duration: 0.3 }}
                        >
                          <CheckCircle
                            size={16}
                            weight="bold"
                            className="text-green-600 dark:text-green-400"
                          />
                          <span>Convênios compartilhados</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2, duration: 0.3 }}
                        >
                          <CheckCircle
                            size={16}
                            weight="bold"
                            className="text-green-600 dark:text-green-400"
                          />
                          <span>Agendamento centralizado</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.3, duration: 0.3 }}
                        >
                          <CheckCircle
                            size={16}
                            weight="bold"
                            className="text-green-600 dark:text-green-400"
                          />
                          <span>Gestão familiar simplificada</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dependentes List */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Lista de Dependentes
              </h2>
              <motion.div
                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
              >
                <Users size={16} weight="bold" />
                {DEPENDENTES.length} dependente
                {DEPENDENTES.length !== 1 ? "s" : ""}
              </motion.div>
            </div>

            {DEPENDENTES.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {DEPENDENTES.map((dependente, index) => (
                  <motion.div
                    key={dependente.id}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.02,
                      y: -5,
                      transition: { duration: 0.2 },
                    }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-200 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <UserCircle
                            size={32}
                            weight="bold"
                            className="text-white"
                          />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {dependente.nome}
                          </h3>
                          <motion.span
                            className="inline-block px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-sm rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                          >
                            {dependente.parentesco}
                          </motion.span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Cake
                              size={16}
                              weight="bold"
                              className="text-blue-600 dark:text-blue-400"
                            />
                          </div>
                          <span className="text-gray-600 dark:text-slate-300 text-sm">
                            {dependente.dataNascimento} ({dependente.idade}{" "}
                            anos)
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <IdentificationCard
                              size={16}
                              weight="bold"
                              className="text-purple-600 dark:text-purple-400"
                            />
                          </div>
                          <span className="text-gray-600 dark:text-slate-300 text-sm">
                            {dependente.cpf}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <EnvelopeSimple
                              size={16}
                              weight="bold"
                              className="text-green-600 dark:text-green-400"
                            />
                          </div>
                          <span className="text-gray-600 dark:text-slate-300 text-sm">
                            {dependente.email}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {dependente.status === "Pendente" ? (
                              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <Clock
                                  size={16}
                                  weight="bold"
                                  className="text-amber-600 dark:text-amber-400"
                                />
                              </div>
                            ) : (
                              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <CheckCircle
                                  size={16}
                                  weight="bold"
                                  className="text-green-600 dark:text-green-400"
                                />
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                              Status:
                              <span
                                className={`ml-1 ${
                                  dependente.status === "Pendente"
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-green-600 dark:text-green-400"
                                }`}
                              >
                                {dependente.status}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1"
                          >
                            <Button
                              variant="secondary.light"
                              size="sm"
                              icon={<Pen size={14} weight="bold" />}
                              className="flex-1"
                            >
                              Editar
                            </Button>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="gray.light"
                              size="sm"
                              icon={<Trash size={14} weight="bold" />}
                            >
                              Excluir
                            </Button>
                          </motion.div>

                          {dependente.status === "Pendente" && (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="primary.regular"
                                size="sm"
                                icon={
                                  <PaperPlaneTilt size={14} weight="bold" />
                                }
                              >
                                Reenviar
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-12 text-center"
              >
                <motion.div
                  className="p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl inline-block mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <Users
                    size={48}
                    weight="bold"
                    className="text-gray-400 dark:text-slate-400"
                  />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum dependente cadastrado
                </h3>
                <p className="text-gray-500 dark:text-slate-400 mb-6">
                  Adicione seus dependentes para facilitar o agendamento de
                  consultas para toda família
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="primary.regular"
                    icon={<UserPlus size={20} weight="bold" />}
                  >
                    Adicionar Primeiro Dependente
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Ações Rápidas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add Dependent */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                whileHover={{
                  scale: 1.02,
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl shadow-sm border border-blue-200 dark:border-blue-800 overflow-hidden"
              >
                <div className="p-6">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <motion.div
                          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <UserPlus
                            size={32}
                            weight="bold"
                            className="text-white"
                          />
                        </motion.div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Adicionar Dependente
                        </h3>
                        <p className="text-gray-600 dark:text-slate-300 mb-4">
                          Cadastre novos dependentes de forma rápida e simples
                        </p>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="primary.regular"
                            icon={<UserPlus size={16} weight="bold" />}
                          >
                            Adicionar Agora
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Schedule for Family */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.2 }}
                whileHover={{
                  scale: 1.02,
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl shadow-sm border border-green-200 dark:border-green-800 overflow-hidden"
              >
                <div className="p-6">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <motion.div
                          className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <CalendarPlus
                            size={32}
                            weight="bold"
                            className="text-white"
                          />
                        </motion.div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Agendar para Família
                        </h3>
                        <p className="text-gray-600 dark:text-slate-300 mb-4">
                          Agende consultas para todos os membros da família
                        </p>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="primary.regular"
                            icon={<CalendarPlus size={16} weight="bold" />}
                          >
                            Agendar Consulta
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PageErrorBoundary>
  );
}
