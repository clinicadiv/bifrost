"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import {
  BrainIcon,
  BuildingOfficeIcon,
  CalendarDotsIcon,
  DoorOpenIcon,
  FilePlusIcon,
  GearIcon,
  MedalIcon,
  SignInIcon,
  SquaresFourIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./Button";

const LINKS = [
  { id: 1, Icon: SquaresFourIcon, title: "Dashboard", href: "/" },
  { id: 2, Icon: CalendarDotsIcon, title: "Consultas", href: "/consultas" },
  {
    id: 3,
    Icon: BrainIcon,
    title: "Índice saúde mental",
    href: "/indice-saude",
  },
  { id: 4, Icon: MedalIcon, title: "Psico+", href: "/psico-plus" },
  { id: 5, Icon: BuildingOfficeIcon, title: "Convênios", href: "/convenios" },
  { id: 6, Icon: UsersThreeIcon, title: "Dependentes", href: "/dependentes" },
  { id: 7, Icon: FilePlusIcon, title: "Prontuários", href: "/prontuarios" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, isLoading, openLoginModal } = useAuthStore();

  return (
    <div className="relative min-w-72 max-h-screen flex flex-col h-full bg-neutral-900 border-r border-neutral-700/50">
      {/* Header */}
      <div className="px-6 py-8 flex items-center justify-center border-b border-neutral-700/30">
        <Image
          src="/logo.png"
          alt=""
          width={142}
          height={36}
          className="invert translate-y-2.5"
        />
      </div>

      {/* CTA Button */}
      <div className="px-6 py-6">
        <Link href="/nova-consulta">
          <Button
            variant="primary.lighter"
            className="w-full flex items-center justify-center py-2.5 bg-div-green hover:bg-emerald-500 text-neutral-900 hover:text-neutral-800 rounded-lg font-semibold text-sm transition-colors duration-200"
          >
            Agendar consulta
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-8 flex-1 w-full font-satoshi overflow-y-auto px-3">
        {!isLoading && user && (
          <div className="space-y-2">
            <h2 className="uppercase text-neutral-400 font-semibold ml-4 text-xs tracking-wider mb-4">
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
                            ? "text-div-green bg-div-green/5"
                            : "text-neutral-300 hover:text-white hover:bg-neutral-800/50"
                        }
                      `}
                    >
                      <link.Icon
                        size={18}
                        weight={isActive ? "fill" : "regular"}
                        className={`${
                          isActive ? "text-div-green" : "text-neutral-400"
                        }`}
                      />
                      <span>{link.title}</span>
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>
        )}

        {/* Account Section */}
        <div className="space-y-2 mt-auto pb-4">
          <h2 className="uppercase text-neutral-400 font-semibold ml-4 text-xs tracking-wider mb-4">
            Conta
          </h2>

          <nav className="space-y-1">
            {!isLoading && user && (
              <div className="relative">
                <button className="w-full flex items-center gap-3 px-4 py-3 mx-1 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors duration-200">
                  <GearIcon
                    size={18}
                    weight="regular"
                    className="text-neutral-400"
                  />
                  <span>Configurações</span>
                </button>
              </div>
            )}

            {!isLoading && !user ? (
              <div className="relative">
                <button
                  onClick={openLoginModal}
                  className="w-full flex items-center gap-3 px-4 py-3 mx-1 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors duration-200"
                >
                  <SignInIcon
                    size={18}
                    weight="regular"
                    className="text-neutral-400"
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
                    className="w-full flex items-center gap-3 px-4 py-3 mx-1 rounded-lg text-sm font-medium text-neutral-300 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                  >
                    <DoorOpenIcon
                      size={18}
                      weight="regular"
                      className="text-neutral-400"
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
      <div className="text-xs text-neutral-400 flex flex-col gap-1 items-center justify-center py-6 px-6 border-t border-neutral-700/30">
        <span className="font-medium">© 2025 Clinica Div LTDA.</span>
        <span className="italic text-neutral-500">
          Created with ❤️ by Clinica Div!
        </span>
      </div>
    </div>
  );
};
