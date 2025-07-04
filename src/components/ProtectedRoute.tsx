"use client";

import { useAuthStore } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Se não está carregando e não há usuário logado, redireciona
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-div-green"></div>
      </div>
    );
  }

  // Se não há usuário, não renderiza nada (redirect já foi feito)
  if (!user) {
    return null;
  }

  // Se tudo ok, renderiza os children
  return <>{children}</>;
};
