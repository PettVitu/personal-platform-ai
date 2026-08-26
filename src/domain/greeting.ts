export function greetingForHour(hour: number): string {
  if (hour < 5) return "Boa noite";
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

/** "sexta-feira, 14 de agosto" a partir de uma data real — CSS já cuida do uppercase. */
export function formatWeekdayAndDay(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(date);
}
