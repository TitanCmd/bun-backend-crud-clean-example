import { describe, expect, it } from "bun:test";
import { BadRequestError, NotFoundError } from "../shared/errors";
import { InMemoryCustomersRepository } from "./repository";
import { CustomersService } from "./service";
import { makeCustomer } from "./test-helpers";

describe("CustomersService", () => {
  it("creates a customer with defaults", async () => {
    const repo = new InMemoryCustomersRepository();
    const service = new CustomersService(repo);

    const created = await service.create({
      name: "Jane",
      email: "jane@example.com",
    });

    expect(created.id).toBeDefined();
    expect(created.points).toBe(0);
    expect(created.isActive).toBe(true);
    expect(created.createdAt).toBeDefined();
    expect(created.updatedAt).toBeDefined();

    const stored = await repo.list();
    expect(stored[0]).toMatchObject({
      id: created.id,
      name: "Jane",
      email: "jane@example.com",
      points: 0,
      isActive: true,
    });
  });

  it("rejects create when name or email is missing", async () => {
    const service = new CustomersService(new InMemoryCustomersRepository());

    await expect(
      service.create({ name: "", email: "jane@example.com" })
    ).rejects.toBeInstanceOf(BadRequestError);

    await expect(
      service.create({ name: "Jane", email: "" })
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it("rejects update when points are negative", async () => {
    const repo = new InMemoryCustomersRepository();
    const service = new CustomersService(repo);

    await expect(service.update("id-1", { points: -1 })).rejects.toBeInstanceOf(
      BadRequestError
    );
  });

  it("rejects update when customer is missing", async () => {
    const repo = new InMemoryCustomersRepository();
    const service = new CustomersService(repo);

    await expect(
      service.update("missing", { points: 5 })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("updates points and timestamps", async () => {
    const repo = new InMemoryCustomersRepository();
    const existing = makeCustomer({ id: "exists", points: 1 });
    await repo.create(existing);
    const service = new CustomersService(repo);

    const updated = await service.update("exists", { points: 20 });

    expect(updated.points).toBe(20);
    expect(updated.updatedAt).not.toBe(existing.updatedAt);
    const stored = await repo.list();
    expect(stored[0]?.points).toBe(20);
  });
});
