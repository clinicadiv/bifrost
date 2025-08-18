"use client";

import { Button } from "@/components";
import { useAppointmentOperations } from "@/hooks/mutations/useAppointmentMutations";
import { useTestIntegration } from "@/hooks/queries/useTestIntegration";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  XCircle,
} from "@phosphor-icons/react";

/**
 * Página de teste para validar integração React Query
 *
 * Esta página mostra:
 * - Status de todos os hooks migrados
 * - Performance do cache
 * - Estados de loading/error
 * - Operações em tempo real
 */
export default function TestReactQuery() {
  const integration = useTestIntegration();
  const operations = useAppointmentOperations();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "loading":
        return <Clock size={16} className="text-yellow-500" />;
      case "error":
        return <XCircle size={16} className="text-red-500" />;
      case "success":
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "loading":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 React Query Integration Test
          </h1>
          <p className="text-gray-600">
            Página de teste para validar a migração dos hooks para React Query
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status Geral</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integration.summary.allDataLoaded ? "✅" : "⏳"}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  integration.summary.allDataLoaded
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {integration.summary.allDataLoaded ? (
                  <CheckCircle size={24} weight="bold" />
                ) : (
                  <Clock size={24} weight="bold" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Consultas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integration.summary.totalAppointments}
                </p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <RefreshCw size={24} weight="bold" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Prontuários</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integration.summary.totalMedicalRecords}
                </p>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <RefreshCw size={24} weight="bold" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Notificações</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integration.summary.unreadNotifications}
                </p>
              </div>
              <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                <RefreshCw size={24} weight="bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Status das Queries */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Status das Queries
            </h2>
            <p className="text-gray-600 text-sm">
              Estado atual de cada hook React Query
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(integration.summary.queriesStatus).map(
                ([key, status]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border ${getStatusColor(
                      status
                    )}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(status)}
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                    <p className="text-sm opacity-75 capitalize">{status}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Cache Status */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Status do Cache
            </h2>
            <p className="text-gray-600 text-sm">
              Informações sobre freshness dos dados
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(integration.summary.cacheStatus).map(
                ([key, isStale]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border ${
                      isStale
                        ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                        : "bg-green-50 border-green-200 text-green-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isStale ? (
                        <AlertCircle size={16} className="text-yellow-600" />
                      ) : (
                        <CheckCircle size={16} className="text-green-600" />
                      )}
                      <span className="font-medium capitalize">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace("Stale", "")
                          .trim()}
                      </span>
                    </div>
                    <p className="text-sm opacity-75">
                      {isStale ? "Dados obsoletos" : "Dados frescos"}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Operations Test */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Teste de Operações
            </h2>
            <p className="text-gray-600 text-sm">
              Testar mutations e operações
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Reagendamento</p>
                <div
                  className={`p-3 rounded-lg ${
                    operations.isRescheduling
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {operations.isRescheduling ? (
                    <Clock size={24} className="mx-auto animate-spin" />
                  ) : (
                    <CheckCircle size={24} className="mx-auto" />
                  )}
                </div>
                <p className="text-xs mt-1">
                  {operations.isRescheduling ? "Em andamento" : "Disponível"}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Cancelamento</p>
                <div
                  className={`p-3 rounded-lg ${
                    operations.isCancelling
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {operations.isCancelling ? (
                    <Clock size={24} className="mx-auto animate-spin" />
                  ) : (
                    <CheckCircle size={24} className="mx-auto" />
                  )}
                </div>
                <p className="text-xs mt-1">
                  {operations.isCancelling ? "Em andamento" : "Disponível"}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">PIX</p>
                <div
                  className={`p-3 rounded-lg ${
                    operations.isLoadingPix
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {operations.isLoadingPix ? (
                    <Clock size={24} className="mx-auto animate-spin" />
                  ) : (
                    <CheckCircle size={24} className="mx-auto" />
                  )}
                </div>
                <p className="text-xs mt-1">
                  {operations.isLoadingPix ? "Carregando" : "Disponível"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Debug Info</h2>
            <p className="text-gray-600 text-sm">
              Informações técnicas para debug
            </p>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-800">
                {JSON.stringify(integration.summary, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button
            variant="primary.regular"
            onClick={() => window.location.reload()}
          >
            Recarregar Página
          </Button>
          <Button
            variant="secondary.regular"
            onClick={() => {
              if (typeof window !== "undefined") {
                // @ts-ignore
                window.debugQueries?.();
              }
            }}
          >
            Debug Queries (Console)
          </Button>
          <Button
            variant="secondary.regular"
            onClick={() => {
              if (typeof window !== "undefined") {
                // @ts-ignore
                window.clearQueryCache?.();
              }
            }}
          >
            Limpar Cache
          </Button>
        </div>
      </div>
    </div>
  );
}
