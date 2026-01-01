import { z } from "zod";

export const SettingsSchema = z.object({
  index: z.string().min(1),
  symbol: z.string().min(1),
  dropPercentage: z.number().min(1).max(100),
});

/**
 * Type used everywhere (UI + API)
 */
export type Settings = z.infer<typeof SettingsSchema>;
