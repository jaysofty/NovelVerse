import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../../lib/prisma.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export async function registerUser(input: RegisterInput) {
  const email = input.email.toLowerCase();

  const existingEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingEmail) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const existingProfile = await prisma.profile.findUnique({
    where: {
      username: input.username,
    },
  });

  if (existingProfile) {
    throw new Error("USERNAME_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

const user = await prisma.user.create({
  data: {
    email,
    passwordHash,
    role: input.role,

    profile: {
      create: {
        username: input.username,
        displayName: input.username,
      },
    },
  },

  select: {
    id: true,
    email: true,
    role: true,
    createdAt: true,

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

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return {
    token,
    user,
  };
}

export async function loginUser(input: LoginInput) {
  const email = input.email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (!user.passwordHash) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile
        ? {
            username: user.profile.username,
            displayName: user.profile.displayName,
            bio: user.profile.bio,
            avatarUrl: user.profile.avatarUrl,
          }
        : null,
    },
  };
}