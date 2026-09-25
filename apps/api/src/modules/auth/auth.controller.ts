import type { Request, Response } from "express";

import { loginSchema, registerSchema } from "./auth.schema.js";
import {
  loginUser,
  registerUser,
} from "./auth.service.js";


import { prisma } from "../../lib/prisma.ts";

export async function getMeController(
  req: Request,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },

      select: {
        id: true,
        email: true,
        role: true,

        profile: {
          select: {
            username: true,
            displayName: true,
            bio: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Failed to fetch current user:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch current user",
    });
  }
}


export async function registerController(
  req: Request,
  res: Response,
) {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const user = await registerUser(result.data);

    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          message: "Email is already registered",
        });
      }

      if (error.message === "USERNAME_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          message: "Username is already taken",
        });
      }
    }

    console.error("Registration failed:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
}

export async function loginController(
  req: Request,
  res: Response,
) {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const resultData = await loginUser(result.data);

    return res.status(200).json({
      success: true,
      data: resultData,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.error("Login failed:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
}