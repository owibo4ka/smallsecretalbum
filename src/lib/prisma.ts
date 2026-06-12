import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to your .env file.");
}

// Prisma 7 requires a driver adapter to connect. PrismaPg uses node-postgres
// and works with any Postgres connection string, including Neon.
const adapter = new PrismaPg({ connectionString });

// In dev, Next.js hot-reload would otherwise create a new client on every
// change and exhaust the database connection pool. Reuse one client instance
// by stashing it on globalThis.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
