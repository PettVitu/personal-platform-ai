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

// Zera e recria os dados do usuário de teste a cada rodada. Com banco de verdade
// (ao contrário do antigo apiStore em memória, que resetava sozinho a cada restart)
// os testes que criam registro pela UI (ex.: "cria e conclui uma tarefa") acumulariam
// duplicatas a cada execução se isso não existisse.
async function seedTestUserData() {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUniqueOrThrow({ where: { email: TEST_EMAIL } });
  const userId = user.id;

  await prisma.task.deleteMany({ where: { userId } });
  await prisma.transaction.deleteMany({ where: { userId } });
  await prisma.recurringBill.deleteMany({ where: { userId } });

  await prisma.task.create({ data: { id: "e2e-task-1", userId, title: "Revisar proposta do projeto", date: "2026-08-14", time: "09:30", priority: "alta", status: "pending" } });
  await prisma.transaction.create({ data: { id: "e2e-transaction-1", userId, type: "income", description: "Salário", amount: 5200, date: "2026-08-05", category: "Trabalho", account: "Conta principal" } });
  await prisma.transaction.create({ data: { id: "e2e-transaction-2", userId, type: "expense", description: "Supermercado", amount: 248.9, date: "2026-08-12", category: "Casa", account: "Conta principal" } });
  await prisma.recurringBill.create({ data: { id: "e2e-bill-1", userId, name: "Aluguel", amount: 1800, dueDate: "2026-08-15", paid: false } });

  await prisma.$disconnect();
}
