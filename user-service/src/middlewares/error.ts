import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors";

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }
  console.error(err);
  return res.status(500).json({ error: { code: "INTERNAL", message: "Internal server error" } });
}
