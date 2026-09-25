import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import type { UserRole } from "../../generated/prisma/client.js";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export interface AuthenticatedUser {
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

function isUserRole(value: unknown): value is UserRole {
  return (
    value === "USER" ||
    value === "AUTHOR" ||
    value === "ADMIN"
  );
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.userId !== "string" ||
      !isUserRole(decoded.role)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    console.error("Authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
}

