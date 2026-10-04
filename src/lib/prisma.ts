import { PrismaSqlite } from "prisma-adapter-sqlite";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaSqlite({
      url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
    }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
