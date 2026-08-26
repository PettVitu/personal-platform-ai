import type { AppData } from "./types";

export const seedData: AppData = {
  tasks: [
    { id: "task-1", title: "Revisar proposta do projeto", date: "2026-08-14", time: "09:30", priority: "alta", status: "pending" },
    { id: "task-2", title: "Separar documentos do mês", date: "2026-08-14", time: "16:00", priority: "media", status: "pending" },
    { id: "task-3", title: "Enviar comprovante do aluguel", date: "2026-08-13", priority: "alta", status: "pending" },
  ],
  transactions: [
    { id: "transaction-1", type: "income", description: "Salário", amount: 5200, date: "2026-08-05", category: "Trabalho", account: "Conta principal" },
    { id: "transaction-2", type: "expense", description: "Supermercado", amount: 248.9, date: "2026-08-12", category: "Casa", account: "Conta principal" },
    { id: "transaction-3", type: "expense", description: "Transporte", amount: 42.5, date: "2026-08-13", category: "Transporte", account: "Carteira" },
  ],
  bills: [
    { id: "bill-1", name: "Aluguel", amount: 1800, dueDate: "2026-08-15", paid: false },
    { id: "bill-2", name: "Internet", amount: 119.9, dueDate: "2026-08-20", paid: false },
  ],
  appointments: [
    { id: "appointment-1", title: "Consulta odontológica", date: "2026-08-14", time: "14:00", location: "Clínica Centro" },
  ],
  documents: [
    { id: "document-1", title: "Apólice do seguro residencial", category: "Casa", content: "Documento demonstrativo salvo localmente.", updatedAt: "2026-08-10", aiAccess: false },
  ],
  budgetCategories: [
    { id: "budget-category-1", name: "Transporte", monthlyAmount: 250 },
    { id: "budget-category-2", name: "Lazer", monthlyAmount: 300 },
  ],
};
