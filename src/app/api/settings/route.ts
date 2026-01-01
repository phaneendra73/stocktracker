import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { SettingsSchema, type Settings } from "@/lib/schemas/settings";

export async function GET() {
  const prisma = getPrisma();
  const config = await prisma.indexConfig.findFirst();

  const data: Settings = {
    index: config?.indexName ?? "NIFTY 50",
    symbol: config?.symbol ?? "^NSEI",
    dropPercentage: config?.dropPercentage ?? 5,
  };

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const json = await req.json();
  console.log(json);
  const parsed = SettingsSchema.safeParse(json);
  console.log("parsed", parsed);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const body: Settings = parsed.data;

  const prisma = getPrisma();
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
