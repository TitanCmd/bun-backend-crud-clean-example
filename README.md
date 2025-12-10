# Bun backend CRUD clean code example

Small Bun + TypeScript backend that explores clean layering and DI while exposing a simple customers API.

## Stack and approach

- Bun v1.3+, TypeScript, lightweight DI container.
- Layers: routes (HTTP) → controller → service (business rules) → repository (in-memory).
- In-memory store by default; not production-ready.

## Setup

1. Install deps

```bash
bun install
```

2. Run the server (defaults to port 3000)

```bash
bun start
```

Env overrides: `PORT`, `DATABASE_URL`, `CORS_ORIGIN`, `NODE_ENV`.

## API

- `GET /api/customers` — list customers.
- `POST /api/customers` — create `{ name, email }`, returns 201.
- `PUT /api/customers/:id` — update `{ points }`. 400 on bad input, 404 if missing.

## Tests

```bash
bun test
```

## Notes

Built via `bun init`; keep changes minimal and incremental to stay aligned with the clean-code focus.
