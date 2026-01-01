import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { SettingsSchema, type Settings } from "@/lib/schemas/settings";

export async function GET() {
  // @ts-ignore
  const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL ?? "",
  }).$extends(withAccelerate());
  const config = await prisma.indexConfig.findFirst();

  const data: Settings = {
    index: config?.indexName ?? "NIFTY 50",
    symbol: config?.symbol ?? "^NSEI",
    dropPercentage: config?.dropPercentage ?? 5,
  };

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  // @ts-ignore
  const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL ?? "",
  }).$extends(withAccelerate());
  const json = await req.json();
  console.log(json);
  const parsed = SettingsSchema.safeParse(json);
  console.log("parsed", parsed);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const body: Settings = parsed.data;

  const existing = await prisma.indexConfig.findFirst();

  if (existing) {
    await prisma.indexConfig.update({
      where: { id: existing.id },
      data: {
        indexName: body.index,
        symbol: body.symbol,
        dropPercentage: body.dropPercentage,
      },
    });
  } else {
    await prisma.indexConfig.create({
      data: {
        indexName: body.index,
        symbol: body.symbol,
        dropPercentage: body.dropPercentage,
      },
    });
  }

  return NextResponse.json({ success: true });
}
