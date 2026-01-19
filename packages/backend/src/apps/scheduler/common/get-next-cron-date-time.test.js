import { describe, expect, it, vi } from 'vitest';
import { DateTime } from 'luxon';
import getNextCronDateTime from './get-next-cron-date-time.js';
import cronTimes from './cron-times.js';

describe('getNextCronDateTime', () => {
  describe('basic cron expressions', () => {
    it('should return next occurrence for every 5 minutes', () => {
      const cronExpression = cronTimes.everyNMinutes(5);
      const now = DateTime.now();

      const result = getNextCronDateTime(cronExpression);

      expect(result).toBeInstanceOf(DateTime);
      expect(result > now).toBe(true);
      // Next occurrence should be within 5 minutes
      expect(result.diff(now, 'minutes').minutes).toBeLessThanOrEqual(5);
    });

    it('should return next occurrence for every hour', () => {
      const cronExpression = cronTimes.everyHour;
      const now = DateTime.now();

      const result = getNextCronDateTime(cronExpression);

      expect(result).toBeInstanceOf(DateTime);
      expect(result > now).toBe(true);
      // Should be at minute 0
      expect(result.minute).toBe(0);
      // Next occurrence should be within 1 hour
      expect(result.diff(now, 'hours').hours).toBeLessThanOrEqual(1);
    });

    it('should return next occurrence for every day at 9 AM', () => {
      const cronExpression = cronTimes.everyDayAt(9);
      const now = DateTime.now();

      const result = getNextCronDateTime(cronExpression);

      expect(result).toBeInstanceOf(DateTime);
      expect(result > now).toBe(true);
      // Should be at 9:00
      expect(result.hour).toBe(9);
      expect(result.minute).toBe(0);
      // Next occurrence should be within 24 hours
      expect(result.diff(now, 'hours').hours).toBeLessThanOrEqual(24);
    });

    it('should return next occurrence for every week on Monday at 9 AM', () => {
      const cronExpression = cronTimes.everyWeekOnAndAt(1, 9); // 1 = Monday
      const now = DateTime.now();

      const result = getNextCronDateTime(cronExpression);

      expect(result).toBeInstanceOf(DateTime);
      expect(result > now).toBe(true);
      // Should be Monday (1)
      expect(result.weekday).toBe(1);
      // Should be at 9:00
      expect(result.hour).toBe(9);
      expect(result.minute).toBe(0);
    });

    it('should return next occurrence for every month on 1st at 9 AM', () => {
      const cronExpression = cronTimes.everyMonthOnAndAt(1, 9);
      const now = DateTime.now();

      const result = getNextCronDateTime(cronExpression);

      expect(result).toBeInstanceOf(DateTime);
      expect(result > now).toBe(true);
      // Should be 1st day of month
      expect(result.day).toBe(1);
      // Should be at 9:00
      expect(result.hour).toBe(9);
      expect(result.minute).toBe(0);
    });

    it('should return next occurrence for every 15 minutes', () => {
      const cronExpression = cronTimes.everyNMinutes(15);
      const now = DateTime.now();

      const result = getNextCronDateTime(cronExpression);

      expect(result).toBeInstanceOf(DateTime);
      expect(result > now).toBe(true);
      // Minute should be divisible by 15 (0, 15, 30, 45)
      expect(result.minute % 15).toBe(0);
      // Next occurrence should be within 15 minutes
      expect(result.diff(now, 'minutes').minutes).toBeLessThanOrEqual(15);
    });

    it('should return next occurrence for weekdays only at 9 AM', () => {
      const cronExpression = cronTimes.everyDayExcludingWeekendsAt(9);
      const now = DateTime.now();

      const result = getNextCronDateTime(cronExpression);

      expect(result).toBeInstanceOf(DateTime);
      expect(result > now).toBe(true);
      // Should be a weekday (1-5, Monday-Friday)
      expect(result.weekday).toBeGreaterThanOrEqual(1);
      expect(result.weekday).toBeLessThanOrEqual(5);
      // Should be at 9:00
      expect(result.hour).toBe(9);
      expect(result.minute).toBe(0);
    });

    it('should handle last day of month pattern', () => {
      vi.useFakeTimers();

      // 9 is actually October (starting from 0)
      const date = new Date(2025, 9, 11, 3, 17, 0, 0);
      vi.setSystemTime(date);

      const cronExpression = cronTimes.everyLastDayOfTheMonthAndAt(20); // last day of the month at 8 PM

      const result = getNextCronDateTime(cronExpression);
      console.log(`result ${result}`);
      expect(result).toBeInstanceOf(DateTime);
      expect(result > date).toBe(true);
      expect(result.day).toBe(31);
      expect(result.hour).toBe(20);
      expect(result.minute).toBe(0);
      vi.useRealTimers();
    });
  });
});
