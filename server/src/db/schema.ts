
import { serial, text, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const waitlistTable = pgTable('waitlist', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: text('name'),
  company: text('company'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types for the table schema
export type WaitlistEntry = typeof waitlistTable.$inferSelect;
export type NewWaitlistEntry = typeof waitlistTable.$inferInsert;

// Export all tables for proper query building
export const tables = { waitlist: waitlistTable };
