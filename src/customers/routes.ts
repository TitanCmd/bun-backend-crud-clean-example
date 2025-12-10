import type { ICustomersController } from "./controller";
import type { CustomerPostRequest, CustomerUpdateRequest } from "./dto";
import {
  badRequest,
  internalError,
  json,
  notFound,
  type RequestLike,
} from "../shared/utils";

// HTTP/API (routes): parse/validate request, call controller/service, map domain errors to HTTP status/Response.

export interface ICustomersApi {
  getCustomers(): Promise<Response>;
  postCustomer(req: RequestLike): Promise<Response>;
  putCustomer(req: RequestLike): Promise<Response>;
}

export class CustomersApi implements ICustomersApi {
  constructor(private controller: ICustomersController) {}

  async getCustomers() {
    const customers = await this.controller.list();
    return json(customers);
  }

  async postCustomer(req: RequestLike): Promise<Response> {
    const body = (await req.json()) as CustomerPostRequest;
    if (!body.name || !body.email) return badRequest();
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

  async putCustomer(req: RequestLike): Promise<Response> {
    const id = req.params?.id;
    if (!id) return badRequest();

    const body = (await req.json()) as CustomerUpdateRequest;
    if (!body.points) return badRequest();
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
