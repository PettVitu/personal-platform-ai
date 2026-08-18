import { test, expect } from "@playwright/test";

test.describe("personal platform AI", () => {
  test("abre a Planilha e filtra registros", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Planilha" })).toBeVisible();
    await page.getByRole("button", { name: "Planilha" }).click();
    await expect(page.getByRole("heading", { name: "Planilha" })).toBeVisible();
    await expect(page.locator(".spreadsheet-table tbody tr").first()).toBeVisible();
    await page.locator(".spreadsheet-search").fill("Aluguel");
    expect(await page.locator(".spreadsheet-table tbody tr").filter({ hasText: "Aluguel" }).count()).toBeGreaterThan(0);
    await expect(page.getByText("Aluguel", { exact: true }).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("cria e conclui uma tarefa", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Tarefas" }).click();
    await page.getByRole("button", { name: /Nova tarefa/ }).click();
    await page.getByLabel("Título").fill("Validar fluxo no navegador");
    await page.getByRole("button", { name: "Salvar tarefa" }).click();
    await expect(page.getByText("Validar fluxo no navegador")).toBeVisible();
    await page.locator(".task-item").filter({ hasText: "Validar fluxo no navegador" }).getByRole("button", { name: "Alternar conclusão" }).click();
    await expect(page.locator(".task-item").filter({ hasText: "Validar fluxo no navegador" })).toHaveClass(/completed/);
  });

  test("cria lançamento e atualiza o resumo financeiro", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Finanças", exact: true }).click();
    await page.getByRole("button", { name: /Registrar movimento/ }).click();
    await page.getByLabel("Descrição").fill("Teste Playwright");
    await page.getByLabel("Valor").fill("100");
    await page.getByRole("button", { name: "Salvar movimento" }).click();
    await expect(page.getByText("Teste Playwright")).toBeVisible();
  });

  test("marca e reabre uma conta recorrente", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Finanças", exact: true }).click();
    const balance = page.locator(".finance-summary .card").first().locator("strong");
    const before = await balance.textContent();
    const bill = page.getByText("Aluguel").first();
    await expect(bill).toBeVisible();
    const toggle = page.getByRole("button", { name: "Marcar conta como paga" }).first();
    await toggle.click();
    await expect(bill).toHaveClass(/paid-text/);
    await expect(balance).not.toHaveText(before ?? "");
    await page.getByRole("button", { name: "Marcar conta como paga" }).first().click();
    await expect(bill).not.toHaveClass(/paid-text/);
    await expect(balance).toHaveText(before ?? "");
  });
});
