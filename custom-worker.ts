// @ts-ignore generated at build time
import handler from "./.open-next/worker.js";

import { checkMarket } from "./src/lib/market";

export default {
  // Next.js traffic
  fetch: handler.fetch,

  // Cron trigger
  async scheduled(event: ScheduledEvent, env: any, ctx: ExecutionContext) {
    ctx.waitUntil(checkMarket());
  },
};

// REQUIRED only if you use OpenNext caching features
// @ts-ignore generated at build time
export { DOQueueHandler, DOShardedTagCache } from "./.open-next/worker.js";
