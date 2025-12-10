import { describe, expect, it } from "bun:test";
import { NotFoundError } from "../shared/errors";
import { InMemoryCustomersRepository } from "./repository";
import { makeCustomer } from "./test-helpers";

describe("InMemoryCustomersRepository", () => {
  it("returns a copy from list", async () => {
    const repo = new InMemoryCustomersRepository();
    await repo.create(makeCustomer({ id: "1" }));
    await repo.create(makeCustomer({ id: "2" }));

    const first = await repo.list();
    first.push(makeCustomer({ id: "extra" }));

    const second = await repo.list();
    expect(second).toHaveLength(2);
    expect(first).not.toBe(second);
  });

  it("creates and retrieves customers", async () => {
    const repo = new InMemoryCustomersRepository();
    const created = await repo.create(makeCustomer({ id: "abc" }));

    const items = await repo.list();
    expect(items).toEqual([created]);
  });

  it("updates an existing customer", async () => {
    const repo = new InMemoryCustomersRepository();
    await repo.create(makeCustomer({ id: "to-update", points: 0 }));

    const updated = await repo.update(
      makeCustomer({ id: "to-update", points: 50 }),
    );

    expect(updated.points).toBe(50);
    const items = await repo.list();
    expect(items[0].points).toBe(50);
  });

  it("rejects when customer is missing", async () => {
    const repo = new InMemoryCustomersRepository();
    await expect(repo.update(makeCustomer({ id: "missing" }))).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});

