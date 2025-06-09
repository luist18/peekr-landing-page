
import { z } from 'zod';

// Waitlist entry schema
export const waitlistEntrySchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().nullable(),
  company: z.string().nullable(),
  created_at: z.coerce.date()
});

export type WaitlistEntry = z.infer<typeof waitlistEntrySchema>;

// Input schema for joining waitlist
export const joinWaitlistInputSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  name: z.string().nullable().optional(),
  company: z.string().nullable().optional()
});

export type JoinWaitlistInput = z.infer<typeof joinWaitlistInputSchema>;

// Response schema for waitlist operations
export const waitlistResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  entry: waitlistEntrySchema.optional()
});

export type WaitlistResponse = z.infer<typeof waitlistResponseSchema>;
