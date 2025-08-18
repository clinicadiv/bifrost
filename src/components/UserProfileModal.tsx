"use client";

import { useAuthStore } from "@/hooks";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { deleteAddress, getUserAddresses } from "@/services/http/addresses";
import { Address } from "@/types";
import {
  Buildings,
  Crown,
  House,
  IdentificationCard,
  MapPin,
  PencilSimple,
  Phone,
  Plus,
  Star,
  TrashSimple,
  User,
  Warning,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AddressFormModal } from "./AddressFormModal";
import { AvatarUpload } from "./AvatarUpload";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditableUserData {
  name: string;
  email: string;
  phone: string;
  document: string;
  whatsappPhone: string;
  whatsapp: boolean;
}

export const UserProfileModal = ({
  isOpen,
  onClose,
}: UserProfileModalProps) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const updateUserData = useAuthStore((state) => state.updateUserData);
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "addresses">(
    "profile"
  );
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();

  // Estados para o modo de edição global
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editableData, setEditableData] = useState<EditableUserData>({
    name: "",
    email: "",
    phone: "",
    document: "",
    whatsappPhone: "",
    whatsapp: false,
  });

  // Estados para exclusão de endereço
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Hook para gerenciar upload/remoção de avatar
  const {
    uploadUserAvatar,
    removeUserAvatar,
    isUploading: avatarUploading,
  } = useAvatarUpload({
    onSuccess: () => {
      console.log("✅ Avatar atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("❌ Erro no avatar:", error);
      alert(`Erro no avatar: ${error}`);
    },
  });

  // Função wrapper para o callback do avatar
  const handleAvatarFileSelect = (file: File | null) => {
    if (file) {
      uploadUserAvatar(file);
    }
  };

  // Funções para máscaras
  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const cleaned = value.replace(/\D/g, "");

    // Limita o tamanho máximo
    const limited = cleaned.slice(0, 11);

    // Aplica a máscara baseada no tamanho
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 6) {
      return limited.replace(/(\d{2})(\d{0,4})/, "($1) $2");
    } else if (limited.length <= 10) {
      return limited.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      return limited.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
  };

  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const cleaned = value.replace(/\D/g, "");

    // Verifica se é CPF ou CNPJ baseado no tamanho
    if (cleaned.length <= 11) {
      // CPF: XXX.XXX.XXX-XX
      const limited = cleaned.slice(0, 11);

      if (limited.length <= 3) {
        return limited;
      } else if (limited.length <= 6) {
        return limited.replace(/(\d{3})(\d{0,3})/, "$1.$2");
      } else if (limited.length <= 9) {
        return limited.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
      } else {
        return limited.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
      }
    } else {
      // CNPJ: XX.XXX.XXX/XXXX-XX
      const limited = cleaned.slice(0, 14);

      if (limited.length <= 2) {
        return limited;
      } else if (limited.length <= 5) {
        return limited.replace(/(\d{2})(\d{0,3})/, "$1.$2");
      } else if (limited.length <= 8) {
        return limited.replace(/(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
      } else if (limited.length <= 12) {
        return limited.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, "$1.$2.$3/$4");
      } else {
        return limited.replace(
          /(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/,
          "$1.$2.$3/$4-$5"
        );
      }
    }
  };

  // Inicializar dados editáveis quando o usuário muda
  useEffect(() => {
    if (user) {
      setEditableData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        document: user.document || "",
        whatsappPhone: user.whatsappPhone || "",
        whatsapp: user.whatsapp || false,
      });
    }
  }, [user]);

  // Funções para o modo de edição
  const handleEditModeToggle = () => {
    if (isEditMode) {
      // Verificar se há mudanças não salvas
      if (hasChanges) {
        const confirmCancel = window.confirm(
          "Você tem alterações não salvas. Deseja cancelar mesmo assim?"
        );
        if (!confirmCancel) return;
      }

      // Cancelar edição - restaurar dados originais
      if (user) {
        setEditableData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          document: user.document || "",
          whatsappPhone: user.whatsappPhone || "",
          whatsapp: user.whatsapp || false,
        });
      }
      setHasChanges(false);
    }
    setIsEditMode(!isEditMode);
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    // Validar dados antes de salvar
    const errors = validateData();
    if (errors.length > 0) {
      alert("Por favor, corrija os seguintes erros:\n" + errors.join("\n"));
      return;
    }

    setIsSaving(true);
    try {
      await updateUserData(editableData);
      setIsEditMode(false);
      setHasChanges(false);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      alert("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof EditableUserData,
    value: string | boolean
  ) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Verificar se há mudanças
    if (user) {
      const originalData = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        document: user.document || "",
        whatsappPhone: user.whatsappPhone || "",
        whatsapp: user.whatsapp || false,
      };

      const newData = { ...editableData, [field]: value };
      const hasAnyChanges = Object.keys(originalData).some(
        (key) =>
          originalData[key as keyof EditableUserData] !==
          newData[key as keyof EditableUserData]
      );

      setHasChanges(hasAnyChanges);
    }
  };

  // Validação básica
  const validateData = () => {
    const errors: string[] = [];

    if (!editableData.name.trim()) {
      errors.push("Nome é obrigatório");
    }

    if (!editableData.email.trim()) {
      errors.push("Email é obrigatório");
    } else if (!/\S+@\S+\.\S+/.test(editableData.email)) {
      errors.push("Email deve ter um formato válido");
    }

    if (!editableData.phone.trim()) {
      errors.push("Telefone é obrigatório");
    }

    return errors;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (user?.id) {
        loadUserAddresses();
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, user?.id]);

  const loadUserAddresses = async () => {
    if (!user?.id) return;

    setLoadingAddresses(true);
    try {
      const response = await getUserAddresses(user.id, token || "");
      if (
        response.success &&
        response.data.success &&
        Array.isArray(response.data.addresses)
      ) {
        setAddresses(response.data.addresses);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddressFormSuccess = () => {
    loadUserAddresses();
    setShowAddressForm(false);
    setEditingAddress(undefined);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(undefined);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (address: Address) => {
    setAddressToDelete(address);
    setShowDeleteModal(true);
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete || !token) return;

    setDeleting(true);
    try {
      await deleteAddress(addressToDelete.id, token);
      setAddresses(addresses.filter((addr) => addr.id !== addressToDelete.id));
      setShowDeleteModal(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir endereço:", error);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDeleteAddress = () => {
    setShowDeleteModal(false);
    setAddressToDelete(null);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  if (!isOpen) return null;

  const getUserLevel = (level: number) => {
    switch (level) {
      case 1:
        return {
          name: "Básico",
          color: "text-blue-600",
          bg: "bg-blue-50 dark:bg-blue-900/20",
        };
      case 2:
        return {
          name: "Premium",
          color: "text-purple-600",
          bg: "bg-purple-50 dark:bg-purple-900/20",
        };
      case 3:
        return {
          name: "Administrador",
          color: "text-amber-600",
          bg: "bg-amber-50 dark:bg-amber-900/20",
        };
      default:
        return {
          name: "Usuário",
          color: "text-gray-600",
          bg: "bg-gray-50 dark:bg-gray-900/20",
        };
    }
  };

  const levelInfo = getUserLevel(user?.level || 0);

  const formatAddress = (address: Address) => {
    return `${address.street}, ${address.number}${
      address.complement ? `, ${address.complement}` : ""
    } - ${address.neighborhood}, ${address.city}/${address.state}`;
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${
        isClosing ? "animate-fade-out" : "animate-fade-in"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-hidden ${
          isClosing ? "animate-modal-close" : "animate-modal-open"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header simplificado */}
        <div className="relative bg-gradient-to-r from-div-green/10 to-emerald-500/10 dark:from-div-green/5 dark:to-emerald-500/5">
          <div className="p-6">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 transition-colors border border-gray-200 dark:border-slate-600"
            >
              <X size={16} className="text-gray-600 dark:text-slate-400" />
            </button>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-div-green to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-md border border-gray-200 dark:border-slate-600">
                  <Crown size={10} className={levelInfo.color} />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-1">
                  {user?.name || "Usuário"}
                </h2>
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">
                  {user?.email}
                </p>
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${levelInfo.bg} ${levelInfo.color} border border-current/20`}
                >
                  <Crown size={12} />
                  {levelInfo.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation simplificado */}
        <div className="border-b border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                activeTab === "profile"
                  ? "text-div-green border-b-2 border-div-green bg-white dark:bg-slate-900"
                  : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200"
              }`}
            >
              <User size={16} />
              Perfil
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                activeTab === "addresses"
                  ? "text-div-green border-b-2 border-div-green bg-white dark:bg-slate-900"
                  : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200"
              }`}
            >
              <MapPin size={16} />
              Endereços
              {addresses.length > 0 && (
                <span className="bg-div-green text-white text-xs rounded-full px-1.5 py-0.5 font-semibold min-w-[18px] text-center">
                  {addresses.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content com scroll */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            {activeTab === "profile" && (
              <>
                <div className="space-y-6">
                  {/* Avatar e dados principais */}
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      {/* Avatar Section */}
                      <div className="flex-shrink-0">
                        <AvatarUpload
                          currentAvatar={user?.avatar}
                          onFileSelect={handleAvatarFileSelect}
                          onRemoveAvatar={removeUserAvatar}
                          disabled={avatarUploading || !isEditMode}
                          size="large"
                          showRemoveButton={isEditMode && !!user?.avatar}
                        />
                        {!isEditMode && (
                          <p className="text-xs text-gray-500 dark:text-slate-400 text-center mt-2">
                            Ative o modo de edição para alterar
                          </p>
                        )}
                      </div>

                      {/* Nome e Email */}
                      <div className="flex-1 w-full space-y-4">
                        {/* Nome Completo */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Nome Completo
                          </label>
                          {isEditMode ? (
                            <input
                              type="text"
                              value={editableData.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              placeholder="Nome completo"
                              className="w-full text-base font-medium bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-div-green/50 focus:border-div-green"
                            />
                          ) : (
                            <p className="text-base font-medium text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-3">
                              {user?.name || "Não informado"}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Email
                          </label>
                          {isEditMode ? (
                            <input
                              type="email"
                              value={editableData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              placeholder="seu@email.com"
                              className="w-full text-base font-medium bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-div-green/50 focus:border-div-green"
                            />
                          ) : (
                            <p className="text-base font-medium text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-3">
                              {user?.email || "Não informado"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grid para outros campos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Documento (CPF/CNPJ) */}
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <IdentificationCard
                            size={16}
                            className="text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                            Documento (CPF/CNPJ)
                          </label>
                        </div>
                      </div>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editableData.document}
                          onChange={(e) =>
                            handleInputChange(
                              "document",
                              formatCPF(e.target.value)
                            )
                          }
                          placeholder="000.000.000-00"
                          className="w-full text-sm bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-div-green/50 focus:border-div-green"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2.5">
                          {user?.document
                            ? formatCPF(user.document)
                            : "Não informado"}
                        </p>
                      )}
                    </div>

                    {/* Telefone */}
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                          <Phone size={16} className="text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                            Telefone
                          </label>
                        </div>
                      </div>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editableData.phone}
                          onChange={(e) =>
                            handleInputChange(
                              "phone",
                              formatPhone(e.target.value)
                            )
                          }
                          placeholder="(00) 00000-0000"
                          className="w-full text-sm bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-div-green/50 focus:border-div-green"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2.5">
                          {user?.phone || "Não informado"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* WhatsApp em card separado */}
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <WhatsappLogo size={16} className="text-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                          WhatsApp
                        </label>
                      </div>
                    </div>
                    {isEditMode ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editableData.whatsappPhone}
                          onChange={(e) =>
                            handleInputChange(
                              "whatsappPhone",
                              formatPhone(e.target.value)
                            )
                          }
                          placeholder="(00) 00000-0000"
                          className="w-full text-sm bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-div-green/50 focus:border-div-green"
                        />
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              handleInputChange(
                                "whatsapp",
                                !editableData.whatsapp
                              );
                            }}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              editableData.whatsapp
                                ? "bg-div-green"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                editableData.whatsapp
                                  ? "translate-x-5"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span className="text-xs text-gray-600 dark:text-slate-400">
                            WhatsApp ativo
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2.5">
                        <p className="text-sm font-medium text-gray-900 dark:text-slate-100 mb-2">
                          {user?.whatsappPhone || "Não informado"}
                        </p>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              user?.whatsapp ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                          <span className="text-xs text-gray-600 dark:text-slate-400">
                            {user?.whatsapp ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer com botões */}
                <div className="mt-6 space-y-3">
                  {isEditMode && hasChanges && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 text-amber-800 dark:text-amber-200 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                        Você tem alterações não salvas
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {isEditMode ? (
                      <>
                        <button
                          onClick={handleSaveChanges}
                          disabled={isSaving}
                          className="flex-1 bg-gradient-to-r from-div-green to-emerald-500 hover:from-emerald-500 hover:to-div-green text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? "Salvando..." : "Salvar Alterações"}
                        </button>
                        <button
                          onClick={handleEditModeToggle}
                          disabled={isSaving}
                          className="px-6 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-medium rounded-lg transition-all duration-200 border border-gray-300 dark:border-slate-600 disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleEditModeToggle}
                          className="flex-1 bg-gradient-to-r from-div-green to-emerald-500 hover:from-emerald-500 hover:to-div-green text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          Editar Perfil
                        </button>
                        <button className="px-6 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-medium rounded-lg transition-all duration-200 border border-gray-300 dark:border-slate-600">
                          Configurações
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-6">
                {/* Header da seção de endereços */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                      Meus Endereços
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Gerencie seus endereços de entrega e cobrança
                    </p>
                  </div>
                  <button
                    onClick={handleAddNewAddress}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-div-green to-emerald-500 hover:from-emerald-500 hover:to-div-green text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Plus size={16} />
                    Novo Endereço
                  </button>
                </div>

                {/* Lista de endereços */}
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl overflow-hidden">
                  {loadingAddresses ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-div-green border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-slate-400">
                        Carregando endereços...
                      </p>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="p-8 text-center">
                      <Buildings
                        size={48}
                        className="mx-auto text-gray-400 dark:text-slate-500 mb-4"
                      />
                      <h4 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                        Nenhum endereço cadastrado
                      </h4>
                      <p className="text-gray-600 dark:text-slate-400 mb-4">
                        Adicione seu primeiro endereço para facilitar futuras
                        compras
                      </p>
                      <button
                        onClick={handleAddNewAddress}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-div-green to-emerald-500 hover:from-emerald-500 hover:to-div-green text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mx-auto"
                      >
                        <Plus size={16} />
                        Adicionar Endereço
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-slate-700">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="p-6 hover:bg-white dark:hover:bg-slate-800 transition-colors group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <House size={16} className="text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-gray-900 dark:text-slate-100">
                                    {address.title}
                                  </h4>
                                  {address.isDefault && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-div-green/20 text-div-green text-xs font-medium rounded-full">
                                      <Star size={10} weight="fill" />
                                      Padrão
                                    </div>
                                  )}
                                </div>
                                <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">
                                  {formatAddress(address)}
                                </p>
                                <p className="text-gray-500 dark:text-slate-400 text-xs mt-1">
                                  CEP: {address.zipCode}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditAddress(address)}
                                className="p-2 rounded-lg bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors border border-gray-200 dark:border-slate-600"
                              >
                                <PencilSimple
                                  size={14}
                                  className="text-gray-600 dark:text-slate-400"
                                />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address)}
                                className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-700/30"
                              >
                                <TrashSimple
                                  size={14}
                                  className="text-red-600 dark:text-red-400"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Warning size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Excluir Endereço
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Esta ação não pode ser desfeita
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 dark:text-slate-300 mb-2">
                  Deseja realmente excluir o endereço:
                </p>
                <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                  <p className="font-medium text-gray-900 dark:text-slate-100">
                    {addressToDelete?.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    {addressToDelete && formatAddress(addressToDelete)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDeleteAddress}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-medium rounded-lg transition-colors border border-gray-300 dark:border-slate-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteAddress}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {deleting ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Address Form Modal */}
        <AddressFormModal
          isOpen={showAddressForm}
          onClose={() => setShowAddressForm(false)}
          onSuccess={handleAddressFormSuccess}
          editingAddress={editingAddress}
        />
      </div>
    </div>
  );
};
