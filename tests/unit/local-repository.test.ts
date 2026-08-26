import { beforeEach, describe, expect, it } from "vitest";
import { localRepository } from "../../src/domain/repositories";
import type { Task } from "../../src/domain/types";

const STORAGE_KEY = "personal-platform-ai:data:v1";

beforeEach(() => {
  window.localStorage.clear();
});

describe("localRepository", () => {
  it("parte dos dados de seed quando não há nada salvo", async () => {
    const repo = localRepository();
    const tasks = await repo.list("tasks");
    expect(tasks.length).toBeGreaterThan(0);
  });

  it("create adiciona um item e persiste no localStorage", async () => {
    const repo = localRepository();
    const task: Task = { id: "novo-1", title: "Nova tarefa", date: "2026-08-26", priority: "media", status: "pending" };
    const created = await repo.create("tasks", task);
    expect(created).toEqual(task);

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(stored.tasks.some((item: Task) => item.id === "novo-1")).toBe(true);
  });

  it("update altera um item existente sem duplicar", async () => {
    const repo = localRepository();
    await repo.create("tasks", { id: "novo-2", title: "Tarefa", date: "2026-08-26", priority: "baixa", status: "pending" });
    const updated = await repo.update("tasks", "novo-2", { status: "completed" });
    expect(updated.status).toBe("completed");

    const all = await repo.list("tasks");
    expect(all.filter((item) => item.id === "novo-2")).toHaveLength(1);
  });

  it("remove tira o item da coleção", async () => {
    const repo = localRepository();
    await repo.create("tasks", { id: "novo-3", title: "Tarefa", date: "2026-08-26", priority: "alta", status: "pending" });
    await repo.remove("tasks", "novo-3");
    const all = await repo.list("tasks");
    expect(all.some((item) => item.id === "novo-3")).toBe(false);
  });

  it("replaceData substitui tudo e persiste", async () => {
    const repo = localRepository();
    const empty = { tasks: [], transactions: [], bills: [], appointments: [], documents: [] };
    repo.replaceData(empty);
    expect(repo.getData()).toEqual(empty);
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(stored.tasks).toEqual([]);
  });
});
