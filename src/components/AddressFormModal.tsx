"use client";

import { useAuthStore } from "@/hooks";
import { createAddress, updateAddress } from "@/services/http/addresses";
import { Address } from "@/types";
import { MapPin, Spinner, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Button } from "./Button";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingAddress?: Address;
}

interface FormData {
  title: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
}

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface SimpleInputProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  className?: string;
}

const SimpleInput = ({
  type,
  value,
  onChange,
  placeholder,
  error,
  className,
}: SimpleInputProps) => {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 bg-white/80 dark:bg-slate-700/50 border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-div-green/50 focus:border-div-green/50 
          transition-all duration-200 text-gray-900 dark:text-slate-100
          ${
            error
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300/50 dark:border-slate-600/30"
          }
          ${className || ""}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export const AddressFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  editingAddress,
}: AddressFormModalProps) => {
  const user = useAuthStore((state) => state.user);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const token = useAuthStore((state) => state.token);

  const applyCEPMask = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 5) {
      return numericValue;
    }
    return `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
  };

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        title: editingAddress.title,
        zipCode: applyCEPMask(editingAddress.zipCode),
        street: editingAddress.street,
        number: editingAddress.number,
        complement: editingAddress.complement || "",
        neighborhood: editingAddress.neighborhood,
        city: editingAddress.city,
        state: editingAddress.state,
        isDefault: editingAddress.isDefault,
      });
    } else {
      setFormData({
        title: "",
        zipCode: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        isDefault: false,
      });
    }
  }, [editingAddress]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      setFormData({
        title: "",
        zipCode: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        isDefault: false,
      });
      setErrors({});
    }, 200);
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo quando ele for alterado
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const searchCEP = async (cep: string) => {
    if (cep.length !== 8) return;

    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data: ViaCEPResponse = await response.json();

      if (data.erro) {
        setErrors((prev) => ({
          ...prev,
          zipCode: "CEP não encontrado",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        street: data.logradouro || prev.street,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        zipCode: "Erro ao buscar CEP",
      }));
    } finally {
      setCepLoading(false);
    }
  };

  const handleCEPChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 8) {
      const maskedValue = applyCEPMask(numericValue);
      handleInputChange("zipCode", maskedValue);

      if (numericValue.length === 8) {
        searchCEP(numericValue);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "CEP é obrigatório";
    } else {
      const numericCEP = formData.zipCode.replace(/\D/g, "");
      if (numericCEP.length !== 8) {
        newErrors.zipCode = "CEP deve ter 8 dígitos";
      }
    }

    if (!formData.street.trim()) {
      newErrors.street = "Logradouro é obrigatório";
    }

    if (!formData.number.trim()) {
      newErrors.number = "Número é obrigatório";
    }

    if (!formData.neighborhood.trim()) {
      newErrors.neighborhood = "Bairro é obrigatório";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Cidade é obrigatória";
    }

    if (!formData.state.trim()) {
      newErrors.state = "Estado é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user?.id) return;

    setLoading(true);
    try {
      if (editingAddress) {
        // Atualizar endereço existente
        await updateAddress(
          editingAddress.id,
          {
            title: formData.title,
            zipCode: formData.zipCode,
            street: formData.street,
            number: formData.number,
            complement: formData.complement || undefined,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            country: "Brasil",
            isDefault: formData.isDefault,
          },
          token!
        );
      } else {
        // Criar novo endereço
        await createAddress(
          {
            userId: user.id,
            title: formData.title,
            zipCode: formData.zipCode,
            street: formData.street,
            number: formData.number,
            complement: formData.complement || undefined,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            country: "Brasil",
            isDefault: formData.isDefault,
          },
          token!
        );
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 ${
        isClosing ? "animate-fade-out" : "animate-fade-in"
      }`}
      onClick={handleClose}
    >
      <div
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
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-transparent"
            >
              <X size={18} className="text-gray-700 dark:text-slate-400" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-div-green to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-div-green/25">
                <MapPin size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                  {editingAddress ? "Editar Endereço" : "Novo Endereço"}
                </h2>
                <p className="text-gray-700 dark:text-slate-400 text-sm">
                  {editingAddress
                    ? "Atualize as informações do seu endereço"
                    : "Adicione um novo endereço à sua conta"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
              Título do Endereço
            </label>
            <SimpleInput
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Ex: Casa, Trabalho, Apartamento..."
              error={errors.title}
            />
          </div>

          {/* CEP */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
              CEP
            </label>
            <div className="relative">
              <SimpleInput
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleCEPChange(e.target.value)}
                placeholder="00000-000"
                error={errors.zipCode}
              />
              {cepLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Spinner size={16} className="animate-spin text-div-green" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
              Digite o CEP para preenchimento automático
            </p>
          </div>

          {/* Logradouro e Número */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
                Logradouro
              </label>
              <SimpleInput
                type="text"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                placeholder="Nome da rua, avenida, etc."
                error={errors.street}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
                Número
              </label>
              <SimpleInput
                type="text"
                value={formData.number}
                onChange={(e) => handleInputChange("number", e.target.value)}
                placeholder="123"
                error={errors.number}
              />
            </div>
          </div>

          {/* Complemento */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
              Complemento (opcional)
            </label>
            <SimpleInput
              type="text"
              value={formData.complement}
              onChange={(e) => handleInputChange("complement", e.target.value)}
              placeholder="Apartamento, bloco, casa, etc."
            />
          </div>

          {/* Bairro */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
              Bairro
            </label>
            <SimpleInput
              type="text"
              value={formData.neighborhood}
              onChange={(e) =>
                handleInputChange("neighborhood", e.target.value)
              }
              placeholder="Nome do bairro"
              error={errors.neighborhood}
            />
          </div>

          {/* Cidade e Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
                Cidade
              </label>
              <SimpleInput
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Nome da cidade"
                error={errors.city}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
                Estado
              </label>
              <SimpleInput
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="UF"
                error={errors.state}
              />
            </div>
          </div>

          {/* Endereço Padrão */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => handleInputChange("isDefault", e.target.checked)}
              className="w-4 h-4 text-div-green bg-gray-100 border-gray-300 rounded focus:ring-div-green focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium text-gray-900 dark:text-slate-100"
            >
              Definir como endereço padrão
            </label>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="gray.light"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={loading} className="flex-1">
              {editingAddress ? "Salvar Alterações" : "Adicionar Endereço"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
