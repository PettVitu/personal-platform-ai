import { seedData } from "../domain/seed";
import type { AppData } from "../domain/types";

// Adaptador temporário da API. Deve ser substituído por um repositório persistente com autenticação.
export const apiStore: AppData = structuredClone(seedData);
