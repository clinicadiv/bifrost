/**
 * Utilitários para manipulação de datas sem problemas de fuso horário
 */

// Função para formatar data no formato YYYY-MM-DD usando o fuso horário local
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Função para criar uma data sem problemas de fuso horário
export function createLocalDate(dateString: string): Date {
  // Se a string já tem horário, usar como está
  if (dateString.includes("T")) {
    return new Date(dateString);
  }

  // Se é apenas data (YYYY-MM-DD), adicionar horário para evitar UTC
  return new Date(`${dateString}T12:00:00`);
}

// Função para formatar data e hora para exibição
export function formatDateForDisplay(dateString: string): {
  dia: string;
  nomeMes: string;
  horario: string;
  diaSemana: string;
} {
  const data = createLocalDate(dateString);

  // Obter o dia e adicionar zero à esquerda se for menor que 10
  const dia = data.getDate().toString().padStart(2, "0");

  // Obter o nome do mês em português
  const nomesMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const nomeMes = nomesMeses[data.getMonth()];

  // Obter o nome do dia da semana em português
  const nomesDiasSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const diaSemana = nomesDiasSemana[data.getDay()];

  // Formatar horário (HH:MM)
  const horas = data.getHours().toString().padStart(2, "0");
  const minutos = data.getMinutes().toString().padStart(2, "0");
  const horario = `${horas}:${minutos}`;

  return { dia, nomeMes, horario, diaSemana };
}

// Função para obter o range de datas (início e fim)
export function getDateRange(
  startDate: Date,
  days: number
): { startDate: string; endDate: string } {
  const start = formatLocalDate(startDate);
  const end = formatLocalDate(
    new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000)
  );

  return { startDate: start, endDate: end };
}

// Função para gerar datas da semana
export function getWeekDates(weekOffset = 0): Date[] {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDay + 1 + weekOffset * 7);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
}
