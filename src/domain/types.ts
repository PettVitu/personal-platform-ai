export type Priority = "alta" | "media" | "baixa";
export type TaskStatus = "pending" | "completed";

export type Task = {
  id: string;
  title: string;
  date: string;
  time?: string;
  priority: Priority;
  status: TaskStatus;
  notes?: string;
};

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category: string;
  account: string;
};

export type RecurringBill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  paid: boolean;
};

export type Appointment = {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
};

export type DocumentNote = {
  id: string;
  title: string;
  category: string;
  content: string;
  updatedAt: string;
  aiAccess: boolean;
};

export type AppData = {
  tasks: Task[];
  transactions: Transaction[];
  bills: RecurringBill[];
  appointments: Appointment[];
  documents: DocumentNote[];
};

export type CreateTaskInput = Omit<Task, "id" | "status"> & { status?: TaskStatus };
export type UpdateTaskInput = Partial<Omit<Task, "id">>;
export type CreateTransactionInput = Omit<Transaction, "id">;
export type UpdateTransactionInput = Partial<Omit<Transaction, "id">>;
export type CreateRecurringBillInput = Omit<RecurringBill, "id" | "paid"> & { paid?: boolean };
export type UpdateRecurringBillInput = Partial<Omit<RecurringBill, "id">>;

export type AssetClass = "acao" | "fii";
export type Sentiment = "positivo" | "negativo" | "neutro";

export type InvestmentQuote = {
  ticker: string;
  name: string;
  assetClass: AssetClass;
  price: number;
  dividendYield: number;
  priceToEarnings: number | null;
  updatedAt: string;
};

export type InvestmentNews = {
  headline: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: Sentiment;
  relatedTickers: string[];
};

export type InvestmentSuggestion = {
  ticker: string;
  name: string;
  assetClass: AssetClass;
  score: number;
  scoreBreakdown: { fundamentals: number; sentiment: number };
  explanation: string;
  news: InvestmentNews[];
  asOf: string;
};

export type InvestmentSuggestionsResponse = {
  suggestions: InvestmentSuggestion[];
  demo: boolean;
  sources: string[];
};

export type InvestmentHistoryEntry = {
  id: string;
  ticker: string;
  score: number;
  scoreBreakdown: { fundamentals: number; sentiment: number };
  asOf: string;
  demo: boolean;
};

export type WatchlistEntry = { ticker: string; name: string; assetClass: AssetClass };

export type WatchlistResponse = {
  entries: WatchlistEntry[];
  isDefault: boolean;
  editable: boolean;
};

export type ApiErrorKind = "network" | "validation" | "server" | "not-found" | "unknown";

export class DomainApiError extends Error {
  constructor(public readonly kind: ApiErrorKind, message: string, public readonly status?: number) {
    super(message);
    this.name = "DomainApiError";
  }
}
