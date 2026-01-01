import { checkMarket } from "../lib/market";

export default {
  async scheduled(event: ScheduledEvent, env: any, ctx: ExecutionContext) {
    ctx.waitUntil(checkMarket());
  },
};
