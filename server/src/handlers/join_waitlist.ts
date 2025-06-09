
import { db } from '../db';
import { waitlistTable } from '../db/schema';
import { type JoinWaitlistInput, type WaitlistResponse } from '../schema';

export const joinWaitlist = async (input: JoinWaitlistInput): Promise<WaitlistResponse> => {
  try {
    const result = await db.insert(waitlistTable)
      .values({
        email: input.email,
        name: input.name || null,
        company: input.company || null
      })
      .returning()
      .execute();

    const entry = result[0];
    
    return {
      success: true,
      message: 'Successfully joined the waitlist!',
      entry: {
        id: entry.id,
        email: entry.email,
        name: entry.name,
        company: entry.company,
        created_at: entry.created_at
      }
    };
  } catch (error) {
    console.error('Failed to join waitlist:', error);
    
    // Check if this is a unique constraint violation (duplicate email)
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return {
        success: false,
        message: 'This email is already on the waitlist.'
      };
    }
    
    throw error;
  }
};
