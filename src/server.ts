import type { ICustomersApi } from "./customers/routes";
import { DI, TOKENS } from "./shared/di";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/api/customers": {
      GET: () => DI.get<ICustomersApi>(TOKENS.CUSTOMERS_API).getCustomers(),
      POST: (req) =>
        DI.get<ICustomersApi>(TOKENS.CUSTOMERS_API).postCustomer(req),
    },
    "/api/customers/:id": {
      PUT: (req) =>
        DI.get<ICustomersApi>(TOKENS.CUSTOMERS_API).putCustomer(req),
    },
  },
});

console.log(`Listening on ${server.url}`);
