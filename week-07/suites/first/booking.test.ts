import { describe, expect, it } from 'vitest';
import { canBook, type Interval } from './booking'; // Adjust relative path as needed

describe('canBook() unit tests', () => {
  // Shared fixed 'now' time for deterministic tests
  const NOW = 540; // 09:00 AM in minutes

  // Default baseline bookings fixture: [600, 660]
  const defaultBookings: Interval[] = [{ start: 600, end: 660 }];

  // ---------------------------------------------------------------------------
  // Acceptance Criterion 1: Time Interval Validity (0 <= start < end <= 1440, start > now)
  // ---------------------------------------------------------------------------
  describe('AC1: Time Interval Validity', () => {
    it('T02: returns false when start time equals now (starts now)', () => {
      expect(
        canBook({
          start: 540,
          end: 570,
          now: NOW,
          blocked: false,
          bookings: defaultBookings,
        })
      ).toBe(false);
    });

    it('T03: returns false for zero duration (start === end)', () => {
      expect(
        canBook({
          start: 720,
          end: 720,
          now: NOW,
          blocked: false,
          bookings: defaultBookings,
        })
      ).toBe(false);
    });

    it('T04: returns false when start is greater than end (reversed times)', () => {
      expect(
        canBook({
          start: 750,
          end: 720,
          now: NOW,
          blocked: false,
          bookings: defaultBookings,
        })
      ).toBe(false);
    });

    it('T05: returns false when end time exceeds maximum 1440 minutes', () => {
      expect(
        canBook({
          start: 1380,
          end: 1441,
          now: NOW,
          blocked: false,
          bookings: defaultBookings,
        })
      ).toBe(false);
    });

    it('X1: returns true when end time is exactly 1440 (ends at 24:00 boundary)', () => {
      expect(
        canBook({
          start: 1380,
          end: 1440,
          now: NOW,
          blocked: false,
          bookings: defaultBookings,
        })
      ).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Acceptance Criterion 2: Maximum Duration Limit (<= 120 minutes)
  // ---------------------------------------------------------------------------
  describe('AC2: Maximum Duration Limit', () => {
    it('T06: returns true for a booking of exactly 120 minutes', () => {
      expect(
        canBook({
          start: 720,
          end: 840,
          now: NOW,
          blocked: false,
          bookings: defaultBookings,
        })
      ).toBe(true);
    });

    it('T07: returns false for a booking of 121 minutes (exceeds 120 min max)', () => {
      expect(
        canBook({
          start: 720,
          end: 841,
          now: NOW,
          blocked: false,
          bookings: defaultBookings,
        })
      ).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Acceptance Criterion 3: Blocked Room Check
  // ---------------------------------------------------------------------------
  describe('AC3: Blocked Room State', () => {
    it('T13: returns false when the room is blocked, even with a valid time slot', () => {
      expect(
        canBook({
          start: 660,
          end: 720,
          now: NOW,
          blocked: true,
          bookings: defaultBookings,
        })
      ).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Acceptance Criterion 4: Existing Bookings Overlap Checks
  // ---------------------------------------------------------------------------
  describe('AC4: Existing Bookings Overlap', () => {
    it('T01: returns true when touching existing booking after (ends at 660, starts at 660)', () => {
      expect(
        canBook({
          start: 660,
          end: 720,
          now: NOW,
          blocked: false,
          bookings: defaultBookings,
        })
      ).toBe(true);
    });

    it('T08: returns true when touching existing booking before (starts at 600, ends at 600)', () => {
      expect(
        canBook({
          start: 570,
          end: 600,
          now: NOW,
          blocked: false,
          bookings: defaultBookings,
        })
      ).toBe(true);
    });

    it('T09: returns false for a partial overlap with an existing booking', () => {
      expect(
        canBook({
          start: 630,
          end: 690,
          now: NOW,
          blocked: false,
          bookings: defaultBookings,
        })
      ).toBe(false);
    });

    it('T10: returns false when the requested booking completely encloses an existing booking', () => {
      expect(
        canBook({
          start: 570,
          end: 690,
          now: NOW,
          blocked: false,
          bookings: defaultBookings,
        })
      ).toBe(false);
    });

    it('T11: returns false when the requested booking is completely inside an existing booking', () => {
      expect(
        canBook({
          start: 615,
          end: 645,
          now: NOW,
          blocked: false,
          bookings: defaultBookings,
        })
      ).toBe(false);
    });

    it('T12: returns false for an identical time slot to an existing booking', () => {
      expect(
        canBook({
          start: 600,
          end: 660,
          now: NOW,
          blocked: false,
          bookings: defaultBookings,
        })
      ).toBe(false);
    });

    it('T14: returns true when there are no existing bookings (bookings = [])', () => {
      expect(
        canBook({
          start: 630,
          end: 690,
          now: NOW,
          blocked: false,
          bookings: [],
        })
      ).toBe(true);
    });

    it('X2: returns true when slot fits precisely between two adjacent bookings', () => {
      const adjacentBookings: Interval[] = [
        { start: 600, end: 660 },
        { start: 720, end: 780 },
      ];

      expect(
        canBook({
          start: 660,
          end: 720,
          now: NOW,
          blocked: false,
          bookings: adjacentBookings,
        })
      ).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Acceptance Criterion 5: Data Immutability
  // ---------------------------------------------------------------------------
  describe('AC5: Data Immutability', () => {
    it('ensures the bookings array and objects are not modified during invocation', () => {
      const originalBookings: Interval[] = [
        { start: 600, end: 660 },
        { start: 720, end: 780 },
      ];
      // Create a deep copy reference to assert immutability
      const snapshot = JSON.stringify(originalBookings);

      const decision = canBook({
        start: 660,
        end: 720,
        now: NOW,
        blocked: false,
        bookings: originalBookings,
      });

      expect(decision).toBe(true);
      expect(JSON.stringify(originalBookings)).toBe(snapshot);
      expect(originalBookings).toHaveLength(2);
    });
  });
});