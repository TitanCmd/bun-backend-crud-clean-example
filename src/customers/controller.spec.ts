import { describe, expect, it } from "bun:test";
import { makeCustomer } from "./test-helpers";
import { CustomersController, type ICustomersController } from "./controller";
import type { ICustomersService } from "./service";

function makeServiceStub(overrides: Partial<ICustomersService> = {}) {
  const defaults: ICustomersService = {
    list: async () => [],
    create: async () => makeCustomer(),
    update: async () => makeCustomer(),
  };

  return { ...defaults, ...overrides };
}

describe("CustomersController", () => {
  it("delegates list to service", async () => {
    const customers = [makeCustomer({ id: "1" })];
    const service = makeServiceStub({ list: async () => customers });
    const controller: ICustomersController = new CustomersController(service);

    const result = await controller.list();

    expect(result).toEqual(customers);
  });

  it("delegates create to service with payload", async () => {
    const created = makeCustomer({ id: "created" });
    let received: any;
    const service = makeServiceStub({
      create: async (input) => {
        received = input;
        return created;
      },
    });
    const controller = new CustomersController(service);

    const body = { name: "Jane", email: "jane@example.com" };
    const result = await controller.create(body);

    expect(received).toEqual(body);
    expect(result).toBe(created);
  });

  it("delegates update to service with id and payload", async () => {
    const updated = makeCustomer({ id: "123", points: 50 });
    let received: { id?: string; body?: any } = {};
    const service = makeServiceStub({
      update: async (id, body) => {
        received = { id, body };
        return updated;
      },
    });
    const controller = new CustomersController(service);

    const result = await controller.update("123", { points: 50 });

    expect(received).toEqual({ id: "123", body: { points: 50 } });
    expect(result).toBe(updated);
  });
});
