/**
 * Converte um número de dias em uma string de validade formatada
 * @param days - Número de dias até a expiração
 * @returns String formatada da validade (ex: "Expira em 1 mês")
 */
export function formatExpiration(days: number): string {
  if (days <= 0) {
    return "Expirado";
  }

  if (days === 1) {
    return "Expira em 1 dia";
  }

  if (days < 7) {
    return `Expira em ${days} dias`;
  }

  if (days < 14) {
    return "Expira em 1 semana";
  }

  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "Expira em 1 semana" : `Expira em ${weeks} semanas`;
  }

  if (days < 60) {
    return "Expira em 1 mês";
  }

  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? "Expira em 1 mês" : `Expira em ${months} meses`;
  }

  if (days < 730) {
    return "Expira em 1 ano";
  }

  const years = Math.floor(days / 365);
  return years === 1 ? "Expira em 1 ano" : `Expira em ${years} anos`;
}
