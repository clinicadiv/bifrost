"use client";

import { useAuthStore } from "@/hooks";
import {
  BellIcon,
  CaretDownIcon,
  GearIcon,
  SignOutIcon,
  SunIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const logout = useAuthStore((state) => state.logout);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className="sticky top-0 w-full flex items-center justify-between px-10 py-6 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg shadow-black/5 z-20 animate-in fade-in-0 slide-in-from-top-2 duration-700">
      <div className="flex items-center gap-3 animate-in fade-in-0 slide-in-from-left-4 duration-700">
        <div className="w-2 h-8 bg-gradient-to-b from-div-green to-emerald-400 rounded-full animate-pulse"></div>
        <h1 className="text-2xl font-bold font-satoshi bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent hover:from-div-green hover:to-emerald-400 transition-all duration-500">
          Dashboard
        </h1>
      </div>

      {/* Conteúdo condicional baseado no estado de autenticação */}
      {user ? (
        /* Usuário logado - mostra elementos originais */
        <div className="flex items-center gap-4 animate-in fade-in-0 slide-in-from-right-4 duration-700">
          <div className="group relative animate-bounce-subtle">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 flex items-center justify-center shadow-lg shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:scale-105 cursor-pointer group-hover:animate-wiggle">
              <BellIcon
                size={18}
                weight="duotone"
                className="text-gray-600 group-hover:text-div-green transition-colors duration-300"
              />
            </div>
            {/* Indicador de notificação */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-red-400 to-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
          </div>

          <div className="group animate-float">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 flex items-center justify-center shadow-lg shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:scale-105 cursor-pointer">
              <SunIcon
                size={18}
                weight="duotone"
                className="text-gray-600 group-hover:text-yellow-500 transition-colors duration-300 group-hover:animate-spin-slow"
              />
            </div>
          </div>

          <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2 animate-pulse-slow"></div>

          <div className="relative animate-float-delayed" ref={menuRef}>
            <div
              className={`group cursor-pointer flex items-center gap-3 hover:bg-gray-50/80 rounded-2xl p-3 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 ${
                isMenuOpen
                  ? "bg-gray-50/80 shadow-lg shadow-black/5 animate-pulse-subtle"
                  : ""
              }`}
              onClick={handleToggleMenu}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-div-green to-emerald-400 shadow-lg shadow-div-green/20 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:shadow-div-green/30 hover:scale-105 group-hover:animate-glow">
                <span className="text-white font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-800 font-semibold text-sm leading-tight">
                  {user.name || "Usuário"}
                </span>
                <span className="text-gray-500 text-xs">{user.email}</span>
              </div>
              <CaretDownIcon
                size={14}
                className={`text-gray-500 transition-all duration-300 ${
                  isMenuOpen ? "rotate-180" : ""
                } group-hover:scale-110`}
              />
            </div>

            {/* Menu Dropdown */}
            {isMenuOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl shadow-black/10 py-2 z-50 ${
                  isMenuClosing ? "animate-menu-close" : "animate-menu-open"
                }`}
              >
                <div className="px-4 py-3 border-b border-gray-200/50 animate-menu-item-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.name || "Usuário"}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                <div className="py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-all duration-200 hover:translate-x-1 hover:shadow-sm animate-menu-item-2">
                    <UserIcon
                      size={16}
                      weight="duotone"
                      className="text-gray-500"
                    />
                    Meu Perfil
                  </button>

                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-all duration-200 hover:translate-x-1 hover:shadow-sm animate-menu-item-3">
                    <GearIcon
                      size={16}
                      weight="duotone"
                      className="text-gray-500 hover:animate-spin-slow"
                    />
                    Configurações
                  </button>
                </div>

                <div className="border-t border-gray-200/50 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-all duration-200 hover:translate-x-1 hover:shadow-sm animate-menu-item-4"
                  >
                    <SignOutIcon
                      size={16}
                      weight="duotone"
                      className="text-red-500"
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
            className="px-8 py-3 bg-gradient-to-r from-div-green to-emerald-400 text-white rounded-2xl font-semibold shadow-lg shadow-div-green/20 transition-all duration-300 hover:shadow-xl hover:shadow-div-green/30 hover:scale-105 hover:from-emerald-400 hover:to-div-green border-0 animate-pulse-glow"
          >
            Entrar
          </Button>
        </div>
      )}
    </header>
  );
};
