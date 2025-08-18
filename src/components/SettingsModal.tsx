"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useAuthStore } from "@/hooks";
import {
  Bell,
  Eye,
  EyeSlash,
  GearSix,
  Globe,
  Lock,
  MoonStars,
  Notification,
  Palette,
  Shield,
  SunDim,
  Trash,
  User,
  X,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SimpleToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SimpleToggle = ({ checked, onChange }: SimpleToggleProps) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-div-green focus:ring-offset-2 ${
        checked ? "bg-div-green" : "bg-gray-200 dark:bg-slate-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const user = useAuthStore((state) => state.user);
  const { theme, toggleTheme } = useTheme();
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "appearance" | "notifications" | "privacy" | "account"
  >("appearance");

  // Estados para as configurações
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    profileVisibility: "public",
    dataSharing: false,
    twoFactorAuth: false,
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const tabs = [
    {
      id: "appearance",
      label: "Aparência",
      icon: Palette,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: Bell,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "privacy",
      label: "Privacidade",
      icon: Shield,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      id: "account",
      label: "Conta",
      icon: User,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 ${
        isClosing ? "animate-fade-out" : "animate-fade-in"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-300/50 dark:border-slate-700/30 w-full max-w-4xl overflow-hidden ${
          isClosing ? "animate-modal-close" : "animate-modal-open"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-div-green/15 to-emerald-500/15 dark:from-div-green/5 dark:to-emerald-500/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-div-green/25 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/25 to-transparent rounded-full blur-2xl"></div>

          <div className="relative p-8">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-transparent"
            >
              <X size={18} className="text-gray-700 dark:text-slate-400" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-div-green to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-div-green/25 rotate-3 hover:rotate-0 transition-transform duration-300">
                <GearSix size={28} weight="bold" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  Configurações
                </h2>
                <p className="text-gray-700 dark:text-slate-400 text-sm">
                  Personalize sua experiência
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 py-6 border-b border-gray-200/50 dark:border-slate-700/30">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-2 pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-200 whitespace-nowrap min-w-fit ${
                  activeTab === tab.id
                    ? `${tab.bgColor} ${tab.textColor} shadow-sm scale-105`
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:scale-102"
                }`}
              >
                <tab.icon size={18} weight="bold" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 max-h-[60vh] overflow-y-auto">
          {/* Aparência */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Aparência
                </h3>
                <div className="space-y-4">
                  {/* Tema */}
                  <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-300/40 dark:border-slate-700/20 hover:bg-white/95 dark:hover:bg-slate-800/80 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                          {theme === "dark" ? (
                            <MoonStars size={18} className="text-white" />
                          ) : (
                            <SunDim size={18} className="text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-slate-100">
                            Tema
                          </p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            {theme === "dark" ? "Modo escuro" : "Modo claro"}
                          </p>
                        </div>
                      </div>
                      <SimpleToggle
                        checked={theme === "dark"}
                        onChange={() => toggleTheme()}
                      />
                    </div>
                  </div>

                  {/* Idioma */}
                  <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-300/40 dark:border-slate-700/20 hover:bg-white/95 dark:hover:bg-slate-800/80 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                          <Globe size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-slate-100">
                            Idioma
                          </p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            Português (Brasil)
                          </p>
                        </div>
                      </div>
                      <select
                        value={settings.language}
                        onChange={(e) =>
                          handleSettingChange("language", e.target.value)
                        }
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-div-green/50"
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notificações */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Notificações
                </h3>
                <div className="space-y-4">
                  {/* Email */}
                  <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-300/40 dark:border-slate-700/20 hover:bg-white/95 dark:hover:bg-slate-800/80 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                          <Notification size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-slate-100">
                            Notificações por email
                          </p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            Receba atualizações por email
                          </p>
                        </div>
                      </div>
                      <SimpleToggle
                        checked={settings.emailNotifications}
                        onChange={(checked) =>
                          handleSettingChange("emailNotifications", checked)
                        }
                      />
                    </div>
                  </div>

                  {/* Push */}
                  <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-300/40 dark:border-slate-700/20 hover:bg-white/95 dark:hover:bg-slate-800/80 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                          <Bell size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-slate-100">
                            Notificações push
                          </p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            Receba notificações no navegador
                          </p>
                        </div>
                      </div>
                      <SimpleToggle
                        checked={settings.pushNotifications}
                        onChange={(checked) =>
                          handleSettingChange("pushNotifications", checked)
                        }
                      />
                    </div>
                  </div>

                  {/* Marketing */}
                  <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-300/40 dark:border-slate-700/20 hover:bg-white/95 dark:hover:bg-slate-800/80 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                          <Palette size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-slate-100">
                            Emails promocionais
                          </p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            Receba ofertas especiais
                          </p>
                        </div>
                      </div>
                      <SimpleToggle
                        checked={settings.marketingEmails}
                        onChange={(checked) =>
                          handleSettingChange("marketingEmails", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacidade */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Privacidade & Segurança
                </h3>
                <div className="space-y-4">
                  {/* Visibilidade do perfil */}
                  <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-300/40 dark:border-slate-700/20 hover:bg-white/95 dark:hover:bg-slate-800/80 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                          {settings.profileVisibility === "public" ? (
                            <Eye size={18} className="text-white" />
                          ) : (
                            <EyeSlash size={18} className="text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-slate-100">
                            Visibilidade do perfil
                          </p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            Controle quem pode ver seu perfil
                          </p>
                        </div>
                      </div>
                      <select
                        value={settings.profileVisibility}
                        onChange={(e) =>
                          handleSettingChange(
                            "profileVisibility",
                            e.target.value
                          )
                        }
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-div-green/50"
                      >
                        <option value="public">Público</option>
                        <option value="private">Privado</option>
                        <option value="friends">Apenas amigos</option>
                      </select>
                    </div>
                  </div>

                  {/* Compartilhamento de dados */}
                  <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-300/40 dark:border-slate-700/20 hover:bg-white/95 dark:hover:bg-slate-800/80 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                          <Shield size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-slate-100">
                            Compartilhamento de dados
                          </p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            Permitir uso de dados para melhorias
                          </p>
                        </div>
                      </div>
                      <SimpleToggle
                        checked={settings.dataSharing}
                        onChange={(checked) =>
                          handleSettingChange("dataSharing", checked)
                        }
                      />
                    </div>
                  </div>

                  {/* Autenticação em duas etapas */}
                  <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-300/40 dark:border-slate-700/20 hover:bg-white/95 dark:hover:bg-slate-800/80 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                          <Lock size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-slate-100">
                            Autenticação em duas etapas
                          </p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            Aumenta a segurança da sua conta
                          </p>
                        </div>
                      </div>
                      <SimpleToggle
                        checked={settings.twoFactorAuth}
                        onChange={(checked) =>
                          handleSettingChange("twoFactorAuth", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conta */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Configurações da Conta
                </h3>
                <div className="space-y-4">
                  {/* Informações da conta */}
                  <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-300/40 dark:border-slate-700/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <User size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-slate-100">
                          Informações da conta
                        </p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          Gerencie suas informações pessoais
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-slate-400">
                          Nome:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-slate-100">
                          {user?.name || "Não informado"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-slate-400">
                          Email:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-slate-100">
                          {user?.email || "Não informado"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-slate-400">
                          Telefone:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-slate-100">
                          {user?.phone || "Não informado"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Zona de perigo */}
                  <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm rounded-2xl p-5 border border-red-200/50 dark:border-red-800/30">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                        <Trash size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-red-900 dark:text-red-100">
                          Zona de perigo
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Ações irreversíveis da conta
                        </p>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200">
                      Excluir conta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
