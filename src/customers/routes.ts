import type { BunRequest } from "bun";
import type { ICustomersController } from "./controller";
import type { CustomerPostRequest, CustomerUpdateRequest } from "./dto";
import { badRequest, internalError, json, notFound } from "../shared/utils";

// HTTP/API (routes): parse/validate request, call controller/service, map domain errors to HTTP status/Response.

export interface ICustomersApi {
  getCustomers(): Promise<Response>;
  postCustomer(req: BunRequest): any;
  putCustomer(red: BunRequest): any;
}

export class CustomersApi implements ICustomersApi {
  constructor(private controller: ICustomersController) {}

  async getCustomers() {
    const customers = await this.controller.list();
    return json(customers);
  }

  async postCustomer(req: BunRequest) {
    const body = (await req.json()) as CustomerPostRequest;
    try {
      const customer = await this.controller.create(body);
      return json(customer, 201);
    } catch (err: any) {
      if (err.name === "BadRequestError") {
        return badRequest();
      }
      return internalError();
    }
  }

  async putCustomer(req: BunRequest) {
    const { id } = req.params;
    if (!id) return badRequest();

    const body = (await req.json()) as CustomerUpdateRequest;
    try {
      const customer = await this.controller.update(id, body);
      return json(customer);
    } catch (err: any) {
      if (err.name === "BadRequestError") {
        return badRequest();
      }
      if (err.name === "NotFoundError") {
        return notFound();
      }
      return internalError();
    }
  }
}
