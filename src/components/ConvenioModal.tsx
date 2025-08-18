"use client";

import { useAuthStore } from "@/hooks";
import { getConvenio } from "@/services/http/convenio";
import { ConvenioData } from "@/types";
import { formatDocument } from "@/utils";
import {
  Brain,
  Building,
  Calendar,
  CreditCard,
  Heart,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConvenioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConvenioModal = ({ isOpen, onClose }: ConvenioModalProps) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [convenioData, setConvenioData] = useState<ConvenioData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const fetchConvenioData = async () => {
    if (!user?.id || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getConvenio(user.id, token);
      if (response.success) {
        setConvenioData(response.data);
      } else {
        setError("Erro ao carregar dados do convênio");
      }
    } catch (err) {
      console.error("Erro ao buscar convênio:", err);
      setError("Erro ao carregar dados do convênio");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConvenioData();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, user?.id, token]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 ${
            isClosing ? "animate-fade-out" : "animate-fade-in"
          }`}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-300/50 dark:border-slate-700/30 w-full max-w-2xl max-h-[90vh] overflow-hidden ${
              isClosing ? "animate-modal-close" : "animate-modal-open"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-div-green/15 to-emerald-500/15 dark:from-div-green/5 dark:to-emerald-500/5"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-div-green/25 to-transparent rounded-full blur-3xl"></div>

              <div className="relative p-6">
                <button
                  onClick={handleClose}
                  className="absolute top-0 right-0 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 transition-colors border border-gray-200 dark:border-slate-600"
                >
                  <X size={16} className="text-gray-600 dark:text-slate-400" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-div-green to-emerald-400 flex items-center justify-center shadow-lg">
                    <CreditCard
                      size={24}
                      className="text-white"
                      weight="duotone"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Meu Convênio
                    </h2>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">
                      Informações sobre seu plano ativo
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-div-green"></div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                    <X size={24} className="text-red-500" />
                  </div>
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    {error}
                  </p>
                  <button
                    onClick={fetchConvenioData}
                    className="mt-4 px-4 py-2 bg-div-green text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : convenioData ? (
                <div className="space-y-6">
                  {/* Status do Convênio */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl border border-green-200/50 dark:border-green-700/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Heart size={16} className="text-white" weight="fill" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-400">
                          Convênio Ativo
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-500">
                          {convenioData.convenioType}
                        </p>
                      </div>
                    </div>
                    {!convenioData.isExpired && (
                      <div className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                        Vigente
                      </div>
                    )}
                  </div>

                  {/* Informações do Plano */}
                  <div className="bg-gray-50/80 dark:bg-slate-800/50 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <CreditCard
                        size={20}
                        className="text-div-green"
                        weight="duotone"
                      />
                      Plano
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Nome do Plano
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {convenioData.plan.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Tipo
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {convenioData.plan.planType}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informações da Empresa - apenas se existir */}
                  {convenioData.company ? (
                    <div className="bg-gray-50/80 dark:bg-slate-800/50 rounded-2xl p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Building
                          size={20}
                          className="text-div-green"
                          weight="duotone"
                        />
                        Empresa
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            Nome Fantasia
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {convenioData.company.fantasyName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            CNPJ
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white font-mono">
                            {formatDocument(convenioData.company.document)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    convenioData.convenioType === "INDIVIDUAL" && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <Heart
                              size={20}
                              className="text-white"
                              weight="duotone"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400">
                              Plano Individual
                            </h3>
                            <p className="text-sm text-blue-600 dark:text-blue-500">
                              Este é um plano individual sem vinculação
                              empresarial
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {/* Sessões e Copagamentos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Psicologia */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                          <Heart
                            size={20}
                            className="text-white"
                            weight="duotone"
                          />
                        </div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-400">
                          Psicologia
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Sessões por mês
                          </p>
                          <p className="text-lg font-bold text-blue-800 dark:text-blue-300">
                            {convenioData.plan.psychologySessionsPerMonth}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Copagamento
                          </p>
                          <p className="text-lg font-bold text-blue-800 dark:text-blue-300">
                            {formatCurrency(convenioData.plan.psychologyCopay)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Psiquiatria */}
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                          <Brain
                            size={20}
                            className="text-white"
                            weight="duotone"
                          />
                        </div>
                        <h4 className="font-semibold text-purple-800 dark:text-purple-400">
                          Psiquiatria
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-purple-600 dark:text-purple-400">
                            Sessões por mês
                          </p>
                          <p className="text-lg font-bold text-purple-800 dark:text-purple-300">
                            {convenioData.plan.psychiatrySessionsPerMonth}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-purple-600 dark:text-purple-400">
                            Copagamento
                          </p>
                          <p className="text-lg font-bold text-purple-800 dark:text-purple-300">
                            {formatCurrency(convenioData.plan.psychiatryCopay)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benefícios do Mês Atual */}
                  <div className="bg-gradient-to-r from-div-green/10 to-emerald-400/10 dark:from-div-green/5 dark:to-emerald-400/5 rounded-2xl p-6 border border-div-green/20 dark:border-div-green/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar
                        size={20}
                        className="text-div-green"
                        weight="duotone"
                      />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Benefícios -{" "}
                        {formatMonth(convenioData.benefits.currentMonth)}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Heart size={16} className="text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                              Psicologia restante
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {convenioData.benefits.psychologyRemaining}{" "}
                              sessões
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Brain size={16} className="text-purple-500" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                              Psiquiatria restante
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {convenioData.benefits.psychiatryRemaining}{" "}
                              sessões
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <CreditCard size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-slate-400">
                    Nenhum convênio ativo encontrado
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
