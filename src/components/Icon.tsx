type IconName = "today" | "tasks" | "finance" | "calendar" | "more" | "assistant" | "plus" | "check" | "arrow" | "close" | "menu";

const icons: Record<IconName, string> = {
  today: "⌂", tasks: "✓", finance: "R$", calendar: "□", more: "•••", assistant: "✦", plus: "+", check: "✓", arrow: "→", close: "×", menu: "☰",
};

export function Icon({ name }: { name: IconName }) {
  return <span aria-hidden="true" className={`icon icon-${name}`}>{icons[name]}</span>;
}
