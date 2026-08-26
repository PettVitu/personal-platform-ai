import { PrismaClient } from "@prisma/client";
import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";
const TEST_EMAIL = "e2e-test@local.test";

setup("autenticar com o provider de teste", async ({ page }) => {
  const secret = process.env.E2E_TEST_AUTH_SECRET;
  if (!secret) throw new Error("E2E_TEST_AUTH_SECRET não configurado — ver .env.example.");

  const csrfResponse = await page.request.get("/api/auth/csrf");
  const { csrfToken } = await csrfResponse.json();

  await page.request.post("/api/auth/callback/test-credentials", {
    form: { csrfToken, secret, redirect: "false", callbackUrl: "/" },
  });

  await page.goto("/");
  await page.waitForURL("/");
  await page.context().storageState({ path: authFile });

  await seedTestUserData();
});

async function seedTestUserData() {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUniqueOrThrow({ where: { email: TEST_EMAIL } });
  const userId = user.id;

  await prisma.task.upsert({ where: { id: "e2e-task-1" }, update: {}, create: { id: "e2e-task-1", userId, title: "Revisar proposta do projeto", date: "2026-08-14", time: "09:30", priority: "alta", status: "pending" } });
  await prisma.transaction.upsert({ where: { id: "e2e-transaction-1" }, update: {}, create: { id: "e2e-transaction-1", userId, type: "income", description: "Salário", amount: 5200, date: "2026-08-05", category: "Trabalho", account: "Conta principal" } });
  await prisma.transaction.upsert({ where: { id: "e2e-transaction-2" }, update: {}, create: { id: "e2e-transaction-2", userId, type: "expense", description: "Supermercado", amount: 248.9, date: "2026-08-12", category: "Casa", account: "Conta principal" } });
  await prisma.recurringBill.upsert({ where: { id: "e2e-bill-1" }, update: { paid: false }, create: { id: "e2e-bill-1", userId, name: "Aluguel", amount: 1800, dueDate: "2026-08-15", paid: false } });

  await prisma.$disconnect();
}
