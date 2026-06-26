import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

// Factory that returns a middleware which parses req.body against a Zod schema.
// Calls next(err) on failure so the global errorHandler can format it uniformly.
export function validate(schema: ZodTypeAny): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(result.error);
      return;
    }
    req.body = result.data as unknown;
    next();
  };
}
