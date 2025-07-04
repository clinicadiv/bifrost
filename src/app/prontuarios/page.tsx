"use client";

import { Button } from "@/components";
import { MedicalRecord } from "@/types";
import { formatDate } from "@/utils";
import {
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
  UserIcon,
  WarningIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  fileSize: string;
  url: string;
  type: "documento" | "receita";
  recipeType?: "branca" | "amarela" | "azul";
  trackingCode?: string;
}

interface ExtendedMedicalRecord extends MedicalRecord {
  documents: Document[];
  details: {
    symptoms: string[];
    diagnosis: string;
    treatment: string;
    nextAppointment?: string;
    notes: string;
  };
}

const PRONTUARIOS_PSICOLOGICOS: ExtendedMedicalRecord[] = [
  {
    id: "1",
    created_at: "2025-03-15T10:30:00.000Z",
    professional: "Dra. Ana Costa",
    type: "Psicológico",
    description:
      "Sessão de terapia cognitivo-comportamental focada em ansiedade generalizada. Paciente apresentou melhora significativa nos sintomas de ansiedade após aplicação das técnicas de respiração e reestruturação cognitiva.",
    documents: [
      {
        id: "d1",
        name: "Exercícios de Respiração - Manual TCC",
        uploadDate: "2025-03-15T10:35:00.000Z",
        fileSize: "1.2 MB",
        url: "/documents/exercicios-respiracao.pdf",
        type: "documento",
      },
      {
        id: "r1",
        name: "Receita de Ansiolítico - Clonazepam 0,5mg",
        uploadDate: "2025-03-15T10:40:00.000Z",
        fileSize: "245 KB",
        url: "/recipes/clonazepam-05mg.pdf",
        type: "receita",
        recipeType: "branca",
      },
    ],
    details: {
      symptoms: [
        "Ansiedade generalizada",
        "Palpitações",
        "Insônia",
        "Tensão muscular",
      ],
      diagnosis: "Transtorno de Ansiedade Generalizada (CID F41.1)",
      treatment:
        "Terapia cognitivo-comportamental semanal com técnicas de respiração e reestruturação cognitiva",
      nextAppointment: "2025-03-22T10:30:00.000Z",
      notes:
        "Paciente demonstrou boa adesão às técnicas propostas. Apresentou redução significativa dos sintomas ansiosos após 4 sessões.",
    },
  },
  {
    id: "2",
    created_at: "2025-03-08T14:00:00.000Z",
    professional: "Dr. Guilherme Oliveira",
    type: "Psicológico",
    description:
      "Avaliação psicológica inicial. Identificados traços de ansiedade social e dificuldades de relacionamento interpessoal. Recomendado acompanhamento terapêutico semanal.",
    documents: [
      {
        id: "d2",
        name: "Relatório de Avaliação Psicológica",
        uploadDate: "2025-03-08T14:15:00.000Z",
        fileSize: "2.1 MB",
        url: "/documents/relatorio-avaliacao.pdf",
        type: "documento",
      },
      {
        id: "r2",
        name: "Receita de Antidepressivo - Paroxetina 20mg",
        uploadDate: "2025-03-08T14:20:00.000Z",
        fileSize: "198 KB",
        url: "/recipes/paroxetina-20mg.pdf",
        type: "receita",
        recipeType: "amarela",
        trackingCode: "BR123456789BR",
      },
    ],
    details: {
      symptoms: [
        "Ansiedade social",
        "Dificuldades interpessoais",
        "Baixa autoestima",
        "Evitação social",
      ],
      diagnosis: "Transtorno de Ansiedade Social (CID F40.1)",
      treatment:
        "Terapia cognitivo-comportamental com foco em habilidades sociais e exposição gradual",
      nextAppointment: "2025-03-15T14:00:00.000Z",
      notes:
        "Primeira sessão de avaliação. Paciente apresentou boa colaboração durante os testes. Recomendado início imediato do tratamento.",
    },
  },
  {
    id: "3",
    created_at: "2025-02-28T09:15:00.000Z",
    professional: "Dra. Sofia Martins",
    type: "Psicológico",
    description:
      "Sessão de terapia de casal. Trabalhada comunicação assertiva e resolução de conflitos. Aplicadas técnicas de escuta ativa e expressão de sentimentos.",
    documents: [
      {
        id: "d3",
        name: "Exercícios de Comunicação para Casais",
        uploadDate: "2025-02-28T09:30:00.000Z",
        fileSize: "1.8 MB",
        url: "/documents/exercicios-comunicacao-casal.pdf",
        type: "documento",
      },
      {
        id: "d4",
        name: "Técnicas de Resolução de Conflitos",
        uploadDate: "2025-02-28T09:35:00.000Z",
        fileSize: "1.1 MB",
        url: "/documents/resolucao-conflitos.pdf",
        type: "documento",
      },
      {
        id: "r3",
        name: "Receita de Relaxante Muscular - Ciclobenzaprina 10mg",
        uploadDate: "2025-02-28T09:40:00.000Z",
        fileSize: "187 KB",
        url: "/recipes/ciclobenzaprina-10mg.pdf",
        type: "receita",
        recipeType: "azul",
        trackingCode: "",
      },
    ],
    details: {
      symptoms: [
        "Conflitos constantes",
        "Comunicação ineficaz",
        "Distanciamento emocional",
        "Frustração mútua",
      ],
      diagnosis: "Disfunção relacional - Terapia de casal",
      treatment:
        "Terapia de casal com foco em comunicação assertiva e resolução de conflitos",
      nextAppointment: "2025-03-07T09:15:00.000Z",
      notes:
        "Casal demonstrou interesse em melhorar a comunicação. Ambos se comprometeram com os exercícios propostos.",
    },
  },
  {
    id: "4",
    created_at: "2025-02-20T16:45:00.000Z",
    professional: "Dr. Carlos Silva",
    type: "Psicológico",
    description:
      "Atendimento focado em depressão pós-parto. Paciente demonstrou progressos na aceitação da nova rotina e desenvolvimento do vínculo materno-infantil.",
    documents: [
      {
        id: "d5",
        name: "Guia de Apoio - Depressão Pós-Parto",
        uploadDate: "2025-02-20T17:00:00.000Z",
        fileSize: "3.2 MB",
        url: "/documents/guia-depressao-pos-parto.pdf",
        type: "documento",
      },
      {
        id: "r4",
        name: "Receita de Antidepressivo - Sertralina 50mg",
        uploadDate: "2025-02-20T17:05:00.000Z",
        fileSize: "201 KB",
        url: "/recipes/sertralina-50mg.pdf",
        type: "receita",
        recipeType: "branca",
      },
    ],
    details: {
      symptoms: [
        "Tristeza persistente",
        "Dificuldades com o bebê",
        "Fadiga extrema",
        "Sentimentos de inadequação",
      ],
      diagnosis: "Episódio Depressivo Pós-Parto (CID F53.0)",
      treatment:
        "Psicoterapia de apoio com foco no vínculo materno-infantil e manejo dos sintomas depressivos",
      nextAppointment: "2025-02-27T16:45:00.000Z",
      notes:
        "Paciente apresentou melhora significativa no humor e maior confiança nos cuidados com o bebê.",
    },
  },
  {
    id: "5",
    created_at: "2025-02-10T11:00:00.000Z",
    professional: "Dra. Ana Costa",
    type: "Psicológico",
    description:
      "Sessão de terapia comportamental para transtorno do pânico. Aplicadas técnicas de exposição gradual e controle de respiração. Paciente relatou redução na frequência dos ataques.",
    documents: [
      {
        id: "d6",
        name: "Protocolo de Controle de Pânico",
        uploadDate: "2025-02-10T11:20:00.000Z",
        fileSize: "1.5 MB",
        url: "/documents/protocolo-controle-panico.pdf",
        type: "documento",
      },
      {
        id: "r5",
        name: "Receita de Ansiolítico - Alprazolam 0,25mg",
        uploadDate: "2025-02-10T11:25:00.000Z",
        fileSize: "189 KB",
        url: "/recipes/alprazolam-025mg.pdf",
        type: "receita",
        recipeType: "amarela",
        trackingCode: "BR987654321BR",
      },
    ],
    details: {
      symptoms: [
        "Ataques de pânico",
        "Agorafobia",
        "Evitação de situações",
        "Sensações físicas intensas",
      ],
      diagnosis: "Transtorno de Pânico com Agorafobia (CID F40.01)",
      treatment:
        "Terapia comportamental com exposição gradual e técnicas de controle de respiração",
      nextAppointment: "2025-02-17T11:00:00.000Z",
      notes:
        "Redução significativa na frequência dos ataques de pânico. Paciente conseguiu sair de casa sozinha pela primeira vez em semanas.",
    },
  },
];

