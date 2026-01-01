import prisma from "@/lib/prisma";

/**
 * Yahoo Finance quote response (minimal fields we use)
 */
type YahooQuote = {
  regularMarketPrice: number;
  regularMarketChangePercent: number;
};

type FetchIndexPriceResult = {
  price: number;
  changePercent: number;
};

async function fetchIndexPrice(symbol: string): Promise<FetchIndexPriceResult> {
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(
    symbol
  )}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Yahoo fetch failed");

  const json: {
    quoteResponse: {
      result: YahooQuote[];
    };
  } = await res.json();

  const quote = json.quoteResponse.result[0];

  if (!quote) {
    throw new Error("No quote data returned");
  }

  return {
    price: quote.regularMarketPrice,
    changePercent: quote.regularMarketChangePercent,
  };
}

export async function checkMarket(): Promise<void> {
  console.log("⏰ Market check started");

  const config = await prisma.indexConfig.findFirst();
  if (!config) {
    console.log("⚠️ No config found");
    return;
  }

  const { price, changePercent } = await fetchIndexPrice(config.symbol);

  await prisma.priceHistory.create({
    data: {
      symbol: config.symbol,
      price,
      changePercent,
    },
  });

  console.log("✅ Price stored");
}
