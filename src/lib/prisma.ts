import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

let prisma: ReturnType<typeof createPrisma> | null = null;

function createPrisma() {
  const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;

  if (!accelerateUrl) {
    throw new Error("PRISMA_ACCELERATE_URL is not defined");
  }

  return new PrismaClient({
    accelerateUrl,
  }).$extends(withAccelerate());
}

export function getPrisma() {
  if (!prisma) {
    prisma = createPrisma();
  }
  return prisma;
}
