import { NotFoundError } from "../shared/errors";
import type { Customer } from "./domain";

// Repository (persistence only): CRUD against storage (even in-memory). No business rules.

export interface ICustomerRepository {
  list(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  create(customer: Customer): Promise<Customer>;
  update(customer: Customer): Promise<Customer>;
}

export class InMemoryCustomersRepository implements ICustomerRepository {
  private items: Customer[] = [];

  async list() {
    return [...this.items];
  }

  async findById(id: string) {
    return this.items.find((c) => c.id === id) ?? null;
  }

  async create(customer: Customer) {
    this.items.push(customer);
    return customer;
  }

  async update(customer: Customer): Promise<Customer> {
    const idx = this.items.findIndex((c) => c.id === customer.id);
    if (idx === -1) return Promise.reject(new NotFoundError());
    this.items[idx] = customer;
    return customer;
  }
}
