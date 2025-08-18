import {
  getMedicalRecords,
  MedicalRecord,
} from "@/services/http/medical-records";
import { useCallback, useState } from "react";
import { useAuthStore } from "./useAuthStore";

export interface UseMedicalRecordsReturn {
  medicalRecords: MedicalRecord[];
  psychologicalRecords: MedicalRecord[];
  psychiatricRecords: MedicalRecord[];
  isLoading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  loadMedicalRecords: (userId: string, page?: number) => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  refreshRecords: () => Promise<void>;
}

export const useMedicalRecords = (): UseMedicalRecordsReturn => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { token } = useAuthStore();

  // Separar registros psicológicos e psiquiátricos
  const psychologicalRecords = medicalRecords.filter(
    (record) => record.medical.type === "psychologist"
  );

  const psychiatricRecords = medicalRecords.filter(
    (record) => record.medical.type === "psychiatrist"
  );

  const hasNextPage = page * limit < total;
  const hasPrevPage = page > 1;

  const loadMedicalRecords = useCallback(
    async (userId: string, pageNumber: number = 1) => {
      if (!token) {
        setError("Token de autenticação não encontrado.");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        setCurrentUserId(userId);

        const response = await getMedicalRecords(userId, token, {
          page: pageNumber,
          limit,
        });

        setMedicalRecords(response.results);
        setPage(response.page);
        setTotal(response.total);
      } catch (err) {
        console.error("Erro ao carregar prontuários:", err);
        setError("Erro ao carregar os prontuários. Tente novamente.");
        setMedicalRecords([]);
      } finally {
        setIsLoading(false);
      }
    },
    [limit, token]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage && currentUserId) {
      const nextPageNumber = page + 1;
      setPage(nextPageNumber);
      loadMedicalRecords(currentUserId, nextPageNumber);
    }
  }, [hasNextPage, currentUserId, page, loadMedicalRecords]);

  const prevPage = useCallback(() => {
    if (hasPrevPage && currentUserId) {
      const prevPageNumber = page - 1;
      setPage(prevPageNumber);
      loadMedicalRecords(currentUserId, prevPageNumber);
    }
  }, [hasPrevPage, currentUserId, page, loadMedicalRecords]);

  const refreshRecords = useCallback(async () => {
    if (currentUserId) {
      await loadMedicalRecords(currentUserId, page);
    }
  }, [currentUserId, page, loadMedicalRecords]);

  return {
    medicalRecords,
    psychologicalRecords,
    psychiatricRecords,
    isLoading,
    error,
    page,
    limit,
    total,
    hasNextPage,
    hasPrevPage,
    loadMedicalRecords,
    nextPage,
    prevPage,
    refreshRecords,
  };
};