const PRONTUARIOS_PSIQUIATRICOS: ExtendedMedicalRecord[] = [
  {
    id: "6",
    created_at: "2025-03-12T08:30:00.000Z",
    professional: "Dr. Roberto Fernandes",
    type: "Psiquiátrico",
    description:
      "Consulta de acompanhamento para transtorno bipolar. Ajustada medicação (lítio 600mg) devido à estabilização do humor. Paciente apresenta aderência ao tratamento.",
    documents: [
      {
        id: "r6",
        name: "Receita - Lítio 600mg",
        uploadDate: "2025-03-12T08:45:00.000Z",
        fileSize: "245 KB",
        url: "/recipes/receita-litio-600mg.pdf",
        type: "receita",
        recipeType: "branca",
      },
      {
        id: "d7",
        name: "Guia de Monitoramento - Lítio",
        uploadDate: "2025-03-12T08:50:00.000Z",
        fileSize: "1.8 MB",
        url: "/documents/guia-monitoramento-litio.pdf",
        type: "documento",
      },
    ],
    details: {
      symptoms: [
        "Humor estável",
        "Sono regular",
        "Boa concentração",
        "Adesão medicamentosa",
      ],
      diagnosis: "Transtorno Bipolar Tipo I (CID F31.2)",
      treatment: "Lítio 600mg/dia + acompanhamento psiquiátrico mensal",
      nextAppointment: "2025-04-12T08:30:00.000Z",
      notes:
        "Paciente estável, com boa adesão ao tratamento. Exames laboratoriais dentro da normalidade.",
    },
  },
  {
    id: "7",
    created_at: "2025-03-05T13:20:00.000Z",
    professional: "Dra. Mariana Santos",
    type: "Psiquiátrico",
    description:
      "Avaliação psiquiátrica para transtorno de ansiedade generalizada. Prescrito escitalopram 10mg pela manhã. Orientações sobre efeitos colaterais e importância da adesão.",
    documents: [
      {
        id: "r7",
        name: "Receita - Escitalopram 10mg",
        uploadDate: "2025-03-05T13:35:00.000Z",
        fileSize: "198 KB",
        url: "/recipes/receita-escitalopram-10mg.pdf",
        type: "receita",
        recipeType: "azul",
        trackingCode: "",
      },
    ],
    details: {
      symptoms: [
        "Ansiedade excessiva",
        "Preocupações constantes",
        "Tensão muscular",
        "Dificuldades de concentração",
      ],
      diagnosis: "Transtorno de Ansiedade Generalizada (CID F41.1)",
      treatment: "Escitalopram 10mg pela manhã + psicoterapia",
      nextAppointment: "2025-03-19T13:20:00.000Z",
      notes:
        "Primeira prescrição. Orientado sobre início gradual dos efeitos e possíveis efeitos colaterais iniciais.",
    },
  },
  {
    id: "8",
    created_at: "2025-02-25T15:10:00.000Z",
    professional: "Dr. João Almeida",
    type: "Psiquiátrico",
    description:
      "Consulta de seguimento para episódio depressivo maior. Mantida sertralina 50mg. Paciente apresenta melhora do sono e apetite. Recomendado retorno em 4 semanas.",
    documents: [
      {
        id: "r8",
        name: "Receita - Sertralina 50mg",
        uploadDate: "2025-02-25T15:25:00.000Z",
        fileSize: "189 KB",
        url: "/recipes/receita-sertralina-50mg.pdf",
        type: "receita",
        recipeType: "branca",
      },
    ],
    details: {
      symptoms: [
        "Humor melhorado",
        "Sono restaurado",
        "Apetite normalizado",
        "Motivação aumentada",
      ],
      diagnosis: "Episódio Depressivo Maior (CID F32.1)",
      treatment: "Sertralina 50mg/dia + acompanhamento psiquiátrico",
      nextAppointment: "2025-03-25T15:10:00.000Z",
      notes:
        "Boa resposta ao tratamento. Sintomas depressivos em remissão. Manter dose atual.",
    },
  },
  {
    id: "9",
    created_at: "2025-02-18T10:00:00.000Z",
    professional: "Dra. Luciana Rocha",
    type: "Psiquiátrico",
    description:
      "Primeira consulta para investigação de sintomas psicóticos. Solicitados exames laboratoriais e neuroimagem. Iniciado risperidona 2mg à noite como medida profilática.",
    documents: [
      {
        id: "r9",
        name: "Receita - Risperidona 2mg",
        uploadDate: "2025-02-18T10:15:00.000Z",
        fileSize: "178 KB",
        url: "/recipes/receita-risperidona-2mg.pdf",
        type: "receita",
        recipeType: "amarela",
        trackingCode: "BR555666777BR",
      },
      {
        id: "d8",
        name: "Requisição de Exames",
        uploadDate: "2025-02-18T10:20:00.000Z",
        fileSize: "312 KB",
        url: "/documents/requisicao-exames.pdf",
        type: "documento",
      },
    ],
    details: {
      symptoms: [
        "Alucinações auditivas",
        "Delírios persecutórios",
        "Desorganização do pensamento",
        "Isolamento social",
      ],
      diagnosis: "Episódio Psicótico Agudo (CID F23.9)",
      treatment: "Risperidona 2mg/noite + investigação diagnóstica",
      nextAppointment: "2025-02-25T10:00:00.000Z",
      notes:
        "Primeira consulta psiquiátrica. Necessária investigação completa para diagnóstico diferencial.",
    },
  },
  {
    id: "10",
    created_at: "2025-02-05T14:30:00.000Z",
    professional: "Dr. Roberto Fernandes",
    type: "Psiquiátrico",
    description:
      "Consulta de emergência para crise de pânico. Administrado lorazepam 2mg sublingual. Paciente orientado sobre técnicas de manejo da ansiedade e agendamento de retorno.",
    documents: [
      {
        id: "r10",
        name: "Receita - Lorazepam 2mg",
        uploadDate: "2025-02-05T14:45:00.000Z",
        fileSize: "156 KB",
        url: "/recipes/receita-lorazepam-2mg.pdf",
        type: "receita",
        recipeType: "azul",
        trackingCode: "BR111222333BR",
      },
    ],
    details: {
      symptoms: [
        "Crise de pânico",
        "Palpitações",
        "Sudorese",
        "Sensação de morte iminente",
      ],
      diagnosis: "Transtorno de Pânico (CID F41.0)",
      treatment: "Lorazepam 2mg SOS + técnicas de manejo da ansiedade",
      nextAppointment: "2025-02-12T14:30:00.000Z",
      notes:
        "Atendimento de emergência. Paciente apresentou melhora após administração do medicamento.",
    },
  },
];

