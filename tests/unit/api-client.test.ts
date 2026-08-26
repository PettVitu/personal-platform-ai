import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest, unwrap } from "../../src/domain/api-client";
import { DomainApiError } from "../../src/domain/types";

function mockFetchOnce(response: { ok: boolean; status: number; body?: unknown }) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status,
    json: () => Promise.resolve(response.body ?? {}),
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiRequest", () => {
  it("retorna o corpo da resposta quando a chamada tem sucesso", async () => {
    mockFetchOnce({ ok: true, status: 200, body: { data: { id: "1" } } });
    const result = await apiRequest<{ data: { id: string } }>("/api/tasks");
    expect(unwrap(result)).toEqual({ id: "1" });
  });

  it("mapeia 404 para not-found", async () => {
    mockFetchOnce({ ok: false, status: 404, body: { error: "Tarefa não encontrada" } });
    await expect(apiRequest("/api/tasks/x")).rejects.toMatchObject({ kind: "not-found", status: 404, message: "Tarefa não encontrada" });
  });

  it("mapeia 429 para rate-limited", async () => {
    mockFetchOnce({ ok: false, status: 429, body: { error: "Muitas requisições. Tente novamente em instantes." } });
    await expect(apiRequest("/api/tasks")).rejects.toMatchObject({ kind: "rate-limited", status: 429 });
  });

  it("mapeia 500 para server", async () => {
    mockFetchOnce({ ok: false, status: 500 });
    await expect(apiRequest("/api/tasks")).rejects.toMatchObject({ kind: "server", status: 500 });
  });

  it("mapeia 400 para validation", async () => {
    mockFetchOnce({ ok: false, status: 400, body: { error: "Dados inválidos" } });
    await expect(apiRequest("/api/tasks")).rejects.toMatchObject({ kind: "validation", status: 400 });
  });

  it("mapeia falha de rede (fetch rejeita) para network", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("failed to fetch")));
    await expect(apiRequest("/api/tasks")).rejects.toBeInstanceOf(DomainApiError);
    await expect(apiRequest("/api/tasks")).rejects.toMatchObject({ kind: "network" });
  });
});
