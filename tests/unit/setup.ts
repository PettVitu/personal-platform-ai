// jsdom (nesta versão, rodando sob este Node) não expõe window.localStorage de
// forma confiável — some sem erro, só fica undefined. Um polyfill simples em
// memória resolve sem depender desse detalhe de versão.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() { return this.store.size; }
  clear() { this.store.clear(); }
  getItem(key: string) { return this.store.has(key) ? this.store.get(key)! : null; }
  key(index: number) { return Array.from(this.store.keys())[index] ?? null; }
  removeItem(key: string) { this.store.delete(key); }
  setItem(key: string, value: string) { this.store.set(key, String(value)); }
}

if (typeof window !== "undefined" && !window.localStorage) {
  Object.defineProperty(window, "localStorage", { value: new MemoryStorage(), configurable: true });
}
