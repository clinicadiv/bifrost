"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Lock } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const personalDataSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
});

export type PersonalDataProps = z.infer<typeof personalDataSchema>;

interface StepFiveProps {
  onDataChange?: (data: PersonalDataProps) => void;
  initialData?: Partial<PersonalDataProps>;
  onLoginClick?: () => void;
}

export const StepFive = ({
  onDataChange,
  initialData,
  onLoginClick,
}: StepFiveProps) => {
  const { user } = useAuthStore();

  // Verificar se o usuário está logado e extrair dados
  const isUserLoggedIn = !!user;
  const userData = user;

  // Preparar dados iniciais (prioridade: dados do usuário logado > initialData)
  const getInitialData = () => {
    if (isUserLoggedIn && userData) {
      // Separar nome completo em primeiro nome e sobrenome
      const fullName = userData.name || "";
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      return {
        firstName,
        lastName,
        email: userData.email || "",
        phone: userData.phone || "",
      };
    }

    return {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
    };
  };

  const {
    register,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<PersonalDataProps>({
    mode: "onChange",
    resolver: zodResolver(personalDataSchema),
    defaultValues: getInitialData(),
  });

  // Watch campos específicos
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const email = watch("email");
  const phone = watch("phone");

  // Atualizar valores quando user mudar (caso faça login durante o processo)
  useEffect(() => {
    if (isUserLoggedIn && userData) {
      const fullName = userData.name || "";
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setValue("firstName", firstName);
      setValue("lastName", lastName);
      setValue("email", userData.email || "");
      setValue("phone", userData.phone || "");
    }
  }, [isUserLoggedIn, userData, setValue]);

  useEffect(() => {
    if (isValid && onDataChange) {
      onDataChange({
        firstName,
        lastName,
        email,
        phone,
      });
    }
  }, [firstName, lastName, email, phone, isValid, onDataChange]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Dados Pessoais</h3>
        <p className="text-sm text-blue-600">
          {isUserLoggedIn
            ? "Seus dados foram preenchidos automaticamente da sua conta"
            : "Preencha seus dados pessoais para finalizar o agendamento"}
        </p>
      </div>

      {/* Indicador de dados preenchidos automaticamente */}
      {isUserLoggedIn && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Check size={20} className="text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Dados preenchidos automaticamente
              </p>
              <p className="text-xs text-green-600 mt-1">
                Seus dados pessoais foram carregados da sua conta. Os campos
                foram bloqueados para segurança.
              </p>
            </div>
          </div>
        </div>
      )}

      <form className="flex flex-col gap-6 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              Nome <span className="text-red-500">*</span>
              {isUserLoggedIn && <Lock size={14} className="text-gray-400" />}
            </label>
            <input
              {...register("firstName")}
              id="firstName"
              type="text"
              placeholder="Digite seu nome"
              readOnly={isUserLoggedIn}
              disabled={isUserLoggedIn}
              className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } ${
                isUserLoggedIn
                  ? "bg-gray-50 text-gray-700 cursor-not-allowed"
                  : ""
              }`}
            />
            {errors.firstName && (
              <span className="text-sm text-red-500">
                {errors.firstName.message}
              </span>
            )}
          </div>

          {/* Sobrenome */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              Sobrenome <span className="text-red-500">*</span>
              {isUserLoggedIn && <Lock size={14} className="text-gray-400" />}
            </label>
            <input
              {...register("lastName")}
              id="lastName"
              type="text"
              placeholder="Digite seu sobrenome"
              readOnly={isUserLoggedIn}
              disabled={isUserLoggedIn}
              className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } ${
                isUserLoggedIn
                  ? "bg-gray-50 text-gray-700 cursor-not-allowed"
                  : ""
              }`}
            />
            {errors.lastName && (
              <span className="text-sm text-red-500">
                {errors.lastName.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* E-mail */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              E-mail <span className="text-red-500">*</span>
              {isUserLoggedIn && <Lock size={14} className="text-gray-400" />}
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="seu@email.com"
              readOnly={isUserLoggedIn}
              disabled={isUserLoggedIn}
              className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.email ? "border-red-500" : "border-gray-300"
              } ${
                isUserLoggedIn
                  ? "bg-gray-50 text-gray-700 cursor-not-allowed"
                  : ""
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
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              Telefone <span className="text-red-500">*</span>
              {isUserLoggedIn && <Lock size={14} className="text-gray-400" />}
            </label>
            <input
              {...register("phone")}
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              readOnly={isUserLoggedIn}
              disabled={isUserLoggedIn}
              className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } ${
                isUserLoggedIn
                  ? "bg-gray-50 text-gray-700 cursor-not-allowed"
                  : ""
              }`}
              onChange={(e) => {
                if (!isUserLoggedIn) {
                  const maskedValue = applyPhoneMask(e.target.value);
                  setValue("phone", maskedValue, { shouldValidate: true });
                }
              }}
            />
            {errors.phone && (
              <span className="text-sm text-red-500">
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>

        {/* Informação sobre campos obrigatórios */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="text-red-500">*</span>
          <span>Campos obrigatórios</span>
        </div>

        {/* Mensagem de validação */}
        {isValid && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700">
              ✅ Todos os dados foram preenchidos corretamente!
            </p>
          </div>
        )}

        {/* Link para login - só mostrar se usuário NÃO estiver logado */}
        {!isUserLoggedIn && (
          <div className="flex flex-col items-center gap-4 pt-10 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Já possui uma conta na clínica.div?
              </p>
              <button
                type="button"
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-blue-700 font-medium transition-all cursor-pointer duration-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => {
                  if (onLoginClick) {
                    onLoginClick();
                  } else {
                    console.log("Abrir modal de login");
                  }
                }}
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
                  />
                </svg>
                Fazer login com minha conta
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span>ou continue preenchendo os dados</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
