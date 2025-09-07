"use client";

import { useDependentStatistics } from "@/hooks/queries/useDependents";
import { useAuthStore } from "@/hooks/useAuthStore";
import type { DependentStatistics } from "@/types";
import { UserCheck, UserMinus, Users } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export function DependentStatistics() {
  const { user } = useAuthStore();
  const {
    data: statistics,
    isLoading,
    error,
  } = useDependentStatistics(user?.id || "");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
                <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-12"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !statistics) {
    return null;
  }

  // statistics já é do tipo DependentStatistics (garantido pelo hook)
  const stats = statistics as DependentStatistics;

  const statsData = [
    {
      label: "Total de Dependentes",
      value: stats.totalDependents,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Ativos",
      value: stats.activeDependents,
      icon: UserCheck,
      color: "green",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Inativos",
      value: stats.inactiveDependents,
      icon: UserMinus,
      color: "red",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
    },
  ];

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
    >
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.label}
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
                {stat.label}
              </p>
              <motion.p
                className="text-3xl font-bold text-gray-900 dark:text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              >
                {stat.value}
              </motion.p>
            </div>
            <motion.div
              className={`p-3 ${stat.bgColor} rounded-xl`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              <stat.icon size={24} weight="bold" className={stat.iconColor} />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
