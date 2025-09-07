"use client";

import { Button } from "@/components";
import {
  useDeleteDependent,
  useReactivateDependent,
} from "@/hooks/mutations/useDependentMutations";
import { Dependent } from "@/types";
// import { formatDate } from "@/utils"; // formatDate retorna objeto, não string
import {
  ArrowClockwise,
  Cake,
  CheckCircle,
  Clock,
  EnvelopeSimple,
  IdentificationCard,
  Pen,
  Phone,
  Trash,
  UserCircle,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useState } from "react";

interface DependentCardProps {
  dependent: Dependent;
  onEdit: (dependent: Dependent) => void;
  index?: number;
}

export function DependentCard({
  dependent,
  onEdit,
  index = 0,
}: DependentCardProps) {
  const deleteDependentMutation = useDeleteDependent();
  const reactivateDependentMutation = useReactivateDependent();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteDependentMutation.mutateAsync(dependent.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting dependent:", error);
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivateDependentMutation.mutateAsync(dependent.id);
    } catch (error) {
      console.error("Error reactivating dependent:", error);
    }
  };

  const calculateAge = (birthDate: string | Date) => {
    const birth =
      typeof birthDate === "string" ? new Date(birthDate) : birthDate;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
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
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 },
      }}
      className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-200 overflow-hidden ${
        dependent.status
          ? "border-gray-100 dark:border-slate-700"
          : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <motion.div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
              dependent.status
                ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                : "bg-gradient-to-br from-gray-400 to-gray-500"
            }`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <UserCircle size={32} weight="bold" className="text-white" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {dependent.name}
            </h3>
            <div className="flex items-center gap-2">
              <motion.span
                className={`inline-block px-3 py-1 text-sm rounded-full ${
                  dependent.status
                    ? "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {dependent.relationship}
              </motion.span>
              {!dependent.status && (
                <motion.span
                  className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  Inativo
                </motion.span>
              )}
            </div>
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
              {typeof dependent.birthDate === "string"
                ? dependent.birthDate
                : new Date(dependent.birthDate).toLocaleDateString(
                    "pt-BR"
                  )}{" "}
              ({calculateAge(dependent.birthDate)} anos)
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
              {dependent.document.replace(
                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                "$1.$2.$3-$4"
              )}
            </span>
          </div>

          {dependent.email && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <EnvelopeSimple
                  size={16}
                  weight="bold"
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <span className="text-gray-600 dark:text-slate-300 text-sm">
                {dependent.email}
              </span>
            </div>
          )}

          {dependent.phone && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Phone
                  size={16}
                  weight="bold"
                  className="text-orange-600 dark:text-orange-400"
                />
              </div>
              <span className="text-gray-600 dark:text-slate-300 text-sm">
                {dependent.phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")}
              </span>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {dependent.status ? (
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle
                    size={16}
                    weight="bold"
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
              ) : (
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Clock
                    size={16}
                    weight="bold"
                    className="text-red-600 dark:text-red-400"
                  />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Status:
                <span
                  className={`ml-1 ${
                    dependent.status
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {dependent.status ? "Ativo" : "Inativo"}
                </span>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {dependent.status ? (
              <>
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
                    onClick={() => onEdit(dependent)}
                  >
                    Editar
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showDeleteConfirm ? (
                    <div className="flex gap-1">
                      <Button
                        variant="gray.light"
                        size="sm"
                        onClick={handleDelete}
                        isLoading={deleteDependentMutation.isPending}
                        disabled={deleteDependentMutation.isPending}
                      >
                        Confirmar
                      </Button>
                      <Button
                        variant="gray.light"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleteDependentMutation.isPending}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="gray.light"
                      size="sm"
                      icon={<Trash size={14} weight="bold" />}
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Excluir
                    </Button>
                  )}
                </motion.div>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button
                  variant="primary.regular"
                  size="sm"
                  icon={<ArrowClockwise size={14} weight="bold" />}
                  className="flex-1"
                  onClick={handleReactivate}
                  isLoading={reactivateDependentMutation.isPending}
                  disabled={reactivateDependentMutation.isPending}
                >
                  Reativar
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