export default function Prontuarios() {
  const [selectedTab, setSelectedTab] = useState<
    "psicologico" | "psiquiatrico"
  >("psicologico");
  const [selectedProntuario, setSelectedProntuario] =
    useState<ExtendedMedicalRecord | null>(null);

  const handleVisualizarProntuario = (prontuario: ExtendedMedicalRecord) => {
    setSelectedProntuario(prontuario);
  };

  const handleCloseModal = () => {
    setSelectedProntuario(null);
  };

  const handleDownloadDocument = (document: Document) => {
    console.log(`Downloading document: ${document.name}`);
    // Implementar download real aqui
  };

  const handleTrackRecipe = (document: Document) => {
    if (document.trackingCode) {
      // Redirecionar para sistema de rastreamento dos correios
      window.open(
        `https://www.correios.com.br/rastreamento?codigo=${document.trackingCode}`,
        "_blank"
      );
    }
  };

  const renderProntuarioCard = (prontuario: ExtendedMedicalRecord) => {
    const { dia, horario, nomeMes } = formatDate(prontuario.created_at);
    const ano = new Date(prontuario.created_at).getFullYear();
    const isPsicologico = prontuario.type === "Psicológico";
    const totalDocuments = prontuario.documents.length;
    const receitas = prontuario.documents.filter(
      (doc) => doc.type === "receita"
    ).length;
    const documentos = prontuario.documents.filter(
      (doc) => doc.type === "documento"
    ).length;

    return (
      <div
        key={prontuario.id}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
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
                <h3 className="text-lg font-bold text-gray-900">
                  Prontuário {isPsicologico ? "Psicológico" : "Psiquiátrico"}
                </h3>
                <p className="text-gray-600 font-medium flex items-center gap-2">
                  <UserIcon size={14} weight="bold" />
                  {prontuario.professional}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {dia} {nomeMes} {ano}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <ClockIcon size={12} weight="bold" />
                {horario}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <FileTextIcon size={16} weight="bold" className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Descrição
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {prontuario.description}
            </p>
          </div>

          {/* Documents Count */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
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
                className="py-2 px-4"
                onClick={() => handleVisualizarProntuario(prontuario)}
              >
                Visualizar
              </Button>
              <Button
                variant="secondary.light"
                size="sm"
                icon={<DownloadIcon size={16} weight="bold" />}
                className="py-2 px-4"
              >
                Baixar PDF
              </Button>
            </div>
            <div
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isPsicologico
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {prontuario.type}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDocumentItem = (document: Document) => {
    const isRecipe = document.type === "receita";
    const isDocument = document.type === "documento";

    // Determinar cor do ícone e fundo baseado no tipo
    let iconColor = "text-gray-600";
    let bgColor = "bg-gray-100";
    let divBgColor = "bg-gray-50";

    if (isRecipe) {
      switch (document.recipeType) {
        case "branca":
          iconColor = "text-green-600";
          bgColor = "bg-green-100";
          divBgColor = "bg-green-50";
          break;
        case "amarela":
          iconColor = "text-yellow-600";
          bgColor = "bg-yellow-100";
          divBgColor = "bg-yellow-50";
          break;
        case "azul":
          iconColor = "text-blue-600";
          bgColor = "bg-blue-100";
          divBgColor = "bg-blue-50";
          break;
      }
    } else {
      iconColor = "text-gray-600";
      bgColor = "bg-gray-100";
      divBgColor = "bg-gray-50";
    }

    return (
      <div
        key={document.id}
        className={`flex items-center justify-between p-3 ${divBgColor} rounded-lg`}
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
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              {document.name}
            </h4>
            <p className="text-sm text-gray-500">
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
                  className={`${
                    document.recipeType === "amarela"
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-300"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300"
                  }`}
                >
                  Rastrear
                </Button>
              ) : (
                <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-lg">
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Meus Prontuários 📋
              </h1>
              <p className="text-gray-500 mt-1">
                Acompanhe seu histórico médico e evolução terapêutica
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 px-4 py-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <ChartBarIcon
                    size={20}
                    weight="bold"
                    className="text-blue-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      {PRONTUARIOS_PSICOLOGICOS.length +
                        PRONTUARIOS_PSIQUIATRICOS.length}{" "}
                      prontuários
                    </p>
                    <p className="text-xs text-blue-600">Total registrado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setSelectedTab("psicologico")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              selectedTab === "psicologico"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <HeartIcon size={18} weight="bold" />
              Psicológicos ({PRONTUARIOS_PSICOLOGICOS.length})
            </div>
          </button>
          <button
            onClick={() => setSelectedTab("psiquiatrico")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              selectedTab === "psiquiatrico"
                ? "bg-purple-500 text-white shadow-lg shadow-purple-200"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <PillIcon size={18} weight="bold" />
              Psiquiátricos ({PRONTUARIOS_PSIQUIATRICOS.length})
            </div>
          </button>
        </div>

        {/* Content - 3 columns grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {selectedTab === "psicologico"
            ? PRONTUARIOS_PSICOLOGICOS.map(renderProntuarioCard)
            : PRONTUARIOS_PSIQUIATRICOS.map(renderProntuarioCard)}
        </div>

        {/* Empty State */}
        {((selectedTab === "psicologico" &&
          PRONTUARIOS_PSICOLOGICOS.length === 0) ||
          (selectedTab === "psiquiatrico" &&
            PRONTUARIOS_PSIQUIATRICOS.length === 0)) && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileTextIcon size={40} weight="bold" className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum prontuário encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              Seus prontuários{" "}
              {selectedTab === "psicologico" ? "psicológicos" : "psiquiátricos"}{" "}
              aparecerão aqui após suas consultas.
            </p>
            <Button variant="primary.regular" size="md">
              Agendar Consulta
            </Button>
          </div>
        )}
      </div>

      {/* Modal de Visualização */}
      {selectedProntuario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                    selectedProntuario.type === "Psicológico"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600"
                      : "bg-gradient-to-br from-purple-500 to-purple-600"
                  }`}
                >
                  {selectedProntuario.type === "Psicológico" ? (
                    <HeartIcon size={20} weight="bold" className="text-white" />
                  ) : (
                    <PillIcon size={20} weight="bold" className="text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Prontuário {selectedProntuario.type}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <UserIcon size={14} weight="bold" />
                    {selectedProntuario.professional}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XIcon size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CalendarCheckIcon size={16} weight="bold" />
                    Data da Consulta
                  </h3>
                  <p className="text-gray-600">
                    {formatDate(selectedProntuario.created_at).dia} de{" "}
                    {formatDate(selectedProntuario.created_at).nomeMes} de{" "}
                    {new Date(selectedProntuario.created_at).getFullYear()} às{" "}
                    {formatDate(selectedProntuario.created_at).horario}
                  </p>
                </div>

                {selectedProntuario.details.nextAppointment && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <CalendarCheckIcon size={16} weight="bold" />
                      Próxima Consulta
                    </h3>
                    <p className="text-blue-700">
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
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileTextIcon size={16} weight="bold" />
                  Descrição da Consulta
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedProntuario.description}
                </p>
              </div>

              {/* Detalhes Clínicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sintomas */}
                <div className="bg-orange-50 rounded-xl p-4">
                  <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <DiamondIcon size={16} weight="bold" />
                    Sintomas Observados
                  </h3>
                  <div className="space-y-2">
                    {selectedProntuario.details.symptoms.map(
                      (symptom, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-orange-800 text-sm">
                            {symptom}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Diagnóstico */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <ClipboardTextIcon size={16} weight="bold" />
                    Diagnóstico
                  </h3>
                  <p className="text-green-800 text-sm font-medium">
                    {selectedProntuario.details.diagnosis}
                  </p>
                </div>
              </div>

              {/* Tratamento */}
              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <HeartIcon size={16} weight="bold" />
                  Plano de Tratamento
                </h3>
                <p className="text-purple-800 text-sm">
                  {selectedProntuario.details.treatment}
                </p>
              </div>

              {/* Observações */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileTextIcon size={16} weight="bold" />
                  Observações Clínicas
                </h3>
                <p className="text-gray-600 text-sm">
                  {selectedProntuario.details.notes}
                </p>
              </div>

              {/* Receitas e Documentos */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PaperclipIcon size={16} weight="bold" />
                  Receitas e Documentos ({selectedProntuario.documents.length})
                </h3>

                {/* Separar receitas e documentos */}
                {selectedProntuario.documents.filter(
                  (doc) => doc.type === "receita"
                ).length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <PillIcon size={14} weight="bold" />
                      Receitas (
                      {
                        selectedProntuario.documents.filter(
                          (doc) => doc.type === "receita"
                        ).length
                      }
                      )
                    </h4>
                    <div className="space-y-3">
                      {selectedProntuario.documents
                        .filter((doc) => doc.type === "receita")
                        .map(renderDocumentItem)}
                    </div>
                  </div>
                )}

                {selectedProntuario.documents.filter(
                  (doc) => doc.type === "documento"
                ).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <FileTextIcon size={14} weight="bold" />
                      Documentos (
                      {
                        selectedProntuario.documents.filter(
                          (doc) => doc.type === "documento"
                        ).length
                      }
                      )
                    </h4>
                    <div className="space-y-3">
                      {selectedProntuario.documents
                        .filter((doc) => doc.type === "documento")
                        .map(renderDocumentItem)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
