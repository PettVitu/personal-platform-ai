import { apiRequest, unwrap } from "./api-client";
import { loadAppData, saveAppData } from "./storage";
import { seedData } from "./seed";
import type { AppData, CreateRecurringBillInput, CreateTaskInput, CreateTransactionInput, InvestmentSuggestionsResponse, RecurringBill, Task, Transaction, UpdateRecurringBillInput, UpdateTaskInput, UpdateTransactionInput } from "./types";

type Collection = "tasks" | "transactions" | "bills";
type ApiRepository<T, Create, Update> = {
  list(): Promise<T[]>;
  create(input: Create): Promise<T>;
  update(id: string, input: Update): Promise<T>;
  remove(id: string): Promise<void>;
};

function remote<T, Create, Update>(collection: Collection): ApiRepository<T, Create, Update> {
  return {
    list: async () => unwrap(await apiRequest<{ data: T[] }>(`/api/${collection}`)),
    create: async (input) => unwrap(await apiRequest<{ data: T }>(`/api/${collection}`, { method: "POST", body: JSON.stringify(input) })),
    update: async (id, input) => unwrap(await apiRequest<{ data: T }>(`/api/${collection}/${id}`, { method: "PATCH", body: JSON.stringify(input) })),
    remove: async (id) => { await apiRequest(`/api/${collection}/${id}`, { method: "DELETE" }); },
  };
}

export const taskRepository = remote<Task, CreateTaskInput, UpdateTaskInput>("tasks");
export const transactionRepository = remote<Transaction, CreateTransactionInput, UpdateTransactionInput>("transactions");
export const billRepository = remote<RecurringBill, CreateRecurringBillInput, UpdateRecurringBillInput>("bills");

export const investmentRepository = {
  suggestions: async () => unwrap(await apiRequest<{ data: InvestmentSuggestionsResponse }>("/api/investments/suggestions")),
};

export function localRepository() {
  let data = loadAppData(seedData);
  const persist = () => saveAppData(data);
  return {
    getData: () => data,
    replaceData: (next: AppData) => { data = next; persist(); },
    list: async <K extends Collection>(collection: K) => data[collection],
    create: async <K extends Collection>(collection: K, value: AppData[K][number]) => { data = { ...data, [collection]: [...data[collection], value] }; persist(); return value; },
    update: async <K extends Collection>(collection: K, id: string, value: Partial<AppData[K][number]>) => { const found = data[collection].find((item) => item.id === id); const items = found ? data[collection].map((item) => item.id === id ? { ...item, ...value } : item) : [...data[collection], { ...value, id } as AppData[K][number]]; data = { ...data, [collection]: items }; persist(); return items.find((item) => item.id === id)!; },
    remove: async <K extends Collection>(collection: K, id: string) => { data = { ...data, [collection]: data[collection].filter((item) => item.id !== id) }; persist(); },
  };
}
