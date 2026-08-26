import { expect, request as playwrightRequest, test } from "@playwright/test";

const SECRET = process.env.E2E_TEST_AUTH_SECRET;

// storageState vazio é obrigatório aqui: por padrão, request.newContext() criado
// de dentro de um teste herda o storageState do projeto (a sessão do setup) —
// sem isso, "anon" nunca seria de fato anônimo.
const BLANK_STATE = { cookies: [], origins: [] };

async function loginAs(email: string) {
  const context = await playwrightRequest.newContext({ baseURL: "http://127.0.0.1:3100", storageState: BLANK_STATE });
  const csrfResponse = await context.get("/api/auth/csrf");
  const { csrfToken } = await csrfResponse.json();
  await context.post("/api/auth/callback/test-credentials", {
    form: { csrfToken, secret: SECRET ?? "", email, redirect: "false", callbackUrl: "/" },
  });
  return context;
}

test.describe("isolamento entre usuários", () => {
  test.skip(!SECRET, "E2E_TEST_AUTH_SECRET não configurado");

  test("usuário B não vê, edita nem apaga dado do usuário A", async () => {
    const a = await loginAs("isolation-a@local.test");
    const b = await loginAs("isolation-b@local.test");

    const created = await a.post("/api/tasks", { data: { title: "Segredo do usuário A", date: "2026-08-14", priority: "media" } });
    expect(created.status()).toBe(201);
    const task = (await created.json()).data;

    const listAsB = await b.get("/api/tasks");
    const tasksB = (await listAsB.json()).data as Array<{ id: string }>;
    expect(tasksB.some((item) => item.id === task.id)).toBe(false);

    const patchAsB = await b.patch(`/api/tasks/${task.id}`, { data: { title: "hackeado" } });
    expect(patchAsB.status()).toBe(404);

    const deleteAsB = await b.delete(`/api/tasks/${task.id}`);
    expect(deleteAsB.status()).toBe(404);

    const listAsA = await a.get("/api/tasks");
    const tasksA = (await listAsA.json()).data as Array<{ id: string; title: string }>;
    expect(tasksA.find((item) => item.id === task.id)?.title).toBe("Segredo do usuário A");

    await a.delete(`/api/tasks/${task.id}`);
    await a.dispose();
    await b.dispose();
  });

  test("usuário B não vê, edita nem apaga conta recorrente do usuário A", async () => {
    const a = await loginAs("isolation-a@local.test");
    const b = await loginAs("isolation-b@local.test");

    const created = await a.post("/api/bills", { data: { name: "Cartão secreto de A", amount: 500, dueDate: "2026-09-01" } });
    expect(created.status()).toBe(201);
    const bill = (await created.json()).data;

    const listAsB = await b.get("/api/bills");
    const billsB = (await listAsB.json()).data as Array<{ id: string }>;
    expect(billsB.some((item) => item.id === bill.id)).toBe(false);

    const patchAsB = await b.patch(`/api/bills/${bill.id}`, { data: { paid: true } });
    expect(patchAsB.status()).toBe(404);

    const deleteAsB = await b.delete(`/api/bills/${bill.id}`);
    expect(deleteAsB.status()).toBe(404);

    await a.delete(`/api/bills/${bill.id}`);
    await a.dispose();
    await b.dispose();
  });

  test("sem sessão, a API recusa com 401", async () => {
    const anon = await playwrightRequest.newContext({ baseURL: "http://127.0.0.1:3100", storageState: BLANK_STATE });
    expect((await anon.get("/api/tasks")).status()).toBe(401);
    expect((await anon.post("/api/tasks", { data: { title: "x", date: "2026-08-14" } })).status()).toBe(401);
    await anon.dispose();
  });
});
