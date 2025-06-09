
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { waitlistTable } from '../db/schema';
import { getWaitlistCount } from '../handlers/get_waitlist_count';

describe('getWaitlistCount', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return zero count for empty waitlist', async () => {
    const result = await getWaitlistCount();
    
    expect(result.count).toBe(0);
  });

  it('should return correct count with one entry', async () => {
    // Insert one test entry
    await db.insert(waitlistTable)
      .values({
        email: 'test@example.com',
        name: 'Test User',
        company: 'Test Company'
      })
      .execute();

    const result = await getWaitlistCount();
    
    expect(result.count).toBe(1);
  });

  it('should return correct count with multiple entries', async () => {
    // Insert multiple test entries
    await db.insert(waitlistTable)
      .values([
        {
          email: 'user1@example.com',
          name: 'User One',
          company: 'Company A'
        },
        {
          email: 'user2@example.com',
          name: 'User Two',
          company: 'Company B'
        },
        {
          email: 'user3@example.com',
          name: null,
          company: null
        }
      ])
      .execute();

    const result = await getWaitlistCount();
    
    expect(result.count).toBe(3);
  });

  it('should return number type for count', async () => {
    const result = await getWaitlistCount();
    
    expect(typeof result.count).toBe('number');
    expect(Number.isInteger(result.count)).toBe(true);
  });
});
