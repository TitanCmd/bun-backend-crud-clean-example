import { describe, expect, it } from "bun:test";
import { BadRequestError, NotFoundError } from "../shared/errors";
import type { ICustomersController } from "./controller";
import { CustomersApi } from "./routes";
import { makeCustomer, makeRequest } from "./test-helpers";

function makeController(overrides: Partial<ICustomersController>): ICustomersController {
  return {
    list: async () => [],
    create: async () => makeCustomer(),
    update: async () => makeCustomer(),
    ...overrides,
  };
}

describe("CustomersApi", () => {
  it("returns customers on GET", async () => {
    const customers = [makeCustomer({ id: "1" })];
    const api = new CustomersApi(makeController({ list: async () => customers }));

    const res = await api.getCustomers();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(customers);
  });

  it("creates customer on POST", async () => {
    const created = makeCustomer({ id: "new" });
    const api = new CustomersApi(makeController({ create: async () => created }));
    const req = makeRequest({ name: "Jane", email: "jane@example.com" });

    const res = await api.postCustomer(req);

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(created);
  });

  it("returns 400 on POST when payload is invalid", async () => {
    const api = new CustomersApi(makeController({}));
    const req = makeRequest({ name: "Jane" });

    const res = await api.postCustomer(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("maps BadRequestError to 400 on POST", async () => {
    const api = new CustomersApi(
      makeController({
        create: async () => {
          throw new BadRequestError();
        },
      }),
    );
    const req = makeRequest({ name: "Jane", email: "jane@example.com" });

    const res = await api.postCustomer(req);

    expect(res.status).toBe(400);
  });

  it("maps unknown error to 500 on POST", async () => {
    const api = new CustomersApi(
      makeController({
        create: async () => {
          throw new Error("boom");
        },
      }),
    );
    const req = makeRequest({ name: "Jane", email: "jane@example.com" });

    const res = await api.postCustomer(req);

    expect(res.status).toBe(500);
  });

  it("returns 400 when PUT id is missing", async () => {
    const api = new CustomersApi(makeController({}));
    const req = makeRequest({ points: 10 });

    const res = await api.putCustomer(req);

    expect(res.status).toBe(400);
  });

  it("returns 400 when PUT payload lacks points", async () => {
    const api = new CustomersApi(makeController({}));
    const req = makeRequest({}, { id: "123" });

    const res = await api.putCustomer(req);

    expect(res.status).toBe(400);
  });

  it("updates customer on PUT", async () => {
    const updated = makeCustomer({ id: "123", points: 40 });
    const api = new CustomersApi(
      makeController({
        update: async () => updated,
      }),
    );
    const req = makeRequest({ points: 40 }, { id: "123" });

    const res = await api.putCustomer(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(updated);
  });

  it("maps BadRequestError to 400 on PUT", async () => {
    const api = new CustomersApi(
      makeController({
        update: async () => {
          throw new BadRequestError();
        },
      }),
    );
    const req = makeRequest({ points: 10 }, { id: "123" });

    const res = await api.putCustomer(req);

    expect(res.status).toBe(400);
  });

  it("maps NotFoundError to 404 on PUT", async () => {
    const api = new CustomersApi(
      makeController({
        update: async () => {
          throw new NotFoundError();
        },
      }),
    );
    const req = makeRequest({ points: 10 }, { id: "123" });

    const res = await api.putCustomer(req);

    expect(res.status).toBe(404);
  });

  it("maps unknown error to 500 on PUT", async () => {
    const api = new CustomersApi(
      makeController({
        update: async () => {
          throw new Error("boom");
        },
      }),
    );
    const req = makeRequest({ points: 10 }, { id: "123" });

    const res = await api.putCustomer(req);

    expect(res.status).toBe(500);
  });
});

