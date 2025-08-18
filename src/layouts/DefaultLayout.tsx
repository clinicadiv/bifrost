"use client";

import * as animationData from "@/assets/animations/loading-animation.json";
import { Header, Sidebar } from "@/components";
import { Login } from "@/components/Login";
import { useAuthStore } from "@/hooks";
import { isPublicRoute } from "@/utils/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Lottie from "react-lottie";

const queryClient = new QueryClient();

export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const pathname = usePathname();

  // Páginas que devem ter layout standalone (sem sidebar/header)
  const STANDALONE_PAGES = [
    "/criar-conta",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const isStandalonePage = STANDALONE_PAGES.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Abre modal apenas se: usuário não logado E tentando acessar rota privada E não é página standalone
    if (!isLoading && !user && !isPublicRoute(pathname) && !isStandalonePage) {
      openLoginModal();
    }
  }, [isLoading, user, pathname, openLoginModal, isStandalonePage]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-screen bg-white dark:bg-slate-900">
        <AnimatePresence>
          <motion.div
            initial={{
              y: "0%",
            }}
            animate={isLoading ? { y: "0%" } : { y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="absolute z-50 w-screen h-screen bg-[#1e1e1e] flex items-center justify-center flex-col gap-10 text-white font-sagace font-medium text-3xl"
          >
            <div className="w-2/12 mx-auto">
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: animationData,
                  rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice",
                  },
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Modal de login sempre disponível */}
        <Login />

        {/* Renderização condicional baseada no estado de autenticação e rota */}
        {!isLoading && (
          <>
            {/* Se é uma página standalone (fullscreen) */}
            {isStandalonePage ? (
              <div className="w-full h-full">{children}</div>
            ) : (
              <>
                {/* Se é uma rota pública com layout do sistema */}
                {isPublicRoute(pathname) ? (
                  <div className="w-full h-full grid grid-cols-[auto_1fr] bg-white dark:bg-slate-900">
                    <Sidebar />
                    <div className="w-full h-full flex flex-col overflow-y-auto bg-white dark:bg-slate-900">
                      <Header />
                      <div className="p-5 flex flex-1 bg-gray-50 dark:bg-slate-800">
                        {children}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Layout padrão para usuários autenticados em rotas privadas */
                  user && (
                    <div className="w-full h-full grid grid-cols-[auto_1fr] bg-white dark:bg-slate-900">
                      <Sidebar />
                      <div className="w-full h-full flex flex-col overflow-y-auto bg-white dark:bg-slate-900">
                        <Header />
                        <div className="p-10 flex flex-1 bg-gray-50 dark:bg-slate-800">
                          {children}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </>
            )}
          </>
        )}
      </div>
    </QueryClientProvider>
  );
};
