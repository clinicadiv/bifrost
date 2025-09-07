"use client";

import { useUserBenefits } from "@/hooks/queries/useUserBenefits";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useDependentAccess } from "@/hooks/useDependentAccess";
import { UserBenefitsData } from "@/types";
import {
  BuildingOfficeIcon,
  CalendarDotsIcon,
  DoorOpenIcon,
  FilePlusIcon,
  GearIcon,
  MapPin,
  SignInIcon,
  SquaresFourIcon,
  Users,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./Button";
import { SettingsModal } from "./SettingsModal";

const LINKS = [
  { id: 1, Icon: SquaresFourIcon, title: "Dashboard", href: "/" },
  { id: 2, Icon: CalendarDotsIcon, title: "Consultas", href: "/consultas" },
  { id: 3, Icon: BuildingOfficeIcon, title: "Convênios", href: "/convenios" },
  { id: 4, Icon: FilePlusIcon, title: "Prontuários", href: "/prontuarios" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, isLoading, openLoginModal } = useAuthStore();
  const { hasAccess: hasDependentAccess, isLoading: isDependentAccessLoading } =
    useDependentAccess();
  const { data: userBenefits, isLoading: isLoadingBenefits } = useUserBenefits(
    user?.id || ""
  );
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleOpenSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const handleCloseSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  // Função para verificar se o plano é INDIVIDUAL
  const hasIndividualPlan = () => {
    if (!userBenefits?.success || isLoadingBenefits) return false;

    const benefitsData = userBenefits.data as UserBenefitsData;
    return (
      benefitsData?.hasActivePlan && benefitsData?.plan?.type === "INDIVIDUAL"
    );
  };

  return (
    <>
      <div className="relative min-w-72 max-h-screen flex flex-col h-full bg-slate-900 border-r border-slate-700">
        {/* Header */}
        <div className="px-6 py-8 flex items-center justify-center border-b border-slate-700">
          <Image
            src="/logo.png"
            alt=""
            width={142}
            height={36}
            className="invert translate-y-0.5"
          />
        </div>

        {/* CTA Button */}
        <div className="px-6 py-6">
          <Link href="/nova-consulta">
            <Button
              variant="primary.lighter"
              className="w-full flex items-center justify-center py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200"
            >
              Agendar consulta
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-8 flex-1 w-full font-satoshi overflow-y-auto px-3">
          {!isLoading && user && (
            <div className="space-y-2">
              <h2 className="uppercase text-slate-400 font-semibold ml-4 text-xs tracking-wider mb-4">
                Geral
              </h2>

              <nav className="space-y-1">
                {LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <div key={link.id} className="relative">
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-div-green"></div>
                      )}

                      <Link
                        href={link.href}
                        className={`
                          relative flex items-center gap-3 px-4 py-3 mx-1 rounded-lg text-sm font-medium transition-colors duration-200
                          ${
                            isActive
                              ? "text-div-green bg-div-green/10"
                              : "text-slate-300 hover:text-div-green hover:bg-div-green/5"
                          }
                        `}
                      >
                        <link.Icon
                          size={18}
                          weight={isActive ? "fill" : "regular"}
                          className={`${
                            isActive ? "text-div-green" : "text-slate-400"
                          }`}
                        />
                        <span>{link.title}</span>
                      </Link>
                    </div>
                  );
                })}

                {/* Dependentes - Condicional baseado no plano INDIVIDUAL */}
                {!isLoadingBenefits && hasIndividualPlan() && (
                  <div className="relative">
                    {pathname === "/dependentes" && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-div-green"></div>
                    )}

                    <Link
                      href="/dependentes"
                      className={`
                        relative flex items-center gap-3 px-4 py-3 mx-1 rounded-lg text-sm font-medium transition-colors duration-200
                        ${
                          pathname === "/dependentes"
                            ? "text-div-green bg-div-green/10"
                            : "text-slate-300 hover:text-div-green hover:bg-div-green/5"
                        }
                      `}
                    >
                      <Users
                        size={18}
                        weight={
                          pathname === "/dependentes" ? "fill" : "regular"
                        }
                        className={`${
                          pathname === "/dependentes"
                            ? "text-div-green"
                            : "text-slate-400"
                        }`}
                      />
                      <span>Dependentes</span>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          )}

          {/* Account Section */}
          <div className="space-y-2 mt-auto pb-4">
            <h2 className="uppercase text-slate-400 font-semibold ml-4 text-xs tracking-wider mb-4">
              Conta
            </h2>

            <nav className="space-y-1">
              {!isLoading && user && (
                <>
                  <div className="relative">
                    <Link
                      href="/enderecos"
                      className={`
                        relative flex items-center gap-3 px-4 py-3 mx-1 rounded-lg text-sm font-medium transition-colors duration-200
                        ${
                          pathname === "/enderecos"
                            ? "text-div-green bg-div-green/10"
                            : "text-slate-300 hover:text-div-green hover:bg-div-green/5"
                        }
                      `}
                    >
                      <MapPin
                        size={18}
                        weight={pathname === "/enderecos" ? "fill" : "regular"}
                        className={`${
                          pathname === "/enderecos"
                            ? "text-div-green"
                            : "text-slate-400"
                        }`}
                      />
                      <span>Endereços</span>
                    </Link>
                  </div>

                  <div className="relative">
                    <button
                      onClick={handleOpenSettingsModal}
                      className="w-full flex items-center gap-3 px-4 py-3 mx-1 rounded-lg text-sm font-medium text-slate-300 hover:text-div-green hover:bg-div-green/5 transition-colors duration-200"
                    >
                      <GearIcon
                        size={18}
                        weight="regular"
                        className="text-slate-400"
                      />
                      <span>Configurações</span>
                    </button>
                  </div>
                </>
              )}

              {!isLoading && !user ? (
                <div className="relative">
                  <button
                    onClick={openLoginModal}
                    className="w-full flex items-center gap-3 px-4 py-3 mx-1 rounded-lg text-sm font-medium text-slate-300 hover:text-div-green hover:bg-div-green/5 transition-colors duration-200"
                  >
                    <SignInIcon
                      size={18}
                      weight="regular"
                      className="text-slate-400"
                    />
                    <span>Fazer Login</span>
                  </button>
                </div>
              ) : (
                !isLoading && (
                  <div className="relative">
                    <button
                      onClick={() => {
                        useAuthStore.getState().logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 mx-1 rounded-lg text-sm font-medium text-slate-300 hover:text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                    >
                      <DoorOpenIcon
                        size={18}
                        weight="regular"
                        className="text-slate-400"
                      />
                      <span>Desconectar</span>
                    </button>
                  </div>
                )
              )}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-400 flex flex-col gap-1 items-center justify-center py-6 px-6 border-t border-slate-700">
          <span className="font-medium">© 2025 Clinica Div LTDA.</span>
          <span className="italic text-slate-500">
            Created with ❤️ by Clinica Div!
          </span>
        </div>
      </div>

      {/* Modal de Configurações */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={handleCloseSettingsModal}
      />
    </>
  );
};
