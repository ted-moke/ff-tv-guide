import { z } from "zod";

// Base schemas for common patterns
export const fleaflickerFormattedValueSchema = z.object({
  value: z.number(),
  formatted: z.string(),
});

export const fleaflickerPeriodBoundSchema = z.object({
  duration: z.string(),
  ordinal: z.number(),
  season: z.number(),
  start_epoch_milli: z.string(), // int64 as string
  is_now: z.boolean(),
  label: z.string(),
});

export const fleaflickerSchedulePeriodSchema = z.object({
  ordinal: z.number(),
  low: fleaflickerPeriodBoundSchema,
  high: fleaflickerPeriodBoundSchema,
  contains_now: z.boolean(),
  value: z.number(),
});

export const fleaflickerGameRecordSchema = z.object({
  wins: z.number(),
  losses: z.number(),
  ties: z.number(),
  win_percentage: fleaflickerFormattedValueSchema,
  rank: z.number(),
  formatted: z.string(),
});

export const fleaflickerGamePointsSchema = z.object({
  value: z.number(),
  formatted: z.string(),
});

export const fleaflickerGameTeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  sport: z.string().optional(),
  logo_url: z.string().optional(),
  record_overall: fleaflickerGameRecordSchema.optional(),
  record_division: fleaflickerGameRecordSchema.optional(),
  record_postseason: fleaflickerGameRecordSchema.optional(),
  points_for: fleaflickerGamePointsSchema.optional(),
  points_against: fleaflickerGamePointsSchema.optional(),
});

export const fleaflickerGameScoreSchema = z.object({
  score: fleaflickerGamePointsSchema,
});

export const fleaflickerGameSchema = z.object({
  id: z.string(), // int64 as string
  away: fleaflickerGameTeamSchema,
  home: fleaflickerGameTeamSchema.optional(),
  homeScore: fleaflickerGameScoreSchema.optional(),
  awayScore: fleaflickerGameScoreSchema.optional(),
});

// Main scoreboard response schema - more flexible to handle actual API response
export const fleaflickerScoreboardResponseSchema = z.object({
  schedule_period: fleaflickerSchedulePeriodSchema.optional(),
  eligible_schedule_periods: z.array(fleaflickerSchedulePeriodSchema).optional(),
  games: z.array(fleaflickerGameSchema),
}).or(
  // Fallback: just an array of games
  z.object({
    games: z.array(fleaflickerGameSchema),
  })
).or(
  // Another fallback: direct array of games
  z.array(fleaflickerGameSchema)
);

// Type exports for use in TypeScript
export type FleaflickerScoreboardResponse = z.infer<typeof fleaflickerScoreboardResponseSchema>;
export type FleaflickerGame = z.infer<typeof fleaflickerGameSchema>;
export type FleaflickerGameTeam = z.infer<typeof fleaflickerGameTeamSchema>;
export type FleaflickerSchedulePeriod = z.infer<typeof fleaflickerSchedulePeriodSchema>;
