import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  const prisma = getPrisma();
  const history = await prisma.priceHistory.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(history);
}
