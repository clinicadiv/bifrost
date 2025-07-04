"use client";

import { useAuthStore } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Se já está logado, redireciona para o dashboard
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Se está carregando, mostra loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-div-green"></div>
      </div>
    );
  }

  // Se já está logado, não mostra nada (redirect já foi feito)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Criar Conta</h1>
        <p className="text-gray-600 text-center">
          Página de registro (pública) - desenvolva seu formulário aqui
        </p>
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline"
          >
            Já tem uma conta? Faça login
          </button>
        </div>
      </div>
    </div>
  );
}
