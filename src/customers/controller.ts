import type { Customer } from "./domain";
import type { CustomerPostRequest, CustomerUpdateRequest } from "./dto";
import type { ICustomersService } from "./service";

// Controller/use-case (optional seam): orchestrates one use case, maps DTOs to service calls, but still no HTTP details. You can drop this and call the service directly from the API if you prefer fewer layer

export interface ICustomersController {
  list(): Promise<Customer[]>;
  create(customer: CustomerPostRequest): any;
  update(id: string, customer: CustomerUpdateRequest): any;
}

export class CustomersController implements ICustomersController {
  constructor(private service: ICustomersService) {}

  async list() {
    return await this.service.list();
  }

  async create(body: CustomerPostRequest) {
    return await this.service.create(body);
  }

  async update(id: string, body: CustomerUpdateRequest) {
    return await this.service.update(id, body);
  }
}
