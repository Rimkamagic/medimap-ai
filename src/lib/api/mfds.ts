import "server-only";
import { findMockMedicine, searchMockMedicines } from "@/data/medicines";
import type { Medicine } from "@/types/health";

interface MfdsSearchOptions {
  query: string;
}

export async function searchMedicines({ query }: MfdsSearchOptions): Promise<Medicine[]> {
  const serviceKey = process.env.MFDS_API_SERVICE_KEY;

  if (!serviceKey) {
    return searchMockMedicines(query);
  }

  // Future MFDS e-yakeunyo and product approval OpenAPI integration belongs here.
  // Keep this module imported only by server Route Handlers so the service key
  // never reaches client bundles.
  return searchMockMedicines(query);
}

export async function getMedicineById(id: string): Promise<Medicine | null> {
  const serviceKey = process.env.MFDS_API_SERVICE_KEY;

  if (!serviceKey) {
    return findMockMedicine(id) ?? null;
  }

  return findMockMedicine(id) ?? null;
}
