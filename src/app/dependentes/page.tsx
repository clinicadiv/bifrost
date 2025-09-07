"use client";

import { Button } from "@/components";
import { DependentCard } from "@/components/DependentCard";
import { DependentFormModal } from "@/components/DependentFormModal";
import { DependentStatistics } from "@/components/DependentStatistics";
import { PageErrorBoundary } from "@/components/ErrorBoundary";
import { useDependentsOperations } from "@/hooks/queries/useDependents";
import { Dependent } from "@/types";
import {
  CalendarPlus,
  CheckCircle,
  Info,
  Lightbulb,
  UserPlus,
  Users,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Dependentes() {
  const {
    dependents,
    activeDependents,
    inactiveDependents,
    totalCount,
    isLoading,
    error,
    refetch,
  } = useDependentsOperations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDependent, setEditingDependent] = useState<
    Dependent | undefined
  >();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const handleAddDependent = () => {
    setEditingDependent(undefined);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditDependent = (dependent: Dependent) => {
    setEditingDependent(dependent);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDependent(undefined);
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

  if (error) {
    return (
      <PageErrorBoundary pageTitle="Dependentes">
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 w-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              Erro ao carregar dependentes
            </p>
            <Button onClick={refetch}>Tentar novamente</Button>
          </div>
        </div>
      </PageErrorBoundary>
    );
  }

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
                  onClick={handleAddDependent}
                >
                  Adicionar Dependente
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="p-6 w-full">
          {/* Quick Stats */}
          <DependentStatistics />

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
                {totalCount} dependente{totalCount !== 1 ? "s" : ""}
              </motion.div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 animate-pulse"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : totalCount > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {dependents.map((dependent, index) => (
                  <DependentCard
                    key={dependent.id}
                    dependent={dependent}
                    onEdit={handleEditDependent}
                    index={index}
                  />
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
                    onClick={handleAddDependent}
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
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl shadow-sm border border-blue-200 dark:border-blue-800 overflow-hidden cursor-pointer"
                onClick={handleAddDependent}
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
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl shadow-sm border border-green-200 dark:border-green-800 overflow-hidden cursor-pointer"
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

      {/* Modal */}
      <DependentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        dependent={editingDependent}
        mode={modalMode}
      />
    </PageErrorBoundary>
  );
}
