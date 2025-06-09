
import { db } from '../db';
import { waitlistTable } from '../db/schema';
import { count } from 'drizzle-orm';

export const getWaitlistCount = async (): Promise<{ count: number }> => {
  try {
    const result = await db.select({ count: count() })
      .from(waitlistTable)
      .execute();

    return {
      count: result[0].count
    };
  } catch (error) {
    console.error('Failed to get waitlist count:', error);
    throw error;
  }
};
