import type { RequestLike } from "../shared/utils";
import type { Customer } from "./domain";

export function makeCustomer(overrides: Partial<Customer> = {}): Customer {
  const now = new Date("2025-01-01T00:00:00.000Z").toISOString();
  return {
    id: crypto.randomUUID(),
    name: "Jane Doe",
    email: "jane@example.com",
    points: 10,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function makeRequest(
  body: unknown,
  params?: Record<string, string>
): RequestLike {
  return {
    json: async () => body,
    params,
  };
}
