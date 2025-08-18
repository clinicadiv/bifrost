"use client";

import { AddressFormModal } from "@/components";
import { useAuthStore } from "@/hooks";
import { useAddressOperations } from "@/hooks/mutations/useAddressMutations";
import { useAddresses } from "@/hooks/queries/useAddresses";
import { Address } from "@/types";
import {
  Buildings,
  House,
  MagnifyingGlass,
  MapPin,
  PencilSimple,
  Plus,
  SortAscending,
  SortDescending,
  Star,
  TrashSimple,
  Warning,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const headerVariants = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const filterVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    x: -30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const statsVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function EnderecosList() {
  const { user } = useAuthStore();

  // React Query hooks - muito mais simples!
  const addressesQuery = useAddresses(user?.id || "");
  const loading = addressesQuery.isLoading;

  // Memoizar addresses para evitar re-renders desnecessários
  const addresses = useMemo(() => {
    // O hook useAddresses retorna dados transformados pelo select
    const data = addressesQuery.data as { addresses?: Address[] };
    return data?.addresses || [];
  }, [addressesQuery.data]);

  const { deleteAddress, isDeleting: deleting } = useAddressOperations();

  // Estados locais simplificados (apenas UI)
  const [filteredAddresses, setFilteredAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "city" | "createdAt">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const filterAndSortAddresses = useCallback(() => {
    // Ensure addresses is always an array
    if (!Array.isArray(addresses)) {
      setFilteredAddresses([]);
      return;
    }

    let filtered = addresses;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = addresses.filter(
        (address) =>
          address.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.neighborhood
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "city":
          aValue = a.city.toLowerCase();
          bValue = b.city.toLowerCase();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredAddresses(filtered);
  }, [addresses, searchTerm, sortBy, sortOrder]);

  // Filtrar e ordenar endereços quando dados ou filtros mudarem
  useEffect(() => {
    filterAndSortAddresses();
  }, [filterAndSortAddresses]);

  const handleAddressFormSuccess = () => {
    // React Query invalida cache automaticamente após mutations!
    setShowAddressForm(false);
    setEditingAddress(undefined);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(undefined);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (address: Address) => {
    setAddressToDelete(address);
    setShowDeleteModal(true);
  };

  // Função simplificada para deletar endereço (React Query gerencia tudo!)
  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      await deleteAddress(addressToDelete.id);
      // Cache é invalidado automaticamente + optimistic update!
      setShowDeleteModal(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar endereço:", error);
      // Error handling é feito automaticamente pelo hook
    }
  };

  const cancelDeleteAddress = () => {
    setShowDeleteModal(false);
    setAddressToDelete(null);
  };

  const handleSortChange = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const formatAddress = (address: Address) => {
    return `${address.street}, ${address.number}${
      address.complement ? `, ${address.complement}` : ""
    } - ${address.neighborhood}, ${address.city}/${address.state}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <motion.div
        className="w-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="w-full px-4 py-8">
          {/* Header */}
          <motion.div className="mb-8" variants={headerVariants}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-div-green to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-div-green/25"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <MapPin size={24} />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    Meus Endereços
                  </h1>
                  <p className="text-gray-600 dark:text-slate-400">
                    Gerencie seus endereços de entrega e cobrança
                  </p>
                </div>
              </div>
            </div>

            {/* Filtros e Ações */}
            <motion.div
              className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-slate-700/30"
              variants={filterVariants}
            >
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Busca */}
                <div className="relative flex-1 max-w-md">
                  <MagnifyingGlass
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Buscar endereços..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-slate-700/50 border border-gray-300/50 dark:border-slate-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-div-green/50 focus:border-div-green/50 transition-all duration-200"
                  />
                </div>

                {/* Ordenação */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-slate-400">
                    Ordenar por:
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSortChange("title")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                        sortBy === "title"
                          ? "bg-div-green text-white shadow-md"
                          : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      Título
                      {sortBy === "title" &&
                        (sortOrder === "asc" ? (
                          <SortAscending size={12} className="inline ml-1" />
                        ) : (
                          <SortDescending size={12} className="inline ml-1" />
                        ))}
                    </button>
                    <button
                      onClick={() => handleSortChange("city")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                        sortBy === "city"
                          ? "bg-div-green text-white shadow-md"
                          : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      Cidade
                      {sortBy === "city" &&
                        (sortOrder === "asc" ? (
                          <SortAscending size={12} className="inline ml-1" />
                        ) : (
                          <SortDescending size={12} className="inline ml-1" />
                        ))}
                    </button>
                    <button
                      onClick={() => handleSortChange("createdAt")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                        sortBy === "createdAt"
                          ? "bg-div-green text-white shadow-md"
                          : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      Data
                      {sortBy === "createdAt" &&
                        (sortOrder === "asc" ? (
                          <SortAscending size={12} className="inline ml-1" />
                        ) : (
                          <SortDescending size={12} className="inline ml-1" />
                        ))}
                    </button>
                  </div>
                </div>

                {/* Botão Adicionar */}
                <motion.button
                  onClick={handleAddNewAddress}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-div-green to-emerald-400 hover:from-emerald-400 hover:to-div-green text-gray-900 font-medium rounded-lg transition-all duration-300 shadow-lg shadow-div-green/20 hover:shadow-xl hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={16} />
                  Novo Endereço
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Lista de Endereços */}
          <div className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/30 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="animate-spin w-12 h-12 border-2 border-div-green border-t-transparent rounded-full mx-auto mb-4"
                />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-700 dark:text-slate-400"
                >
                  Carregando endereços...
                </motion.p>
              </div>
            ) : filteredAddresses.length === 0 ? (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ scale: 1.1 }}
                  className="inline-block"
                >
                  <Buildings
                    size={64}
                    className="mx-auto text-gray-400 dark:text-slate-500 mb-4"
                  />
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                  {searchTerm
                    ? "Nenhum endereço encontrado"
                    : "Nenhum endereço cadastrado"}
                </h3>
                <p className="text-gray-600 dark:text-slate-400 mb-6">
                  {searchTerm
                    ? "Tente alterar os termos de busca ou adicionar um novo endereço."
                    : "Adicione seu primeiro endereço para facilitar futuras compras."}
                </p>
                <motion.button
                  onClick={handleAddNewAddress}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-div-green to-emerald-400 hover:from-emerald-400 hover:to-div-green text-gray-900 font-medium rounded-lg transition-all duration-300 shadow-lg shadow-div-green/20 hover:shadow-xl hover:scale-105 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} />
                  Adicionar Endereço
                </motion.button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200/50 dark:divide-slate-700/30">
                {filteredAddresses.map((address) => (
                  <motion.div
                    key={address.id}
                    className="p-6 hover:bg-white/95 dark:hover:bg-slate-800/90 transition-colors duration-200 group"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.2 }}
                    variants={cardVariants}
                    whileHover={{
                      scale: 1.01,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0"
                          whileHover={{ scale: 1.08, rotate: 3 }}
                          transition={{ duration: 0.15 }}
                        >
                          <House size={20} className="text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                              {address.title}
                            </h3>
                            {address.isDefault && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-div-green/20 text-div-green text-xs font-medium rounded-full">
                                <Star size={12} weight="fill" />
                                Padrão
                              </div>
                            )}
                          </div>
                          <p className="text-gray-800 dark:text-slate-300 text-sm leading-relaxed mb-2">
                            {formatAddress(address)}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-slate-400">
                            <span>CEP: {address.zipCode}</span>
                            <span>•</span>
                            <span>
                              Criado em {formatDate(address.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 transition-all duration-200">
                        <motion.button
                          onClick={() => handleEditAddress(address)}
                          className="p-2 rounded-lg bg-white/90 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700 transition-colors duration-200 shadow-lg border border-gray-200/50 dark:border-transparent"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          title="Editar endereço"
                        >
                          <PencilSimple
                            size={16}
                            className="text-gray-700 dark:text-slate-400"
                          />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteAddress(address)}
                          className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors duration-200 shadow-lg border border-red-200/50 dark:border-transparent"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          title="Excluir endereço"
                        >
                          <TrashSimple
                            size={16}
                            className="text-red-600 dark:text-red-400"
                          />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Estatísticas */}
          {filteredAddresses.length > 0 && (
            <motion.div
              className="mt-6 bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-slate-700/30"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={statsVariants}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-1">
                    {filteredAddresses.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">
                    Endereços {searchTerm ? "encontrados" : "cadastrados"}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-1">
                    {filteredAddresses.filter((a) => a.isDefault).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">
                    Endereço padrão
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-1">
                    {new Set(filteredAddresses.map((a) => a.city)).size}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">
                    Cidades diferentes
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/50 dark:border-slate-700/30 p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                <Warning size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Excluir Endereço
                </h3>
                <p className="text-sm text-gray-700 dark:text-slate-400">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-800 dark:text-slate-300 mb-2">
                Deseja realmente excluir o endereço:
              </p>
              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3">
                <p className="font-medium text-gray-900 dark:text-slate-100">
                  {addressToDelete?.title}
                </p>
                <p className="text-sm text-gray-700 dark:text-slate-400">
                  {addressToDelete && formatAddress(addressToDelete)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelDeleteAddress}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-slate-200 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteAddress}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Address Form Modal */}
      <AddressFormModal
        isOpen={showAddressForm}
        onClose={() => setShowAddressForm(false)}
        onSuccess={handleAddressFormSuccess}
        editingAddress={editingAddress}
      />
    </>
  );
}
