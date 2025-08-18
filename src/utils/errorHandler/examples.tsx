/**
 * Exemplos práticos de uso do sistema de tratamento de erros
 */

import {
  ErrorDisplay,
  ErrorInline,
  FormError,
  PageErrorBoundary,
} from "@/components/ErrorBoundary";
import { useErrorHandler, useFormErrorHandler } from "@/hooks/useErrorHandler";
import { api } from "@/services/api";
import React, { useState } from "react";

// =============================================================================
// 1. EXEMPLO: Layout Principal com Error Display
// =============================================================================

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageErrorBoundary pageTitle="Aplicação">
      <div className="min-h-screen bg-gray-50">
        <header>{/* Seu header aqui */}</header>

        <main>{children}</main>

        {/* Sistema de erro global - deve estar no root */}
        <ErrorDisplay />
      </div>
    </PageErrorBoundary>
  );
}

// =============================================================================
// 2. EXEMPLO: Formulário com Validação de Erros
// =============================================================================

export function LoginFormExample() {
  const { fieldErrors, generalError, processFormError, clearFormErrors } =
    useFormErrorHandler();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearFormErrors();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      await api.post("/auth/login", data);
      // Sucesso - redirecionar ou atualizar estado
    } catch (error) {
      processFormError(error, "loginForm");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={`input ${fieldErrors.email ? "border-red-500" : ""}`}
        />
        <FormError errors={fieldErrors} fieldName="email" />
      </div>

      <div>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className={`input ${fieldErrors.password ? "border-red-500" : ""}`}
        />
        <FormError errors={fieldErrors} fieldName="password" />
      </div>

      {generalError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{generalError}</p>
        </div>
      )}

      <button type="submit" disabled={isLoading} className="btn btn-primary">
        {isLoading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

// =============================================================================
// 3. EXEMPLO: Componente com Retry Automático
// =============================================================================

export function DataFetcherExample() {
  const { withRetry, isRetrying, handleError } = useErrorHandler({
    showToast: true,
    autoRetry: true,
  });

  const [data, setData] = useState(null);
  const [error, setError] = useState<{ error: any; result: any } | null>(null);

  const fetchData = async () => {
    setError(null);

    try {
      const result = await withRetry(async () => {
        const response = await api.get("/api/data");
        return response.data;
      });

      setData(result);
    } catch (error) {
      const result = handleError(error);
      setError({ error, result });
    }
  };

  return (
    <div className="p-6">
      <h2>Dados Importantes</h2>

      {error && (
        <ErrorInline
          error={error.error}
          result={error.result}
          variant="default"
          onClose={() => setError(null)}
          onAction={(action) => {
            if (action === "retry") {
              fetchData();
            }
            setError(null);
          }}
        />
      )}

      {data ? (
        <div>
          {/* Renderizar dados */}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <button
          onClick={fetchData}
          disabled={isRetrying}
          className="btn btn-primary"
        >
          {isRetrying ? "Carregando..." : "Carregar Dados"}
        </button>
      )}
    </div>
  );
}

// =============================================================================
// 4. EXEMPLO: Lista com Paginação e Tratamento de Erros
// =============================================================================

export function UserListExample() {
  const { handleError, withRetry } = useErrorHandler();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadUsers = async (pageNum: number = 1) => {
    setLoading(true);

    try {
      const result = await withRetry(async () => {
        const response = await api.get(`/api/users?page=${pageNum}`);
        return response.data;
      });

      setUsers(result.data);
      setPage(pageNum);
    } catch (error) {
      handleError(error, {
        showToast: true,
        onRetry: () => loadUsers(pageNum),
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await api.delete(`/api/users/${userId}`);
      // Reload da lista
      await loadUsers(page);
    } catch (error) {
      handleError(error, {
        showToast: true,
        customActions: [
          {
            label: "Tentar novamente",
            action: () => deleteUser(userId),
            type: "primary",
          },
        ],
      });
    }
  };

  React.useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="space-y-4">
      <h2>Usuários</h2>

      {loading && <div>Carregando...</div>}

      <div className="grid gap-4">
        {users.map((user: any) => (
          <div
            key={user.id}
            className="flex justify-between items-center p-4 border rounded"
          >
            <span>{user.name}</span>
            <button
              onClick={() => deleteUser(user.id)}
              className="btn btn-danger"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => loadUsers(page - 1)}
          disabled={page <= 1 || loading}
          className="btn btn-secondary"
        >
          Anterior
        </button>
        <span>Página {page}</span>
        <button
          onClick={() => loadUsers(page + 1)}
          disabled={loading}
          className="btn btn-secondary"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// 5. EXEMPLO: Componente com Error Boundary Específico
// =============================================================================

export function CriticalSectionExample() {
  return (
    <PageErrorBoundary
      pageTitle="Seção Crítica"
      onError={(error, errorInfo) => {
        // Log específico para esta seção
        console.error("Erro na seção crítica:", { error, errorInfo });

        // Enviar para monitoramento
        // sendToSentry(error, { section: 'critical' });
      }}
    >
      <div className="p-6 bg-red-50 border border-red-200 rounded">
        <h3>Componente que pode falhar</h3>
        <ComponenteThatMightFail />
      </div>
    </PageErrorBoundary>
  );
}

function ComponenteThatMightFail() {
  const [shouldFail, setShouldFail] = useState(false);

  if (shouldFail) {
    throw new Error("Erro simulado para testar Error Boundary");
  }

  return (
    <div>
      <p>Este componente está funcionando normalmente.</p>
      <button onClick={() => setShouldFail(true)} className="btn btn-danger">
        Simular Erro
      </button>
    </div>
  );
}

// =============================================================================
// 6. EXEMPLO: Hook Customizado para Casos Específicos
// =============================================================================

export function usePaymentErrors() {
  const { handleError, handleAction } = useErrorHandler({
    showToast: false,
    showModal: true,
  });

  const processPaymentError = (error: any) => {
    const result = handleError(error, {
      customActions: [
        {
          label: "Tentar outro cartão",
          action: () => {
            // Navegar para seleção de cartão
            handleAction("redirect-payment");
          },
          type: "primary",
        },
        {
          label: "Falar com suporte",
          action: () => {
            // Abrir chat de suporte
            window.open("/suporte", "_blank");
          },
          type: "secondary",
        },
      ],
    });

    // Analytics específicos para pagamento
    if (error.category === "payment") {
      // analytics.track('payment_error', { code: error.code });
    }

    return result;
  };

  return { processPaymentError };
}

// Uso do hook customizado
export function PaymentFormExample() {
  const { processPaymentError } = usePaymentErrors();

  const handlePayment = async (paymentData: any) => {
    try {
      await api.post("/api/payments", paymentData);
      // Sucesso
    } catch (error) {
      processPaymentError(error);
    }
  };

  return (
    <div>
      {/* Formulário de pagamento */}
      <button onClick={() => handlePayment({})}>Processar Pagamento</button>
    </div>
  );
}
