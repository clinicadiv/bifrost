export function minuteToHour(minutos: number): string {
  // Calcula as horas (divisão inteira)
  const horas = Math.floor(minutos / 60);

  // Calcula os minutos restantes
  const minutosRestantes = minutos % 60;

  // Formata com zero à esquerda, se necessário
  const horasFormatadas = horas.toString().padStart(2, '0');
  const minutosFormatados = minutosRestantes.toString().padStart(2, '0');

  // Retorna no formato HH:MM
  return `${horasFormatadas}:${minutosFormatados}`;
}
