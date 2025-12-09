import { BadRequestError, NotFoundError } from "../shared/errors";
import type { Customer } from "./domain";
import type { CustomerPostRequest, CustomerUpdateRequest } from "./dto";
import type { ICustomerRepository as ICustomersRepository } from "./repository";

// Service (business logic): enforce invariants, set defaults, orchestrate repo. No HTTP.

export interface ICustomersService {
  list(): Promise<Customer[]>;
  create(customer: CustomerPostRequest): Promise<Customer>;
  update(id: string, customer: CustomerUpdateRequest): Promise<Customer>;
}

export class CustomersService implements ICustomersService {
  constructor(private repo: ICustomersRepository) {}

  async list(): Promise<Customer[]> {
    return this.repo.list();
  }

  create(input: CustomerPostRequest): Promise<Customer> {
    if (!input.name || !input.email) throw new BadRequestError();

    const customer: Customer = {
      id: crypto.randomUUID(),
      name: input.name,
      email: input.email,
      points: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.repo.create(customer);
  }

  async update(id: string, input: CustomerUpdateRequest): Promise<Customer> {
    if (input.points < 0) throw new BadRequestError();

    const existing = await this.repo.findById(id);

    if (!existing) throw new NotFoundError();

    const updated: Customer = {
      ...existing,
      points: input.points,
      updatedAt: new Date().toISOString(),
    };

    return this.repo.update(updated);
  }
}
