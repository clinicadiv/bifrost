"use client";

import { useAuthStore } from "@/hooks";
import { BellIcon, SunIcon } from "@phosphor-icons/react";
import { Button } from "./Button";

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);

  return (
    <header className="sticky top-0 w-full flex items-center justify-between px-10 py-5 border-b border-gray-300 bg-white z-20">
      <h1 className="uppercase font-medium font-satoshi text-gray-700">
        Dashboard
      </h1>

      {/* Conteúdo condicional baseado no estado de autenticação */}
      {user ? (
        /* Usuário logado - mostra elementos originais */
        <div className="flex items-center gap-5">
          <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center shadow-xl">
            <BellIcon size={14} weight="duotone" />
          </div>

          <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center shadow-xl">
            <SunIcon size={14} weight="duotone" />
          </div>

          <div className="w-10 h-10 rounded-full bg-div-green ml-5"></div>
        </div>
      ) : (
        /* Usuário não logado - mostra botão de login */
        <Button
          onClick={openLoginModal}
          className="px-6 py-2 bg-div-green text-black rounded-lg font-medium hover:bg-div-green-darker transition-colors"
        >
          Login
        </Button>
      )}
    </header>
  );
};
