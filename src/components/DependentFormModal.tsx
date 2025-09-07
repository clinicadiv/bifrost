"use client";

import { Button } from "@/components";
import {
  useCreateDependent,
  useUpdateDependent,
} from "@/hooks/mutations/useDependentMutations";
// import { useAuthStore } from "@/hooks/useAuthStore"; // TODO: Implementar quando subscriptionId estiver disponível
import {
  CreateDependentDTO,
  Dependent,
  DependentRelationship,
  RelationshipType,
  UpdateDependentDTO,
} from "@/types";
import { formatDocument } from "@/utils";
import {
  Calendar,
  EnvelopeSimple,
  IdentificationCard,
  Pen,
  Phone,
  User,
  UserPlus,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DependentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  dependent?: Dependent;
  mode: "create" | "edit";
}

export function DependentFormModal({
  isOpen,
  onClose,
  dependent,
  mode,
}: DependentFormModalProps) {
  // const { user } = useAuthStore(); // TODO: Implementar obtenção do subscriptionId
  const createDependentMutation = useCreateDependent();
  const updateDependentMutation = useUpdateDependent();

  const [formData, setFormData] = useState({
    name: "",
    document: "",
    birthDate: "",
    relationship: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (mode === "edit" && dependent) {
      setFormData({
        name: dependent.name || "",
        document: dependent.document || "",
        birthDate: dependent.birthDate ? dependent.birthDate.split("T")[0] : "",
        relationship: dependent.relationship || "",
        phone: dependent.phone || "",
        email: dependent.email || "",
      });
    } else {
      // Reset para modo create
      setFormData({
        name: "",
        document: "",
        birthDate: "",
        relationship: "",
        phone: "",
        email: "",
      });
    }
    setErrors({});
  }, [mode, dependent, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.document.trim()) {
      newErrors.document = "CPF é obrigatório";
    } else if (formData.document.replace(/\D/g, "").length !== 11) {
      newErrors.document = "CPF deve ter 11 dígitos";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Data de nascimento é obrigatória";
    }

    if (!formData.relationship) {
      newErrors.relationship = "Parentesco é obrigatório";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (formData.phone && formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Telefone deve ter pelo menos 10 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (mode === "create") {
        const createData: CreateDependentDTO = {
          subscriptionId: "temp-subscription-id", // TODO: Obter subscriptionId real do usuário
          name: formData.name.trim(),
          document: formData.document.replace(/\D/g, ""),
          birthDate: formData.birthDate,
          relationship: formData.relationship,
          phone: formData.phone.replace(/\D/g, "") || undefined,
          email: formData.email.trim() || undefined,
        };

        await createDependentMutation.mutateAsync(createData);
      } else if (dependent) {
        const updateData: UpdateDependentDTO = {
          name: formData.name.trim(),
          document: formData.document.replace(/\D/g, ""),
          birthDate: formData.birthDate,
          relationship: formData.relationship,
          phone: formData.phone.replace(/\D/g, "") || undefined,
          email: formData.email.trim() || undefined,
        };

        await updateDependentMutation.mutateAsync({
          id: dependent.id,
          data: updateData,
        });
      }

      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDocumentChange = (value: string) => {
    const formatted = formatDocument(value);
    handleInputChange("document", formatted);
  };

  const handlePhoneChange = (value: string) => {
    // Formatar telefone (11) 99999-9999
    const numbers = value.replace(/\D/g, "");
    let formatted = numbers;

    if (numbers.length >= 2) {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }
    if (numbers.length >= 7) {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(
        2,
        7
      )}-${numbers.slice(7, 11)}`;
    }

    handleInputChange("phone", formatted);
  };

  const isLoading =
    createDependentMutation.isPending || updateDependentMutation.isPending;
  const error = createDependentMutation.error || updateDependentMutation.error;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    {mode === "create" ? (
                      <UserPlus
                        size={20}
                        weight="bold"
                        className="text-blue-600 dark:text-blue-400"
                      />
                    ) : (
                      <Pen
                        size={20}
                        weight="bold"
                        className="text-blue-600 dark:text-blue-400"
                      />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {mode === "create"
                        ? "Adicionar Dependente"
                        : "Editar Dependente"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {mode === "create"
                        ? "Preencha os dados do novo dependente"
                        : "Atualize as informações do dependente"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X
                    size={20}
                    weight="bold"
                    className="text-gray-500 dark:text-slate-400"
                  />
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto"
            >
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Nome completo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={20} weight="bold" className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Digite o nome completo"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.name
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-slate-600"
                    } bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* CPF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  CPF *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdentificationCard
                      size={20}
                      weight="bold"
                      className="text-gray-400"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.document}
                    onChange={(e) => handleDocumentChange(e.target.value)}
                    maxLength={14}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.document
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-slate-600"
                    } bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                    required
                  />
                </div>
                {errors.document && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.document}
                  </p>
                )}
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Data de nascimento *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar
                      size={20}
                      weight="bold"
                      className="text-gray-400"
                    />
                  </div>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      handleInputChange("birthDate", e.target.value)
                    }
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.birthDate
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-slate-600"
                    } bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                    required
                  />
                </div>
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.birthDate}
                  </p>
                )}
              </div>

              {/* Parentesco */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Parentesco *
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) =>
                    handleInputChange("relationship", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.relationship
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-slate-600"
                  } bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                  required
                >
                  <option value="">Selecione o parentesco</option>
                  {Object.entries(DependentRelationship).map(([key, value]) => (
                    <option key={key} value={value}>
                      {RelationshipType[key as keyof typeof RelationshipType] ||
                        value}
                    </option>
                  ))}
                </select>
                {errors.relationship && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.relationship}
                  </p>
                )}
              </div>

              {/* Telefone (opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={20} weight="bold" className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    maxLength={15}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.phone
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-slate-600"
                    } bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email (opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeSimple
                      size={20}
                      weight="bold"
                      className="text-gray-400"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-slate-600"
                    } bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error.message || "Erro ao salvar dependente"}
                  </p>
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex gap-3">
              <Button
                variant="gray.light"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="primary.regular"
                onClick={handleSubmit}
                disabled={isLoading}
                isLoading={isLoading}
                className="flex-1"
              >
                {mode === "create" ? "Adicionar" : "Salvar"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
