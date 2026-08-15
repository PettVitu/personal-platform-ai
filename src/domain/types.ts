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
