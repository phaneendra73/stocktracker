import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export async function GET() {
  // @ts-ignore
  const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL ?? "",
  }).$extends(withAccelerate());
  const alerts = await prisma.alertLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(alerts);
}
