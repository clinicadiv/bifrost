"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useAuthStore } from "@/hooks/useAuthStore";
import { getUserAddresses } from "@/services/http/addresses";
import { Address, ServiceType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Lock, MapPin, Plus } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AddressFormModal } from "./AddressFormModal";
import { DocumentUpload } from "./DocumentUpload";

// Função para aplicar máscara de telefone
const applyPhoneMask = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const cleanValue = value.replace(/\D/g, "");

  // Aplica a máscara baseada no comprimento
  if (cleanValue.length <= 10) {
    // Telefone fixo: (11) 9999-9999
    return cleanValue
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    // Celular: (11) 99999-9999
    return cleanValue
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15); // Limita o tamanho máximo
  }
};

// Função para aplicar máscara de CPF
const applyCPFMask = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const cleanValue = value.replace(/\D/g, "");

  // Máscara de CPF: 000.000.000-00
  return cleanValue
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .slice(0, 14); // Limita o tamanho máximo (XXX.XXX.XXX-XX)
};

// Schema base para dados pessoais
const basePersonalDataSchema = z.object({
  fullName: z.string().min(2, "Nome completo deve ter pelo menos 2 caracteres"),
  cpf: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(11, "CPF deve ter 11 dígitos"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
});

// Schema adicional para consultas psiquiátricas
const psychiatricDataSchema = z.object({
  age: z.string().min(1, "Idade é obrigatória"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  reasonForConsultation: z
    .string()
    .min(5, "Descreva o histórico médico psiquiátrico"),
  previousHistory: z.string().min(5, "Descreva o histórico médico pregresso"),
  mainComplaint: z.string().min(5, "Liste as medicações de uso contínuo"),
  allergies: z.string().optional(),
  addressId: z.string().optional(),
  psychiatricPathologies: z.string().optional(),
  medicalConditions: z.string().optional(),
  additionalInfo: z.string().optional(),
  symptoms: z.object({
    sadness: z.number().min(0).max(3),
    inattention: z.number().min(0).max(3),
    worry: z.number().min(0).max(3),
    irritation: z.number().min(0).max(3),
    fatigue: z.number().min(0).max(3),
    insomnia: z.number().min(0).max(3),
    hallucination: z.number().min(0).max(3),
  }),
});

// Schema condicional
const createPersonalDataSchema = (serviceType?: ServiceType) => {
  if (serviceType === "psychiatrist") {
    return basePersonalDataSchema.merge(psychiatricDataSchema);
  }
  return basePersonalDataSchema;
};

export type PersonalDataProps = z.infer<typeof basePersonalDataSchema> &
  Partial<z.infer<typeof psychiatricDataSchema>>;

// Tipo específico para os caminhos dos campos de sintomas
type SymptomFieldPath =
  | "symptoms.sadness"
  | "symptoms.inattention"
  | "symptoms.worry"
  | "symptoms.irritation"
  | "symptoms.fatigue"
  | "symptoms.insomnia"
  | "symptoms.hallucination";

interface StepFiveProps {
  serviceType?: ServiceType;
  onDataChange?: (data: PersonalDataProps) => void;
  initialData?: Partial<PersonalDataProps>;
  onLoginClick?: () => void;
  onDocumentsChange?: (files: File[]) => void;
}

export const StepFive = ({
  serviceType,
  onDataChange,
  initialData,
  onLoginClick,
  onDocumentsChange,
}: StepFiveProps) => {
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const token = useAuthStore((state) => state.token);

  const isPsychiatric = serviceType === "psychiatrist";

  // Estados para gerenciamento de endereços
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(false);

  // Ref para controlar se os dados já foram processados
  const lastProcessedDataRef = useRef<string>("");

  // Verificar se o usuário está logado e extrair dados
  const isUserLoggedIn = !!user;
  const userData = user;

  // Sincronizar selectedAddressId com initialData quando disponível
  useEffect(() => {
    if (initialData?.addressId && isPsychiatric) {
      setSelectedAddressId(initialData.addressId);
    }
  }, [initialData?.addressId, isPsychiatric]);

  // Preparar dados iniciais (prioridade: dados do usuário logado > initialData)
  const getInitialData = () => {
    const baseData = {
      fullName: "",
      cpf: "",
      email: "",
      phone: "",
    };

    const psychiatricData = isPsychiatric
      ? {
          age: "",
          birthDate: "",
          reasonForConsultation: "",
          previousHistory: "",
          mainComplaint: "",
          allergies: "",
          addressId: "",
          psychiatricPathologies: "",
          medicalConditions: "",
          additionalInfo: "",
          symptoms: {
            sadness: 0,
            inattention: 0,
            worry: 0,
            irritation: 0,
            fatigue: 0,
            insomnia: 0,
            hallucination: 0,
          },
        }
      : {};

    if (isUserLoggedIn && userData) {
      baseData.fullName = userData.name || "";
      baseData.cpf = userData.document || "";
      baseData.email = userData.email || "";
      baseData.phone = userData.phone || "";
    }

    return {
      ...baseData,
      ...psychiatricData,
      ...initialData,
    };
  };

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset, // Adicionando reset
  } = useForm<PersonalDataProps>({
    mode: "onChange",
    resolver: zodResolver(createPersonalDataSchema(serviceType)),
    defaultValues: getInitialData(),
  });

  // Função para buscar endereços do usuário
  const fetchUserAddresses = useCallback(async () => {
    if (!isUserLoggedIn || !userData?.id || !token || !isPsychiatric) return;

    setAddressesLoading(true);
    try {
      const response = await getUserAddresses(userData.id, token);
      if (response.success) {
        setUserAddresses(response.data.addresses);
        // Só seleciona o endereço padrão se não há um selectedAddressId já definido nos dados iniciais
        if (!initialData?.addressId) {
          const defaultAddress = response.data.addresses.find(
            (addr: any) => addr.isDefault
          );
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            setValue("addressId", defaultAddress.id);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
      setUserAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  }, [
    isUserLoggedIn,
    userData?.id,
    token,
    isPsychiatric,
    initialData?.addressId,
    setValue,
  ]);

  // Buscar endereços quando o componente monta ou quando o usuário muda
  useEffect(() => {
    if (isPsychiatric && isUserLoggedIn) {
      fetchUserAddresses();
    }
  }, [isPsychiatric, isUserLoggedIn, userData?.id, token, fetchUserAddresses]);

  // Watch é usado no useEffect abaixo

  // Watch específico para sintomas
  const symptomsValues = watch("symptoms");

  // Atualizar valores quando user mudar (caso faça login durante o processo)
  useEffect(() => {
    if (isUserLoggedIn && userData) {
      setValue("fullName", userData.name || "");
      setValue("cpf", userData.document || "");
      setValue("email", userData.email || "");
      setValue("phone", userData.phone || "");
    }
  }, [isUserLoggedIn, userData, setValue]);

  // NOVA ABORDAGEM: Usar reset() quando initialData mudar significativamente
  useEffect(() => {
    // Criar uma chave única para os dados atuais
    const currentDataKey = JSON.stringify({
      age: initialData?.age,
      birthDate: initialData?.birthDate,
      reasonForConsultation: initialData?.reasonForConsultation,
      addressId: initialData?.addressId,
    });

    // Só aplicar reset se:
    // 1. Temos initialData
    // 2. É consulta psiquiátrica
    // 3. Temos dados psiquiátricos reais (age existe = dados da API)
    // 4. Os dados mudaram desde a última vez
    if (
      initialData &&
      isPsychiatric &&
      (initialData.age || initialData.birthDate) &&
      lastProcessedDataRef.current !== currentDataKey
    ) {
      lastProcessedDataRef.current = currentDataKey;

      // Reset TODOS os valores de uma vez (método recomendado do React Hook Form)
      const resetData = {
        // Dados básicos
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        cpf: initialData.cpf || "",
        phone: initialData.phone || "",

        // Dados psiquiátricos
        age: initialData.age || "",
        birthDate: initialData.birthDate || "",
        reasonForConsultation: initialData.reasonForConsultation || "",
        previousHistory: initialData.previousHistory || "",
        mainComplaint: initialData.mainComplaint || "",
        allergies: initialData.allergies || "",
        addressId: initialData.addressId || "",
        psychiatricPathologies: initialData.psychiatricPathologies || "",
        medicalConditions: initialData.medicalConditions || "",
        additionalInfo: initialData.additionalInfo || "",

        // Sintomas mantidos como números para o schema
        symptoms: {
          sadness: initialData.symptoms?.sadness || 0,
          inattention: initialData.symptoms?.inattention || 0,
          worry: initialData.symptoms?.worry || 0,
          irritation: initialData.symptoms?.irritation || 0,
          fatigue: initialData.symptoms?.fatigue || 0,
          insomnia: initialData.symptoms?.insomnia || 0,
          hallucination: initialData.symptoms?.hallucination || 0,
        },
      };

      reset(resetData);
    }
  }, [initialData, isPsychiatric, reset]);

  // Enviar dados quando houver mudanças (com debounce implícito)
  useEffect(() => {
    const subscription = watch((value) => {
      if (onDataChange) {
        // Garantir que campos opcionais nunca sejam null/undefined
        const sanitizedValue = {
          ...value,
          allergies: value.allergies || "",
          addressId: value.addressId || "",
          psychiatricPathologies: value.psychiatricPathologies || "",
          medicalConditions: value.medicalConditions || "",
          additionalInfo: value.additionalInfo || "",
          symptoms: value.symptoms
            ? {
                sadness: value.symptoms.sadness || 0,
                inattention: value.symptoms.inattention || 0,
                worry: value.symptoms.worry || 0,
                irritation: value.symptoms.irritation || 0,
                fatigue: value.symptoms.fatigue || 0,
                insomnia: value.symptoms.insomnia || 0,
                hallucination: value.symptoms.hallucination || 0,
              }
            : {
                sadness: 0,
                inattention: 0,
                worry: 0,
                irritation: 0,
                fatigue: 0,
                insomnia: 0,
                hallucination: 0,
              },
        };
        onDataChange(sanitizedValue as PersonalDataProps);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

  // Enviar dados iniciais uma vez
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDataChange) {
        const values = getValues();
        // Garantir que campos opcionais nunca sejam null/undefined nos dados iniciais
        const sanitizedValues = {
          ...values,
          allergies: values.allergies || "",
          addressId: values.addressId || "",
          psychiatricPathologies: values.psychiatricPathologies || "",
          medicalConditions: values.medicalConditions || "",
          additionalInfo: values.additionalInfo || "",
          symptoms: values.symptoms
            ? {
                sadness: values.symptoms.sadness || 0,
                inattention: values.symptoms.inattention || 0,
                worry: values.symptoms.worry || 0,
                irritation: values.symptoms.irritation || 0,
                fatigue: values.symptoms.fatigue || 0,
                insomnia: values.symptoms.insomnia || 0,
                hallucination: values.symptoms.hallucination || 0,
              }
            : {
                sadness: 0,
                inattention: 0,
                worry: 0,
                irritation: 0,
                fatigue: 0,
                insomnia: 0,
                hallucination: 0,
              },
        };
        onDataChange(sanitizedValues);
      }
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas uma vez na montagem

  const symptomLabels = [
    { key: "sadness", label: "Tristeza" },
    { key: "inattention", label: "Desatenção" },
    { key: "worry", label: "Preocupação" },
    { key: "irritation", label: "Irritação" },
    { key: "fatigue", label: "Cansaço" },
    { key: "insomnia", label: "Insônia" },
    { key: "hallucination", label: "Alucinação" },
  ];

  const renderSymptomScale = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Escala de Sintomas <span className="text-red-500">*</span>
          </label>
          <p
            className={`text-xs ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Na última semana, com que frequência você apresentou os seguintes
            sintomas?
            <br />
            <strong>
              0 = ausente | 1 = alguns dias | 2 = quase todos os dias | 3 =
              todos os dias
            </strong>
          </p>
        </div>

        <div
          className={`border rounded-lg overflow-hidden ${
            theme === "dark" ? "border-gray-600" : "border-gray-300"
          }`}
        >
          {/* Header da tabela */}
          <div
            className={`grid grid-cols-6 ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <div
              className={`p-3 font-medium text-sm ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } col-span-2`}
            >
              Sintoma
            </div>
            {[0, 1, 2, 3].map((value) => (
              <div
                key={value}
                className={`p-3 font-medium text-sm text-center ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                } border-l ${
                  theme === "dark" ? "border-gray-600" : "border-gray-200"
                }`}
              >
                {value}
              </div>
            ))}
          </div>

          {/* Linhas dos sintomas */}
          {symptomLabels.map((symptom, index) => (
            <div
              key={symptom.key}
              className={`grid grid-cols-6 ${
                index % 2 === 0
                  ? theme === "dark"
                    ? "bg-gray-900/50"
                    : "bg-white"
                  : theme === "dark"
                  ? "bg-gray-800/50"
                  : "bg-gray-50/50"
              }`}
            >
              <div
                className={`p-3 font-medium text-sm col-span-2 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {symptom.label}
              </div>
              {[0, 1, 2, 3].map((value) => (
                <div
                  key={value}
                  className={`p-3 text-center border-l ${
                    theme === "dark" ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name={`symptoms.${symptom.key}`}
                    value={value.toString()}
                    checked={
                      symptomsValues?.[
                        symptom.key as keyof typeof symptomsValues
                      ] === value
                    }
                    onChange={(e) => {
                      const numericValue = parseInt(e.target.value);
                      const fieldPath =
                        `symptoms.${symptom.key}` as SymptomFieldPath;
                      setValue(fieldPath, numericValue);
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div
        className={`${
          theme === "dark"
            ? "bg-blue-900/30 border-blue-700"
            : "bg-blue-50 border-blue-200"
        } border rounded-lg p-4`}
      >
        <h3
          className={`font-semibold ${
            theme === "dark" ? "text-blue-400" : "text-blue-800"
          } mb-2`}
        >
          {isPsychiatric ? "Dados Pessoais e Médicos" : "Dados Pessoais"}
        </h3>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-blue-300" : "text-blue-600"
          }`}
        >
          {isUserLoggedIn
            ? "Seus dados foram preenchidos automaticamente da sua conta"
            : isPsychiatric
            ? "Preencha seus dados pessoais e informações médicas para a consulta psiquiátrica"
            : "Preencha seus dados pessoais para finalizar o agendamento"}
        </p>
      </div>

      {/* Indicador de dados preenchidos automaticamente */}
      {isUserLoggedIn && (
        <div
          className={`${
            theme === "dark"
              ? "bg-green-900/30 border-green-700"
              : "bg-green-50 border-green-200"
          } border rounded-lg p-4`}
        >
          <div className="flex items-center gap-3">
            <Check
              size={20}
              className={`${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-green-300" : "text-green-800"
                }`}
              >
                Dados preenchidos automaticamente
              </p>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                } mt-1`}
              >
                Seus dados pessoais foram carregados da sua conta. Os campos
                foram bloqueados para segurança.
              </p>
            </div>
          </div>
        </div>
      )}

      <form className="flex flex-col gap-6 px-1">
        {/* Dados Pessoais Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome completo */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="fullName"
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } flex items-center gap-2`}
            >
              Nome completo <span className="text-red-500">*</span>
              {isUserLoggedIn && (
                <Lock
                  size={14}
                  className={`${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              )}
            </label>
            <input
              {...register("fullName")}
              id="fullName"
              type="text"
              placeholder="Digite seu nome completo"
              readOnly={isUserLoggedIn}
              disabled={isUserLoggedIn}
              className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.fullName
                  ? "border-red-500"
                  : theme === "dark"
                  ? "border-gray-600"
                  : "border-gray-300"
              } ${
                isUserLoggedIn
                  ? theme === "dark"
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-50 text-gray-700 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-200"
                  : "bg-white text-gray-900"
              }`}
            />
            {errors.fullName && (
              <span className="text-sm text-red-500">
                {errors.fullName.message}
              </span>
            )}
          </div>

          {/* CPF */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="cpf"
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } flex items-center gap-2`}
            >
              CPF <span className="text-red-500">*</span>
              {isUserLoggedIn && (
                <Lock
                  size={14}
                  className={`${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              )}
            </label>
            <input
              {...register("cpf", {
                onChange: (e) => {
                  const maskedValue = applyCPFMask(e.target.value);
                  const cleanCPF = maskedValue.replace(/\D/g, "");
                  e.target.value = maskedValue;
                  setValue("cpf", cleanCPF, { shouldValidate: true });
                },
              })}
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              readOnly={isUserLoggedIn}
              disabled={isUserLoggedIn}
              className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.cpf
                  ? "border-red-500"
                  : theme === "dark"
                  ? "border-gray-600"
                  : "border-gray-300"
              } ${
                isUserLoggedIn
                  ? theme === "dark"
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-50 text-gray-700 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-200"
                  : "bg-white text-gray-900"
              }`}
            />
            {errors.cpf && (
              <span className="text-sm text-red-500">{errors.cpf.message}</span>
            )}
          </div>

          {/* E-mail */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } flex items-center gap-2`}
            >
              E-mail <span className="text-red-500">*</span>
              {isUserLoggedIn && (
                <Lock
                  size={14}
                  className={`${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              )}
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              readOnly={isUserLoggedIn}
              disabled={isUserLoggedIn}
              className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.email
                  ? "border-red-500"
                  : theme === "dark"
                  ? "border-gray-600"
                  : "border-gray-300"
              } ${
                isUserLoggedIn
                  ? theme === "dark"
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-50 text-gray-700 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-200"
                  : "bg-white text-gray-900"
              }`}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Telefone */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="phone"
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } flex items-center gap-2`}
            >
              Telefone <span className="text-red-500">*</span>
              {isUserLoggedIn && (
                <Lock
                  size={14}
                  className={`${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              )}
            </label>
            <input
              {...register("phone", {
                onChange: (e) => {
                  const maskedValue = applyPhoneMask(e.target.value);
                  e.target.value = maskedValue;
                },
              })}
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              readOnly={isUserLoggedIn}
              disabled={isUserLoggedIn}
              className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.phone
                  ? "border-red-500"
                  : theme === "dark"
                  ? "border-gray-600"
                  : "border-gray-300"
              } ${
                isUserLoggedIn
                  ? theme === "dark"
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-50 text-gray-700 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-200"
                  : "bg-white text-gray-900"
              }`}
            />
            {errors.phone && (
              <span className="text-sm text-red-500">
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>

        {/* Campos específicos para consultas psiquiátricas */}
        {isPsychiatric && (
          <>
            {/* Separador */}
            <div
              className={`border-t pt-6 ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h4
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-purple-400" : "text-purple-800"
                }`}
              >
                Informações Médicas
              </h4>
            </div>

            {/* Idade e Data de Nascimento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="age"
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Idade <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("age")}
                  id="age"
                  type="number"
                  placeholder="Digite sua idade"
                  className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.age
                      ? "border-red-500"
                      : theme === "dark"
                      ? "border-gray-600 bg-gray-800 text-gray-200"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                />
                {errors.age && (
                  <span className="text-sm text-red-500">
                    {errors.age.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="birthDate"
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Data de Nascimento <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("birthDate")}
                  id="birthDate"
                  type="date"
                  className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.birthDate
                      ? "border-red-500"
                      : theme === "dark"
                      ? "border-gray-600 bg-gray-800 text-gray-200"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                />
                {errors.birthDate && (
                  <span className="text-sm text-red-500">
                    {errors.birthDate.message}
                  </span>
                )}
              </div>
            </div>

            {/* Histórico médico psiquiátrico (PQX) */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="reasonForConsultation"
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Histórico médico psiquiátrico{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("reasonForConsultation")}
                id="reasonForConsultation"
                rows={3}
                placeholder="Descreva seu histórico médico psiquiátrico, tratamentos anteriores, diagnósticos prévios"
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                  errors.reasonForConsultation
                    ? "border-red-500"
                    : theme === "dark"
                    ? "border-gray-600 bg-gray-800 text-gray-200"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              />
              {errors.reasonForConsultation && (
                <span className="text-sm text-red-500">
                  {errors.reasonForConsultation.message}
                </span>
              )}
            </div>

            {/* História Médica Pregressa (HMP) */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="previousHistory"
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                História Médica Pregressa{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("previousHistory")}
                id="previousHistory"
                rows={3}
                placeholder="Descreva sua história médica pregressa, tratamentos psiquiátricos anteriores"
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                  errors.previousHistory
                    ? "border-red-500"
                    : theme === "dark"
                    ? "border-gray-600 bg-gray-800 text-gray-200"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              />
              {errors.previousHistory && (
                <span className="text-sm text-red-500">
                  {errors.previousHistory.message}
                </span>
              )}
            </div>

            {/* Medicações de uso contínuo (MUC) */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="mainComplaint"
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Medicações de uso contínuo{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("mainComplaint")}
                id="mainComplaint"
                rows={3}
                placeholder="Liste todas as medicações que você usa continuamente (nome, dosagem, frequência)"
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                  errors.mainComplaint
                    ? "border-red-500"
                    : theme === "dark"
                    ? "border-gray-600 bg-gray-800 text-gray-200"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              />
              {errors.mainComplaint && (
                <span className="text-sm text-red-500">
                  {errors.mainComplaint.message}
                </span>
              )}
            </div>

            {/* Alergias */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="allergies"
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Alergias
              </label>
              <textarea
                {...register("allergies")}
                id="allergies"
                rows={2}
                placeholder="Descreva suas alergias medicamentosas ou outras (opcional)"
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                  errors.allergies
                    ? "border-red-500"
                    : theme === "dark"
                    ? "border-gray-600 bg-gray-800 text-gray-200"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              />
              {errors.allergies && (
                <span className="text-sm text-red-500">
                  {errors.allergies.message}
                </span>
              )}
            </div>

            {/* Patologias psiquiátricas */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="psychiatricPathologies"
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Patologias psiquiátricas
              </label>
              <textarea
                {...register("psychiatricPathologies")}
                id="psychiatricPathologies"
                rows={3}
                placeholder="Liste patologias psiquiátricas diagnosticadas (depressão, ansiedade, transtorno bipolar, etc.)"
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                  errors.psychiatricPathologies
                    ? "border-red-500"
                    : theme === "dark"
                    ? "border-gray-600 bg-gray-800 text-gray-200"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              />
              {errors.psychiatricPathologies && (
                <span className="text-sm text-red-500">
                  {errors.psychiatricPathologies.message}
                </span>
              )}
            </div>

            {/* Doenças médicas */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="medicalConditions"
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Doenças (hipertensão, diabetes, cirurgias)
              </label>
              <textarea
                {...register("medicalConditions")}
                id="medicalConditions"
                rows={3}
                placeholder="Liste doenças médicas, condições clínicas e cirurgias realizadas (hipertensão, diabetes, etc.)"
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                  errors.medicalConditions
                    ? "border-red-500"
                    : theme === "dark"
                    ? "border-gray-600 bg-gray-800 text-gray-200"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              />
              {errors.medicalConditions && (
                <span className="text-sm text-red-500">
                  {errors.medicalConditions.message}
                </span>
              )}
            </div>

            {/* Informações Adicionais */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="additionalInfo"
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Informações Adicionais
              </label>
              <textarea
                {...register("additionalInfo")}
                id="additionalInfo"
                rows={3}
                placeholder="Outras informações que considera importante mencionar (opcional)"
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                  errors.additionalInfo
                    ? "border-red-500"
                    : theme === "dark"
                    ? "border-gray-600 bg-gray-800 text-gray-200"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              />
              {errors.additionalInfo && (
                <span className="text-sm text-red-500">
                  {errors.additionalInfo.message}
                </span>
              )}
            </div>

            {/* Escala de Sintomas */}
            {renderSymptomScale()}

            {/* Seleção de Endereço - Apenas para consultas psiquiátricas */}
            <div
              className={`border-t pt-6 ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h4
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-800"
                }`}
              >
                Endereço para emissão de receitas
              </h4>

              {isUserLoggedIn ? (
                // Usuário logado - mostrar seleção ou formulário
                <div className="flex flex-col gap-4">
                  {addressesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span
                        className={`ml-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Carregando endereços...
                      </span>
                    </div>
                  ) : userAddresses.length > 0 ? (
                    // Mostrar lista de endereços para seleção
                    <div className="flex flex-col gap-3">
                      <label
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Selecione um endereço{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="grid gap-3">
                        {userAddresses.map((address) => (
                          <div
                            key={address.id}
                            onClick={() => {
                              setSelectedAddressId(address.id);
                              setValue("addressId", address.id);
                            }}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedAddressId === address.id
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : theme === "dark"
                                ? "border-gray-600 hover:border-gray-500 bg-gray-800"
                                : "border-gray-300 hover:border-gray-400 bg-white"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  selectedAddressId === address.id
                                    ? "bg-blue-100 dark:bg-blue-800"
                                    : theme === "dark"
                                    ? "bg-gray-700"
                                    : "bg-gray-100"
                                }`}
                              >
                                <MapPin
                                  size={16}
                                  className={
                                    selectedAddressId === address.id
                                      ? "text-blue-600 dark:text-blue-300"
                                      : theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5
                                    className={`font-medium ${
                                      theme === "dark"
                                        ? "text-gray-200"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {address.title}
                                  </h5>
                                  {address.isDefault && (
                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded">
                                      Padrão
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {address.street}, {address.number}
                                  {address.complement &&
                                    `, ${address.complement}`}
                                </p>
                                <p
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {address.neighborhood}, {address.city} -{" "}
                                  {address.state}
                                </p>
                                <p
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                >
                                  CEP: {address.zipCode}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddressModalOpen(true)}
                        className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg transition-colors ${
                          theme === "dark"
                            ? "border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300"
                            : "border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600"
                        }`}
                      >
                        <Plus size={16} />
                        Adicionar novo endereço
                      </button>
                    </div>
                  ) : (
                    // Sem endereços - mostrar botão para adicionar
                    <div className="text-center py-8">
                      <div
                        className={`p-4 rounded-full inline-block mb-4 ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <MapPin
                          size={32}
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }
                        />
                      </div>
                      <h5
                        className={`font-medium mb-2 ${
                          theme === "dark" ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        Você ainda não possui endereços cadastrados
                      </h5>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } mb-4`}
                      >
                        Adicione um endereço para receber suas receitas
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsAddressModalOpen(true)}
                        className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg transition-colors ${
                          theme === "dark"
                            ? "border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300"
                            : "border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600"
                        }`}
                      >
                        <Plus size={16} />
                        Adicionar novo endereço
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Usuário não logado - mostrar mensagem
                <div className="text-center py-8">
                  <div
                    className={`p-4 rounded-full inline-block mb-4 ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <MapPin
                      size={32}
                      className={
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }
                    />
                  </div>
                  <h5
                    className={`font-medium mb-2 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Você precisa estar logado para adicionar um endereço
                  </h5>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    } mb-4`}
                  >
                    Faça login para adicionar um endereço e receber suas
                    receitas
                  </p>
                  <button
                    type="button"
                    onClick={onLoginClick}
                    className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg transition-colors ${
                      theme === "dark"
                        ? "border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300"
                        : "border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600"
                    }`}
                  >
                    <Lock size={16} />
                    Fazer login
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </form>

      {/* Modal de cadastro de endereço - Fora do form para evitar formulários aninhados */}
      {isPsychiatric && (
        <AddressFormModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onSuccess={() => {
            setIsAddressModalOpen(false);
            fetchUserAddresses();
          }}
        />
      )}

      {/* Componente de Upload de Documentos */}
      <div
        className={`border-t pt-6 ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <DocumentUpload
          onFilesChange={(files) => {
            if (onDocumentsChange) {
              onDocumentsChange(files);
            }
          }}
          maxFiles={5}
          description="Adicione documentos, exames ou imagens que podem ajudar na consulta (opcional)"
        />
      </div>

      {/* Sugestão de login para usuários não logados */}
      {!isUserLoggedIn && onLoginClick && (
        <div
          className={`${
            theme === "dark"
              ? "bg-indigo-900/30 border-indigo-700"
              : "bg-indigo-50 border-indigo-200"
          } border rounded-lg p-4`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4
                className={`font-medium ${
                  theme === "dark" ? "text-indigo-300" : "text-indigo-800"
                } mb-1`}
              >
                Já tem uma conta?
              </h4>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                } mb-3`}
              >
                Faça login para preencher seus dados automaticamente e ter
                acesso ao histórico de consultas.
              </p>
            </div>
            <button
              type="button"
              onClick={onLoginClick}
              className={`px-4 py-2 ${
                theme === "dark"
                  ? "bg-indigo-700 hover:bg-indigo-600 text-indigo-200"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              } rounded-lg text-sm font-medium transition-colors`}
            >
              Fazer Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
