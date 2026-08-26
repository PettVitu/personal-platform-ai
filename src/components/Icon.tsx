type IconName = "today" | "tasks" | "finance" | "chart" | "calendar" | "more" | "assistant" | "plus" | "check" | "arrow" | "close" | "menu";

const icons: Record<IconName, string> = {
  today: "⌂", tasks: "✓", finance: "R$", chart: "📈", calendar: "□", more: "•••", assistant: "✦", plus: "+", check: "✓", arrow: "→", close: "×", menu: "☰",
};

export function Icon({ name }: { name: IconName }) {
  return <span aria-hidden="true" className={`icon icon-${name}`}>{icons[name]}</span>;
}
