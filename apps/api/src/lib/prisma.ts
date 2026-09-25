import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env.js";

const adapter = new PrismaPg({
  connectionString: env.databaseUrl,
});

export const prisma = new PrismaClient({
  adapter,
});