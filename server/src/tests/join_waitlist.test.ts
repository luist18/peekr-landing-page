
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { waitlistTable } from '../db/schema';
import { type JoinWaitlistInput } from '../schema';
import { joinWaitlist } from '../handlers/join_waitlist';
import { eq } from 'drizzle-orm';

// Test input with all fields
const testInput: JoinWaitlistInput = {
  email: 'test@example.com',
  name: 'John Doe',
  company: 'Test Company'
};

// Minimal test input
const minimalInput: JoinWaitlistInput = {
  email: 'minimal@example.com'
};

describe('joinWaitlist', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should successfully join waitlist with full details', async () => {
    const result = await joinWaitlist(testInput);

    expect(result.success).toBe(true);
    expect(result.message).toEqual('Successfully joined the waitlist!');
    expect(result.entry).toBeDefined();
    expect(result.entry?.email).toEqual('test@example.com');
    expect(result.entry?.name).toEqual('John Doe');
    expect(result.entry?.company).toEqual('Test Company');
    expect(result.entry?.id).toBeDefined();
    expect(result.entry?.created_at).toBeInstanceOf(Date);
  });

  it('should successfully join waitlist with minimal details', async () => {
    const result = await joinWaitlist(minimalInput);

    expect(result.success).toBe(true);
    expect(result.message).toEqual('Successfully joined the waitlist!');
    expect(result.entry).toBeDefined();
    expect(result.entry?.email).toEqual('minimal@example.com');
    expect(result.entry?.name).toBeNull();
    expect(result.entry?.company).toBeNull();
    expect(result.entry?.id).toBeDefined();
    expect(result.entry?.created_at).toBeInstanceOf(Date);
  });

  it('should save entry to database', async () => {
    const result = await joinWaitlist(testInput);

    const entries = await db.select()
      .from(waitlistTable)
      .where(eq(waitlistTable.id, result.entry!.id))
      .execute();

    expect(entries).toHaveLength(1);
    expect(entries[0].email).toEqual('test@example.com');
    expect(entries[0].name).toEqual('John Doe');
    expect(entries[0].company).toEqual('Test Company');
    expect(entries[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle duplicate email gracefully', async () => {
    // First join should succeed
    const firstResult = await joinWaitlist(testInput);
    expect(firstResult.success).toBe(true);

    // Second join with same email should fail gracefully
    const secondResult = await joinWaitlist({
      email: 'test@example.com',
      name: 'Different Name',
      company: 'Different Company'
    });

    expect(secondResult.success).toBe(false);
    expect(secondResult.message).toEqual('This email is already on the waitlist.');
    expect(secondResult.entry).toBeUndefined();
  });

  it('should handle optional fields correctly', async () => {
    const inputWithUndefinedFields: JoinWaitlistInput = {
      email: 'optional@example.com',
      name: undefined,
      company: undefined
    };

    const result = await joinWaitlist(inputWithUndefinedFields);

    expect(result.success).toBe(true);
    expect(result.entry?.name).toBeNull();
    expect(result.entry?.company).toBeNull();

    // Verify in database
    const entries = await db.select()
      .from(waitlistTable)
      .where(eq(waitlistTable.email, 'optional@example.com'))
      .execute();

    expect(entries[0].name).toBeNull();
    expect(entries[0].company).toBeNull();
  });
});
