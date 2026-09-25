import type {
  Request,
  Response,
  NextFunction,
} from "express";


import { AppError } from "../utils/AppError.js";
import { Prisma } from "../../generated/prisma/client.ts";

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.code ? { code: error.code } : {}),
    });
  }

  /*
   * Prisma unique constraint
   */
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return res.status(409).json({
      success: false,
      message: "A record with these values already exists.",
      code: "CONFLICT",
    });
  }

  /*
   * Prisma record not found
   */
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return res.status(404).json({
      success: false,
      message: "Resource not found.",
      code: "NOT_FOUND",
    });
  }

  /*
   * Unknown error
   */
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
  });
}