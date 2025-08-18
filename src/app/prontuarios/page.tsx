"use client";

import { Button } from "@/components";
import { useAuthStore } from "@/hooks";
import { useMedicalRecords } from "@/hooks/queries/useMedicalRecords";
import { MedicalRecord } from "@/services/http/medical-records";
import { formatDate } from "@/utils";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarCheckIcon,
  ChartBarIcon,
  ClipboardTextIcon,
  ClockIcon,
  DiamondIcon,
  DownloadIcon,
  DownloadSimpleIcon,
  EyeIcon,
  FileTextIcon,
  HeartIcon,
  PackageIcon,
  PaperclipIcon,
  PillIcon,
  QuestionIcon,
  SpinnerIcon,
  UserIcon,
  WarningIcon,
  XIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// Interface para combinar documentos e prescrições
interface CombinedDocument {
  id: string;
  name: string;
  uploadDate: string;
  fileSize: string;
  url: string;
  type: "documento" | "receita";
  recipeType?: "branca" | "amarela" | "azul";
  trackingCode?: string;
}

// Interface estendida para prontuário com documentos combinados
interface ExtendedMedicalRecord extends MedicalRecord {
  combinedDocuments: CombinedDocument[];
  details: {
    symptoms: string[];
    diagnosis: string;
    treatment: string;
    nextAppointment?: string;
    notes: string;
  };
}

