import { createLocalDate } from "./dateUtils";

export function formatDate(dataString: string): {
  dia: string; // Alterado para string para incluir o zero à esquerda
  nomeMes: string;
  horario: string;
  diaSemana: string;
} {
  const data = createLocalDate(dataString);

  // Debug: log da formatação de data
  console.log("🔍 DEBUG - formatDate:", {
    input: dataString,
    dateObject: data,
    dateLocal: data.toLocaleDateString(),
    dateUTC: data.toISOString(),
  });

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
