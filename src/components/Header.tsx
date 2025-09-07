"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useAuthStore } from "@/hooks";
import { useUnreadNotificationsCount } from "@/hooks/queries/useNotifications";
import {
  BellIcon,
  CaretDownIcon,
  GearIcon,
  MoonIcon,
  SignOutIcon,
  SunIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { ConvenioModal } from "./ConvenioModal";
import { NotificationDropdown } from "./NotificationDropdown";
import { SettingsModal } from "./SettingsModal";
import { UserProfileModal } from "./UserProfileModal";

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isConvenioModalOpen, setIsConvenioModalOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Hook React Query para contador de notificações não lidas
  const { data: unreadNotificationsData, refetch: refreshUnreadCount } =
    useUnreadNotificationsCount(user?.id || "");

  const unreadNotificationsCount =
    unreadNotificationsData?.data?.unreadCount || 0;

  // Funções simplificadas (React Query gerencia o estado automaticamente)
  const decrementUnreadCount = () => {
    // O hook de mutations já invalida o cache automaticamente
    refreshUnreadCount();
  };

  const resetUnreadCount = () => {
    // O hook de mutations já invalida o cache automaticamente
    refreshUnreadCount();
  };

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset avatar error when user changes
  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatar]);

  const handleCloseMenu = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsMenuClosing(false);
    }, 200);
  };

  const handleToggleMenu = () => {
    if (isMenuOpen) {
      handleCloseMenu();
    } else {
      setIsMenuOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu();
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
    handleCloseMenu();
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleOpenSettingsModal = () => {
    setIsSettingsModalOpen(true);
    handleCloseMenu();
  };

  const handleCloseSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  const handleOpenConvenioModal = () => {
    setIsConvenioModalOpen(true);
  };

  const handleCloseConvenioModal = () => {
    setIsConvenioModalOpen(false);
  };

  const handleToggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
  };

  const handleCloseNotificationDropdown = () => {
    setIsNotificationDropdownOpen(false);
  };

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  const renderUserAvatar = (size: "sm" | "md" = "md") => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-12 h-12",
    };

    const textSizeClasses = {
      sm: "text-xs",
      md: "text-sm",
    };

    if (user?.avatar && !avatarError) {
      return (
        <div
          className={`${sizeClasses[size]} rounded-2xl overflow-hidden shadow-lg shadow-div-green/20 dark:shadow-div-green/30 transition-all duration-300 hover:shadow-xl hover:shadow-div-green/30 dark:hover:shadow-div-green/40 hover:scale-105 group-hover:animate-glow`}
        >
          <img
            src={user.avatar}
            alt={`Avatar de ${user.name || "Usuário"}`}
            className="w-full h-full object-cover"
            onError={handleAvatarError}
          />
        </div>
      );
    }

    return (
      <div
        className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-div-green to-emerald-400 shadow-lg shadow-div-green/20 dark:shadow-div-green/30 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:shadow-div-green/30 dark:hover:shadow-div-green/40 hover:scale-105 group-hover:animate-glow`}
      >
        <span className={`text-white font-bold ${textSizeClasses[size]}`}>
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </span>
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 w-full flex items-center justify-between px-10 py-6 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-white/20 dark:border-slate-700/50 shadow-lg shadow-black/5 dark:shadow-black/20 z-20 animate-in fade-in-0 slide-in-from-top-2 duration-700">
        <div className="flex items-center gap-3 animate-in fade-in-0 slide-in-from-left-4 duration-700">
          <div className="w-2 h-8 bg-gradient-to-b from-div-green to-emerald-400 rounded-full animate-pulse"></div>
          <h1 className="text-2xl font-bold font-satoshi bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent hover:from-div-green hover:to-emerald-400 transition-all duration-500">
            Dashboard
          </h1>
        </div>

        {/* Conteúdo condicional baseado no estado de autenticação */}
        {user ? (
          /* Usuário logado - mostra elementos originais */
          <div className="flex items-center gap-4 animate-in fade-in-0 slide-in-from-right-4 duration-700">
            {/* Notification Dropdown */}
            <div className="relative" ref={notificationRef}>
              <div className="group relative animate-bounce-subtle">
                <button
                  onClick={handleToggleNotificationDropdown}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 border border-gray-200/50 dark:border-slate-600/50 flex items-center justify-center shadow-lg shadow-black/5 dark:shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:scale-105 cursor-pointer group-hover:animate-wiggle"
                >
                  <BellIcon
                    size={18}
                    weight="duotone"
                    className="text-gray-600 dark:text-slate-300 group-hover:text-div-green transition-colors duration-300"
                  />
                </button>
                {/* Indicador de notificação */}
                {unreadNotificationsCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-400 to-red-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {unreadNotificationsCount > 9
                        ? "9+"
                        : unreadNotificationsCount}
                    </span>
                  </div>
                )}
              </div>

              {/* Notification Dropdown */}
              <NotificationDropdown
                isOpen={isNotificationDropdownOpen}
                onClose={handleCloseNotificationDropdown}
                onUnreadCountChange={{
                  refresh: refreshUnreadCount,
                  decrement: decrementUnreadCount,
                  reset: resetUnreadCount,
                }}
              />
            </div>

            <div className="group animate-float">
              <div
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 border border-gray-200/50 dark:border-slate-600/50 flex items-center justify-center shadow-lg shadow-black/5 dark:shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:scale-105 cursor-pointer"
                onClick={handleThemeToggle}
              >
                {theme === "light" ? (
                  <SunIcon
                    size={18}
                    weight="duotone"
                    className="text-gray-600 dark:text-slate-300 group-hover:text-yellow-500 transition-colors duration-300 group-hover:animate-spin-slow"
                  />
                ) : (
                  <MoonIcon
                    size={18}
                    weight="duotone"
                    className="text-gray-600 dark:text-slate-300 group-hover:text-blue-400 transition-colors duration-300 group-hover:animate-spin-slow"
                  />
                )}
              </div>
            </div>

            {/* Dados do Convênio/Plano */}
            {user.plan && (
              <>
                <div className="flex flex-col items-end animate-float-delayed">
                  <button
                    onClick={handleOpenConvenioModal}
                    className="bg-gradient-to-r from-div-green/10 to-emerald-400/10 dark:from-div-green/20 dark:to-emerald-400/20 border border-div-green/20 dark:border-div-green/30 rounded-xl px-3 py-2 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-div-green/10 dark:hover:shadow-div-green/20 hover:scale-105 cursor-pointer group"
                  >
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-semibold text-div-green dark:text-emerald-400 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                        {user.plan.planName}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-slate-400 leading-tight group-hover:text-gray-700 dark:group-hover:text-slate-300 transition-colors">
                        {user.plan.companyName}
                      </span>
                    </div>
                  </button>
                </div>
              </>
            )}

            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 dark:via-slate-600 to-transparent mx-2 animate-pulse-slow"></div>

            <div className="relative animate-float-delayed" ref={menuRef}>
              <div
                className={`group cursor-pointer flex items-center gap-3 hover:bg-gray-50/80 dark:hover:bg-slate-800/80 rounded-2xl p-3 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 ${
                  isMenuOpen
                    ? "bg-gray-50/80 dark:bg-slate-800/80 shadow-lg shadow-black/5 dark:shadow-black/20 animate-pulse-subtle"
                    : ""
                }`}
                onClick={handleToggleMenu}
              >
                {renderUserAvatar("md")}
                <div className="flex flex-col">
                  <span className="text-gray-800 dark:text-slate-200 font-semibold text-sm leading-tight">
                    {user.name || "Usuário"}
                  </span>
                  <span className="text-gray-500 dark:text-slate-400 text-xs">
                    {user.email}
                  </span>
                </div>
                <CaretDownIcon
                  size={14}
                  className={`text-gray-500 dark:text-slate-400 transition-all duration-300 ${
                    isMenuOpen ? "rotate-180" : ""
                  } group-hover:scale-110`}
                />
              </div>

              {/* Menu Dropdown */}
              {isMenuOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 py-2 z-50 ${
                    isMenuClosing ? "animate-menu-close" : "animate-menu-open"
                  }`}
                >
                  <div className="px-4 py-3 border-b border-gray-200/50 dark:border-slate-700/50 animate-menu-item-1">
                    <div className="flex items-center gap-3">
                      {renderUserAvatar("sm")}
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                          {user.name || "Usuário"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={handleOpenProfileModal}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-slate-700/80 transition-all duration-200 hover:translate-x-1 hover:shadow-sm animate-menu-item-2"
                    >
                      <UserIcon
                        size={16}
                        weight="duotone"
                        className="text-gray-500 dark:text-slate-400"
                      />
                      Meu Perfil
                    </button>

                    <button
                      onClick={handleOpenSettingsModal}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-slate-700/80 transition-all duration-200 hover:translate-x-1 hover:shadow-sm animate-menu-item-3"
                    >
                      <GearIcon
                        size={16}
                        weight="duotone"
                        className="text-gray-500 dark:text-slate-400 hover:animate-spin-slow"
                      />
                      Configurações
                    </button>
                  </div>

                  <div className="border-t border-gray-200/50 dark:border-slate-700/50 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 hover:translate-x-1 hover:shadow-sm animate-menu-item-4"
                    >
                      <SignOutIcon
                        size={16}
                        weight="duotone"
                        className="text-red-500 dark:text-red-400"
                      />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Usuário não logado - mostra botão de login */
          <div className="flex items-center gap-4 animate-in fade-in-0 slide-in-from-right-4 duration-700">
            <Button
              onClick={openLoginModal}
              className="px-8 py-3 bg-gradient-to-r from-div-green to-emerald-400 text-white rounded-2xl font-semibold shadow-lg shadow-div-green/20 dark:shadow-div-green/30 transition-all duration-300 hover:shadow-xl hover:shadow-div-green/30 dark:hover:shadow-div-green/40 hover:scale-105 hover:from-emerald-400 hover:to-div-green border-0 animate-pulse-glow"
            >
              Entrar
            </Button>
          </div>
        )}
      </header>

      {/* Modal de Perfil */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
      />

      {/* Modal de Configurações */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={handleCloseSettingsModal}
      />

      {/* Modal de Convênio */}
      <ConvenioModal
        isOpen={isConvenioModalOpen}
        onClose={handleCloseConvenioModal}
      />
    </>
  );
};