export default function Prontuarios() {
  const [selectedTab, setSelectedTab] = useState<
    "psicologico" | "psiquiatrico"
  >("psicologico");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProntuario, setSelectedProntuario] =
    useState<ExtendedMedicalRecord | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const { user } = useAuthStore();
  const {
    psychologicalRecords,
    psychiatricRecords,
    isLoading,
    error,
    page,
    total,
    hasNextPage,
    hasPrevPage,
    refreshRecords,
  } = useMedicalRecords(user?.id || "", { page: currentPage, limit: 10 });

  // Não precisa mais do useEffect - o React Query gerencia automaticamente

  // Função para converter MedicalRecord para ExtendedMedicalRecord
  const convertToExtendedRecord = (
    record: MedicalRecord
  ): ExtendedMedicalRecord => {
    // Combinar documentos e prescrições
    const combinedDocuments: CombinedDocument[] = [
      // Documentos
      ...record.documents.map((doc) => ({
        id: doc.id,
        name: doc.name,
        uploadDate: doc.createdAt,
        fileSize: doc.size,
        url: doc.s3DocumentUrl,
        type: "documento" as const,
      })),
      // Prescrições
      ...record.prescriptions.map((prescription) => ({
        id: prescription.id,
        name: prescription.name,
        uploadDate: prescription.createdAt,
        fileSize: prescription.size,
        url: "", // Prescrições não têm URL direta
        type: "receita" as const,
        recipeType: prescription.prescriptionType.toLowerCase() as
          | "branca"
          | "amarela"
          | "azul",
        trackingCode: prescription.trackingCode,
      })),
    ];

    return {
      ...record,
      combinedDocuments,
      details: {
        symptoms: record.observedSymptoms,
        diagnosis: record.diagnosis,
        treatment: record.treatmentPlan,
        notes: record.clinicalObservations,
      },
    };
  };

  const handleVisualizarProntuario = (prontuario: MedicalRecord) => {
    setSelectedProntuario(convertToExtendedRecord(prontuario));
  };

  const handleCloseModal = () => {
    setSelectedProntuario(null);
  };

  const handleDownloadDocument = (document: CombinedDocument) => {
    if (document.url) {
      // Download direto para documentos
      window.open(document.url, "_blank");
    } else {
      console.log(`Downloading document: ${document.name}`);
      // Para prescrições, implementar lógica específica se necessário
    }
  };

  const handleTrackRecipe = (document: CombinedDocument) => {
    if (document.trackingCode) {
      // Redirecionar para sistema de rastreamento dos correios
      window.open(
        `https://www.correios.com.br/rastreamento?codigo=${document.trackingCode}`,
        "_blank"
      );
    }
  };

  // Animation variants - Ultra simplificados para performance
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const renderProntuarioCard = (prontuario: MedicalRecord) => {
    const { dia, horario, nomeMes } = formatDate(
      prontuario.appointmentDateTime
    );
    const ano = new Date(prontuario.appointmentDateTime).getFullYear();
    const isPsicologico = prontuario.medical.type === "psychologist";
    const totalDocuments =
      prontuario.documents.length + prontuario.prescriptions.length;
    const receitas = prontuario.prescriptions.length;
    const documentos = prontuario.documents.length;

    return (
      <motion.div
        key={prontuario.id}
        variants={cardVariants}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200 ${
                  isPsicologico
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : "bg-gradient-to-br from-purple-500 to-purple-600"
                }`}
              >
                {isPsicologico ? (
                  <HeartIcon size={20} weight="bold" className="text-white" />
                ) : (
                  <PillIcon size={20} weight="bold" className="text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Prontuário {isPsicologico ? "Psicológico" : "Psiquiátrico"}
                </h3>
                <p className="text-gray-600 dark:text-slate-400 font-medium flex items-center gap-2">
                  <UserIcon size={14} weight="bold" />
                  {prontuario.medical.name}
                  {prontuario.medical.crp && (
                    <span className="text-xs text-gray-500">
                      CRP: {prontuario.medical.crp}
                    </span>
                  )}
                  {prontuario.medical.crm && (
                    <span className="text-xs text-gray-500">
                      CRM: {prontuario.medical.crm}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {dia} {nomeMes} {ano}
              </div>
              <div className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                <ClockIcon size={12} weight="bold" />
                {horario}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <FileTextIcon
                size={16}
                weight="bold"
                className="text-gray-500 dark:text-slate-400"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Descrição
              </span>
            </div>
            <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
              {prontuario.description}
            </p>
          </div>

          {/* Documents Count */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
              <PaperclipIcon size={14} weight="bold" />
              <span>
                {totalDocuments} item{totalDocuments !== 1 ? "s" : ""}
                {receitas > 0 &&
                  ` (${receitas} receita${receitas !== 1 ? "s" : ""})`}
                {documentos > 0 &&
                  ` (${documentos} documento${documentos !== 1 ? "s" : ""})`}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="primary.regular"
                size="sm"
                icon={<EyeIcon size={16} weight="bold" />}
                className="py-2 px-4 hover:scale-105 transition-transform duration-150"
                onClick={() => handleVisualizarProntuario(prontuario)}
              >
                Visualizar
              </Button>
              <Button
                variant="secondary.light"
                size="sm"
                icon={<DownloadIcon size={16} weight="bold" />}
                className="py-2 px-4 hover:scale-105 transition-transform duration-150"
              >
                Baixar PDF
              </Button>
            </div>
            <div
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isPsicologico
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
              }`}
            >
              {isPsicologico ? "Psicológico" : "Psiquiátrico"}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderDocumentItem = (document: CombinedDocument) => {
    const isRecipe = document.type === "receita";
    const isDocument = document.type === "documento";

    // Determinar cor do ícone e fundo baseado no tipo
    let iconColor = "text-gray-600 dark:text-slate-400";
    let bgColor = "bg-gray-100 dark:bg-slate-700";
    let divBgColor = "bg-gray-50 dark:bg-slate-700";

    if (isRecipe) {
      switch (document.recipeType) {
        case "branca":
          iconColor = "text-green-600 dark:text-green-400";
          bgColor = "bg-green-100 dark:bg-green-900/30";
          divBgColor = "bg-green-50 dark:bg-green-900/20";
          break;
        case "amarela":
          iconColor = "text-yellow-600 dark:text-yellow-400";
          bgColor = "bg-yellow-100 dark:bg-yellow-900/30";
          divBgColor = "bg-yellow-50 dark:bg-yellow-900/20";
          break;
        case "azul":
          iconColor = "text-blue-600 dark:text-blue-400";
          bgColor = "bg-blue-100 dark:bg-blue-900/30";
          divBgColor = "bg-blue-50 dark:bg-blue-900/20";
          break;
      }
    } else {
      iconColor = "text-gray-600 dark:text-slate-400";
      bgColor = "bg-gray-100 dark:bg-slate-700";
      divBgColor = "bg-gray-50 dark:bg-slate-700";
    }

    return (
      <div
        key={document.id}
        className={`flex items-center justify-between p-3 ${divBgColor} rounded-lg hover:scale-[1.01] transition-transform duration-150`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}
          >
            {isRecipe ? (
              <PillIcon size={16} weight="bold" className={iconColor} />
            ) : (
              <FileTextIcon size={16} weight="bold" className={iconColor} />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              {document.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {document.fileSize} • {formatDate(document.uploadDate).dia} de{" "}
              {formatDate(document.uploadDate).nomeMes}
              {isRecipe && (
                <span className="ml-2 text-xs font-medium">
                  Receita {document.recipeType}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Documentos e receitas brancas sempre têm arquivo disponível para download */}
          {isDocument || (isRecipe && document.recipeType === "branca") ? (
            <Button
              variant="secondary.light"
              size="sm"
              icon={<DownloadSimpleIcon size={16} weight="bold" />}
              onClick={() => handleDownloadDocument(document)}
              className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 border-blue-300 dark:border-blue-700 hover:scale-105 transition-transform duration-150"
            >
              Baixar
            </Button>
          ) : (
            // Receitas amarelas e azuis
            <>
              {document.trackingCode ? (
                <Button
                  variant="secondary.light"
                  size="sm"
                  icon={<PackageIcon size={16} weight="bold" />}
                  onClick={() => handleTrackRecipe(document)}
                  className={`hover:scale-105 transition-transform duration-150 ${
                    document.recipeType === "amarela"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 border-blue-300 dark:border-blue-700"
                  }`}
                >
                  Rastrear
                </Button>
              ) : (
                <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-lg">
                  <WarningIcon size={14} weight="bold" />
                  <span className="text-xs">Rastreio em breve</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Loading state
  if (
    isLoading &&
    psychologicalRecords.length === 0 &&
    psychiatricRecords.length === 0
  ) {
    return (
      <div className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SpinnerIcon
              size={32}
              className="text-blue-500 dark:text-blue-400 animate-spin"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Carregando prontuários...
          </h3>
          <p className="text-gray-500 dark:text-slate-400">
            Buscando seu histórico médico
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 py-20">
        <div className="flex items-center justify-center px-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-8 max-w-lg w-full text-center">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
              <WarningIcon
                size={28}
                className="text-red-500 dark:text-red-400"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Erro ao carregar prontuários
            </h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6 text-sm leading-relaxed max-w-md mx-auto">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary.regular"
                size="md"
                onClick={() => refreshRecords()}
                className="hover:scale-105 transition-transform duration-150"
              >
                Tentar novamente
              </Button>
              <Button
                variant="secondary.light"
                size="md"
                onClick={() => window.location.reload()}
                className="hover:scale-105 transition-transform duration-150"
              >
                Recarregar página
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800"
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
                Meus Prontuários 📋
              </h1>
              <p className="text-gray-500 dark:text-slate-400 mt-1">
                Acompanhe seu histórico médico e evolução terapêutica
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <ChartBarIcon
                    size={20}
                    weight="bold"
                    className="text-blue-600 dark:text-blue-400"
                  />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                      {psychologicalRecords.length + psychiatricRecords.length}{" "}
                      prontuários
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Total de {total}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="secondary.light"
                size="sm"
                icon={<QuestionIcon size={16} weight="bold" />}
                onClick={() => setShowHelpModal(true)}
                className="hover:scale-105 transition-transform duration-150"
              >
                Como funciona?
              </Button>
              <Button
                variant="secondary.light"
                size="sm"
                onClick={() => refreshRecords()}
                disabled={isLoading}
                className="hover:scale-105 transition-transform duration-150"
              >
                {isLoading ? "Atualizando..." : "Atualizar"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="p-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setSelectedTab("psicologico")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
              selectedTab === "psicologico"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <HeartIcon size={18} weight="bold" />
              Psicológicos ({psychologicalRecords.length})
            </div>
          </button>
          <button
            onClick={() => setSelectedTab("psiquiatrico")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
              selectedTab === "psiquiatrico"
                ? "bg-purple-500 text-white shadow-lg shadow-purple-200"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <PillIcon size={18} weight="bold" />
              Psiquiátricos ({psychiatricRecords.length})
            </div>
          </button>
        </div>

        {/* Content - 3 columns grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {selectedTab === "psicologico"
            ? psychologicalRecords.map((prontuario: MedicalRecord) =>
                renderProntuarioCard(prontuario)
              )
            : psychiatricRecords.map((prontuario: MedicalRecord) =>
                renderProntuarioCard(prontuario)
              )}
        </motion.div>

        {/* Pagination */}
        {total > 10 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="secondary.light"
              size="sm"
              icon={<ArrowLeftIcon size={16} weight="bold" />}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={!hasPrevPage || isLoading}
              className="hover:scale-105 transition-transform duration-150"
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-600 dark:text-slate-400">
              Página {page} de {Math.ceil(total / 10)}
            </span>
            <Button
              variant="secondary.light"
              size="sm"
              icon={<ArrowRightIcon size={16} weight="bold" />}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!hasNextPage || isLoading}
              className="hover:scale-105 transition-transform duration-150"
            >
              Próxima
            </Button>
          </div>
        )}

        {/* Empty State with Examples */}
        {((selectedTab === "psicologico" &&
          psychologicalRecords.length === 0) ||
          (selectedTab === "psiquiatrico" &&
            psychiatricRecords.length === 0)) &&
          !isLoading && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileTextIcon
                  size={40}
                  weight="bold"
                  className="text-gray-400 dark:text-slate-400"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Nenhum prontuário encontrado
              </h3>
              <p className="text-gray-500 dark:text-slate-400 mb-8">
                Seus prontuários{" "}
                {selectedTab === "psicologico"
                  ? "psicológicos"
                  : "psiquiátricos"}{" "}
                aparecerão aqui após suas consultas.
              </p>

              {/* Exemplos de como funciona */}
              <div className="max-w-4xl mx-auto mb-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  💡 Como funciona os prontuários?
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {/* Exemplo Psicológico */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <HeartIcon
                          size={16}
                          weight="bold"
                          className="text-white"
                        />
                      </div>
                      <h5 className="font-semibold text-blue-900 dark:text-blue-300">
                        Prontuário Psicológico
                      </h5>
                    </div>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          <strong>Contém:</strong> Relatórios de sessão,
                          exercícios terapêuticos, documentos anexados
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          <strong>Detalhes:</strong> Sintomas observados,
                          evolução, plano terapêutico
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          <strong>Documentos:</strong> PDFs, imagens, exercícios
                          para download
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Exemplo Psiquiátrico */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <PillIcon
                          size={16}
                          weight="bold"
                          className="text-white"
                        />
                      </div>
                      <h5 className="font-semibold text-purple-900 dark:text-purple-300">
                        Prontuário Psiquiátrico
                      </h5>
                    </div>
                    <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          <strong>Contém:</strong> Avaliação clínica,
                          prescrições, documentos médicos
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          <strong>Receitas:</strong> Branca (download),
                          Amarela/Azul (correios)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          <strong>Rastreamento:</strong> Código dos correios
                          para receitas controladas
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Como visualizar */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <EyeIcon
                          size={16}
                          weight="bold"
                          className="text-white"
                        />
                      </div>
                      <h5 className="font-semibold text-green-900 dark:text-green-300">
                        Visualização
                      </h5>
                    </div>
                    <ul className="space-y-2 text-sm text-green-800 dark:text-green-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          <strong>Botão &quot;Visualizar&quot;:</strong> Abre
                          modal com todos os detalhes
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          <strong>Informações:</strong> Data, profissional,
                          sintomas, diagnóstico
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          <strong>Download:</strong> Baixar PDF completo do
                          prontuário
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Tipos de receita */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <PackageIcon
                          size={16}
                          weight="bold"
                          className="text-white"
                        />
                      </div>
                      <h5 className="font-semibold text-yellow-900 dark:text-yellow-300">
                        Tipos de Receita
                      </h5>
                    </div>
                    <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          <strong>Receita Branca:</strong> Download direto
                          (medicamentos comuns)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          <strong>Receita Amarela:</strong> Enviada por correios
                          (controlados A1/A2)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          <strong>Receita Azul:</strong> Enviada por correios
                          (controlados A3)
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                variant="primary.regular"
                size="md"
                className="hover:scale-105 transition-transform duration-150"
              >
                Agendar Consulta
              </Button>
            </div>
          )}
      </div>

      {/* Modal de Ajuda */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <QuestionIcon
                      size={20}
                      weight="bold"
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      💡 Como funcionam os Prontuários?
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400">
                      Guia completo para entender seu histórico médico
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors duration-150 hover:scale-105"
                >
                  <XIcon
                    size={20}
                    className="text-gray-500 dark:text-slate-400"
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Exemplo Psicológico */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <HeartIcon
                          size={20}
                          weight="bold"
                          className="text-white"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300">
                        Prontuário Psicológico
                      </h3>
                    </div>
                    <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-300">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Contém:</strong> Relatórios de sessão,
                          exercícios terapêuticos, documentos anexados pelos
                          profissionais
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Detalhes clínicos:</strong> Sintomas
                          observados, evolução do quadro, plano terapêutico
                          personalizado
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Documentos:</strong> PDFs, imagens, exercícios
                          e materiais para download direto
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Histórico:</strong> Acompanhe sua jornada
                          terapêutica e progresso ao longo do tempo
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Exemplo Psiquiátrico */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                        <PillIcon
                          size={20}
                          weight="bold"
                          className="text-white"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-300">
                        Prontuário Psiquiátrico
                      </h3>
                    </div>
                    <ul className="space-y-3 text-sm text-purple-800 dark:text-purple-300">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Contém:</strong> Avaliação clínica completa,
                          prescrições médicas, documentos especializados
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Receitas médicas:</strong> Branca (download),
                          Amarela/Azul (enviadas pelos correios)
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Rastreamento:</strong> Código dos correios
                          para acompanhar receitas controladas
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Medicamentos:</strong> Controle total das
                          prescrições e histórico medicamentoso
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Como visualizar */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <EyeIcon
                          size={20}
                          weight="bold"
                          className="text-white"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-green-900 dark:text-green-300">
                        Como Visualizar
                      </h3>
                    </div>
                    <ul className="space-y-3 text-sm text-green-800 dark:text-green-300">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Botão &quot;Visualizar&quot;:</strong> Clique
                          para abrir modal com todos os detalhes do prontuário
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Informações completas:</strong> Data,
                          profissional, sintomas, diagnóstico e tratamento
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Download PDF:</strong> Baixe uma versão
                          completa do prontuário para seus arquivos
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Organização:</strong> Tabs separadas para
                          prontuários psicológicos e psiquiátricos
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Tipos de receita */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <PackageIcon
                          size={20}
                          weight="bold"
                          className="text-white"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-300">
                        Tipos de Receita
                      </h3>
                    </div>
                    <ul className="space-y-3 text-sm text-yellow-800 dark:text-yellow-300">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Receita Branca:</strong> Download direto
                          disponível - medicamentos de uso comum
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Receita Amarela:</strong> Enviada por correios
                          com código de rastreamento (A1/A2)
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Receita Azul:</strong> Enviada por correios
                          com código de rastreamento (A3)
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong>Botão &quot;Rastrear&quot;:</strong> Acompanhe
                          a entrega das receitas controladas pelos correios
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Seção adicional - Dicas importantes */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <DiamondIcon
                      size={20}
                      weight="bold"
                      className="text-blue-500"
                    />
                    Dicas Importantes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-slate-300">
                          <strong>Histórico completo:</strong> Todos os
                          prontuários ficam salvos permanentemente
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-slate-300">
                          <strong>Documentos seguros:</strong> Acesso exclusivo
                          com sua conta protegida
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-slate-300">
                          <strong>Atualização automática:</strong> Novos
                          prontuários aparecem após as consultas
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-slate-300">
                          <strong>Download offline:</strong> Baixe PDFs para
                          acessar sem internet
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button
                    variant="primary.regular"
                    size="md"
                    onClick={() => setShowHelpModal(false)}
                    className="hover:scale-105 transition-transform duration-150"
                  >
                    Entendi, obrigado!
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Visualização */}
      <AnimatePresence>
        {selectedProntuario && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                      selectedProntuario.medical.type === "psychologist"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                        : "bg-gradient-to-br from-purple-500 to-purple-600"
                    }`}
                  >
                    {selectedProntuario.medical.type === "psychologist" ? (
                      <HeartIcon
                        size={20}
                        weight="bold"
                        className="text-white"
                      />
                    ) : (
                      <PillIcon
                        size={20}
                        weight="bold"
                        className="text-white"
                      />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Prontuário{" "}
                      {selectedProntuario.medical.type === "psychologist"
                        ? "Psicológico"
                        : "Psiquiátrico"}
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400 flex items-center gap-2">
                      <UserIcon size={14} weight="bold" />
                      {selectedProntuario.medical.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors duration-150 hover:scale-105"
                >
                  <XIcon
                    size={20}
                    className="text-gray-500 dark:text-slate-400"
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Informações Gerais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <CalendarCheckIcon size={16} weight="bold" />
                      Data da Consulta
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300">
                      {formatDate(selectedProntuario.appointmentDateTime).dia}{" "}
                      de{" "}
                      {
                        formatDate(selectedProntuario.appointmentDateTime)
                          .nomeMes
                      }{" "}
                      de{" "}
                      {new Date(
                        selectedProntuario.appointmentDateTime
                      ).getFullYear()}{" "}
                      às{" "}
                      {
                        formatDate(selectedProntuario.appointmentDateTime)
                          .horario
                      }
                    </p>
                  </div>

                  {selectedProntuario.details.nextAppointment && (
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-2">
                        <CalendarCheckIcon size={16} weight="bold" />
                        Próxima Consulta
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300">
                        {
                          formatDate(selectedProntuario.details.nextAppointment)
                            .dia
                        }{" "}
                        de{" "}
                        {
                          formatDate(selectedProntuario.details.nextAppointment)
                            .nomeMes
                        }{" "}
                        às{" "}
                        {
                          formatDate(selectedProntuario.details.nextAppointment)
                            .horario
                        }
                      </p>
                    </div>
                  )}
                </div>

                {/* Descrição */}
                <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileTextIcon size={16} weight="bold" />
                    Descrição da Consulta
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                    {selectedProntuario.description}
                  </p>
                </div>

                {/* Detalhes Clínicos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sintomas */}
                  <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-4">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-400 mb-3 flex items-center gap-2">
                      <DiamondIcon size={16} weight="bold" />
                      Sintomas Observados
                    </h3>
                    <div className="space-y-2">
                      {selectedProntuario.details.symptoms.map(
                        (symptom, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-orange-800 dark:text-orange-300 text-sm">
                              {symptom}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Diagnóstico */}
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4">
                    <h3 className="font-semibold text-green-900 dark:text-green-400 mb-3 flex items-center gap-2">
                      <ClipboardTextIcon size={16} weight="bold" />
                      Diagnóstico
                    </h3>
                    <p className="text-green-800 dark:text-green-300 text-sm font-medium">
                      {selectedProntuario.details.diagnosis}
                    </p>
                  </div>
                </div>

                {/* Tratamento */}
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-400 mb-3 flex items-center gap-2">
                    <HeartIcon size={16} weight="bold" />
                    Plano de Tratamento
                  </h3>
                  <p className="text-purple-800 dark:text-purple-300 text-sm">
                    {selectedProntuario.details.treatment}
                  </p>
                </div>

                {/* Observações */}
                <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileTextIcon size={16} weight="bold" />
                    Observações Clínicas
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300 text-sm">
                    {selectedProntuario.details.notes}
                  </p>
                </div>

                {/* Receitas e Documentos */}
                {selectedProntuario.combinedDocuments.length > 0 && (
                  <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <PaperclipIcon size={16} weight="bold" />
                      {selectedProntuario.medical.type === "psychologist" ? (
                        <>
                          Documentos (
                          {
                            selectedProntuario.combinedDocuments.filter(
                              (doc) => doc.type === "documento"
                            ).length
                          }
                          )
                        </>
                      ) : (
                        <>
                          Receitas e Documentos (
                          {selectedProntuario.combinedDocuments.length})
                        </>
                      )}
                    </h3>

                    {/* Separar receitas e documentos - Receitas apenas para consultas psiquiátricas */}
                    {selectedProntuario.medical.type === "psychiatrist" &&
                      selectedProntuario.combinedDocuments.filter(
                        (doc) => doc.type === "receita"
                      ).length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-800 dark:text-slate-300 mb-3 flex items-center gap-2">
                            <PillIcon size={14} weight="bold" />
                            Receitas (
                            {
                              selectedProntuario.combinedDocuments.filter(
                                (doc) => doc.type === "receita"
                              ).length
                            }
                            )
                          </h4>
                          <div className="space-y-3">
                            {selectedProntuario.combinedDocuments
                              .filter((doc) => doc.type === "receita")
                              .map(renderDocumentItem)}
                          </div>
                        </div>
                      )}

                    {selectedProntuario.combinedDocuments.filter(
                      (doc) => doc.type === "documento"
                    ).length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-slate-300 mb-3 flex items-center gap-2">
                          <FileTextIcon size={14} weight="bold" />
                          Documentos (
                          {
                            selectedProntuario.combinedDocuments.filter(
                              (doc) => doc.type === "documento"
                            ).length
                          }
                          )
                        </h4>
                        <div className="space-y-3">
                          {selectedProntuario.combinedDocuments
                            .filter((doc) => doc.type === "documento")
                            .map(renderDocumentItem)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
