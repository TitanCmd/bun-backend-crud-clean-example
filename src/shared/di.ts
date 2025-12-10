export class DI {
  private static container: Map<string, any> = new Map();

  static get<T>(token: string): T {
    return this.container.get(token) as T;
  }

  static set<T>(token: string, instance: T) {
    this.container.set(token, instance);
  }
}

export const TOKENS = {
  CUSTOMERS_SERVICE: "CUSTOMERS_SERVICE",
  CUSTOMERS_CONTROLLER: "CUSTOMERS_CONTROLLER",
  CUSTOMERS_API: "CUSTOMERS_API",
  CUSTOMERS_REPOSITORY: "CUSTOMERS_REPOSITORY",
};

import { CustomersApi } from "../customers/routes";
import { CustomersService, type ICustomersService } from "../customers/service";
import {
  CustomersController,
  type ICustomersController,
} from "../customers/controller";
import {
  InMemoryCustomersRepository,
  type ICustomerRepository as ICustomersRepository,
} from "../customers/repository";

DI.set(TOKENS.CUSTOMERS_REPOSITORY, new InMemoryCustomersRepository());
DI.set(
  TOKENS.CUSTOMERS_SERVICE,
  new CustomersService(
    DI.get<ICustomersRepository>(TOKENS.CUSTOMERS_REPOSITORY)
  )
);
DI.set(
  TOKENS.CUSTOMERS_CONTROLLER,
  new CustomersController(DI.get<ICustomersService>(TOKENS.CUSTOMERS_SERVICE))
);
DI.set(
  TOKENS.CUSTOMERS_API,
  new CustomersApi(DI.get<ICustomersController>(TOKENS.CUSTOMERS_CONTROLLER))
);
