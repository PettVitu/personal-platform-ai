import { DomainApiError } from "./types";

const DEFAULT_TIMEOUT_MS = 8000;

export async function apiRequest<T>(path: string, init: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(path, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...init.headers },
    });
    const body = response.status === 204 ? undefined : await response.json().catch(() => undefined);
    if (!response.ok) {
      const message = body && typeof body.error === "string" ? body.error : "Não foi possível concluir a operação.";
      const kind = response.status === 404 ? "not-found" : response.status === 429 ? "rate-limited" : response.status >= 500 ? "server" : "validation";
      throw new DomainApiError(kind, message, response.status);
    }
    return body as T;
  } catch (error) {
    if (error instanceof DomainApiError) throw error;
    const message = error instanceof DOMException && error.name === "AbortError" ? "A API demorou demais para responder." : "Não foi possível conectar à API.";
    throw new DomainApiError("network", message);
  } finally {
    window.clearTimeout(timeout);
  }
}

export function unwrap<T>(response: { data: T }): T { return response.data; }
