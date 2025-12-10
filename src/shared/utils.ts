export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface RequestLike {
  json(): Promise<unknown>;
  params?: Record<string, string>;
  cookies?: { toJSON?(): Record<string, string> } | Record<string, string>;
}

export function json(data: any, status = 200) {
  return Response.json(data, { status });
}

export function error(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function notFound(message = "Not found") {
  return error(message, 404);
}

export function badRequest(message = "Bad request") {
  return error(message, 400);
}

export function unauthorized(message = "Unauthorized") {
  return error(message, 401);
}

export function internalError(message = "Internal server error") {
  return error(message, 500);
}
