/**
 * Formata um CNPJ adicionando máscara
 * @param cnpj - CNPJ sem formatação (apenas números)
 * @returns CNPJ formatado no padrão XX.XXX.XXX/XXXX-XX
 */
export function formatCNPJ(cnpj: string): string {
  // Remove todos os caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, "");

  // Se não tem 14 dígitos, retorna o valor original
  if (cleanCNPJ.length !== 14) {
    return cnpj;
  }

  // Aplica a máscara XX.XXX.XXX/XXXX-XX
  return cleanCNPJ.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

/**
 * Formata um CPF adicionando máscara
 * @param cpf - CPF sem formatação (apenas números)
 * @returns CPF formatado no padrão XXX.XXX.XXX-XX
 */
export function formatCPF(cpf: string): string {
  // Remove todos os caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, "");

  // Se não tem 11 dígitos, retorna o valor original
  if (cleanCPF.length !== 11) {
    return cpf;
  }

  // Aplica a máscara XXX.XXX.XXX-XX
  return cleanCPF.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

/**
 * Formata um documento (CPF ou CNPJ) automaticamente
 * @param document - Documento sem formatação
 * @returns Documento formatado com a máscara apropriada
 */
export function formatDocument(document: string): string {
  const cleanDocument = document.replace(/\D/g, "");

  if (cleanDocument.length === 11) {
    return formatCPF(document);
  } else if (cleanDocument.length === 14) {
    return formatCNPJ(document);
  }

  return document;
}
